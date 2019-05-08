import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { CartsService } from '../../services/carts.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private usersService: UsersService, private cartsService: CartsService, private ordersService: OrdersService, private router: Router) { }
  showContent: boolean = false;
  coverOn: boolean = true;
  cartEmpty: boolean = false;
  dateTakenWarning:boolean = false;
  userOnline: any = {};
  usersCartId: string = "";
  usersCartItems: any[] = [];
  receiptInfo: any[] = [];
  recipeSearch: string = "";
  totalAmount: number = null;
  availableCities: string[] = ["Jerusalem", "Tel-Aviv", "Haifa", "Ashdod", "Rishon-Leziyyon", "Beer-sheba", "Petah-Tikva", "Netanya", "Holon", "Bnei-brak"];

  orderForm = new FormGroup({
    city: new FormControl("", Validators.required),
    street: new FormControl("", Validators.required),
    supplyDate: new FormControl("", Validators.required),
    creditCard: new FormControl("", Validators.required)
  });

  ngOnInit() {
    this.usersService.checkSession().subscribe((data: any) => {
      if (data.connected) {
        if (data.user.Role === "client") {
          this.showContent = true;
          this.userOnline = data.user;
          this.cartsService.checkOpenCart().subscribe((data: any) => {
            if (data) {
              this.usersCartId = data._id;
              this.cartsService.checkCartItems(this.usersCartId).subscribe((data: any) => {
                if (data.length > 0) {
                  // ACTIVE CART
                  this.coverOn = false;
                  this.usersCartItems = data;
                  this.handleFinalPrice(data);
                } else {
                  // EMPTY CART
                  this.cartEmpty = true;
                }
              });
            } else {
              ////    ----USER DONT HAVE A CART rare case cant get there without except from URL after reg 
              this.cartEmpty = true;
            }
          });
        } else this.router.navigate(['error']);
      } else this.router.navigate(['error']);
    });
  }

  searchRecipe() {
    let recipeItems = document.querySelectorAll('.order-item-names');
    recipeItems.forEach((item: any) => {
      if (this.recipeSearch === "") {
        item.style.backgroundColor = "transparent";
      } else {
        if (item.innerHTML.toLowerCase().includes(this.recipeSearch)) {
          item.style.backgroundColor = "yellow";
        } else item.style.backgroundColor = "transparent";
      }
    });
  }

  handleFinalPrice(data) {
    let valueSum = data.map(i => i.finalPrice);
    valueSum = valueSum.reduce((a, b) => { return a + b }, 0);
    this.totalAmount = valueSum;
  }

  fillUserDetails(input) {
    switch (input) {
      case "city": this.orderForm.patchValue({ city: this.userOnline.City });
        break;
      case "street": this.orderForm.patchValue({ street: this.userOnline.Street });
        break;
    }
  }

  validateDate() {
   this.ordersService.getOrdersByDate(this.orderForm.value.supplyDate).subscribe((data:any)=> {
      if (data.length >= 3) {
        this.orderForm.patchValue({supplyDate: ""});
        this.dateTakenWarning = true;
      } else this.dateTakenWarning = false;
   });
  }
  hideNotice() {
    this.dateTakenWarning = false;
  }

  sendOrder() {
    let moreDetails = {
      cartId: this.usersCartId,
      finalPrice: this.totalAmount
    }
     this.ordersService.saveNewOrder({details: moreDetails, form: this.orderForm.value}).subscribe(data=> {
      if (data) {
        // ORDER ADDED   
        this.receiptInfo = this.usersCartItems;  
        this.cartsService.clearCart(this.usersCartId).subscribe(data=> {
         if (data.ok > 0) {
           this.orderForm.reset();
          let modal = document.getElementById('approve-modal');
          modal.style.display = "block";
         }
        });
      } else { 
        // ORDER NOT ADDED 
        let modal = document.getElementById('discline-modal');
        modal.style.display = "block";
      }
     });
  }

  closeModal() {
    let modal = document.getElementById('discline-modal');
    modal.classList.add('removed');
    setTimeout(() => {
      modal.style.display = "none";
      modal.classList.remove('removed');
    }, 250);
  }

  printReceipt() {
   this.ordersService.printReceipt({items: this.receiptInfo}).subscribe((data:any) => {
     window.open(data.path, '_blank');
   });
  }

}
