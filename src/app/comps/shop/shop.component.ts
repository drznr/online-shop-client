import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ProductsService } from '../../services/products.service';
import { CartsService } from '../../services/carts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  constructor(private usersService: UsersService, private prodsService: ProductsService, private cartsService: CartsService, private router: Router) { }
  showContent: boolean = false;
  sidebarOpen: boolean = true;
  sidebarWidth: number = 5;
  shopWidth: number = 7;
  prodSearch: string = "";
  allCategories: any[] = new Array();
  allProducts: any[] = new Array();
  quantity = 1;
  userOnline: any = {};
  currentCart: any = {};
  totalCartValue: number = 0;
  userCartItems: any[] = [];
  showClearCart: boolean = false;

  ngOnInit() {
    this.usersService.checkSession().subscribe(data => {
      if (data.connected) {
        if (data.user.Role === "client") {
          this.showContent = true;
          this.userOnline = data.user;
        } else this.router.navigate(['error']);
      } else this.router.navigate(['error']);
    });
    this.prodsService.getCategories().subscribe((data: any) => {
      this.allCategories = data;
    });
    this.getAllProds();
    this.cartsService.checkOpenCart().subscribe(data => {
      if (data) {
        //USER HAS AN OPEN CART 
        this.currentCart = data;
        this.cartsService.checkCartItems(data._id).subscribe((data: any) => {
          if (data.length > 0) {
            this.userCartItems = data;
            this.handleFinalPrice(data);
            this.showClearCart = true;
          } else {
            return;
          }
        });
      } else {
        //USER DONT HAVE AN OPEN CART 
        this.cartsService.openNewCart().subscribe(data => {
          if (data) {
            //new cart opened for user
            this.currentCart = data;
          }
        });
      }
    });
  }

  handleSidebar() {
    if (this.sidebarOpen) {
      this.sidebarWidth = 1;
      this.shopWidth = 11;
    } else {
      this.sidebarWidth = 5;
      this.shopWidth = 7;
    }
    document.getElementById('shop-sidebar').classList.toggle('active');
    this.sidebarOpen = !this.sidebarOpen;
  }

  getProdsByCategory(catg) {
    this.prodsService.getProductByCategories(catg).subscribe((data: any) => {
      this.allProducts = data;
      this.allProducts.map(prod => prod.title = prod.title[0].toUpperCase() + prod.title.substring(1));
    });
    this.allCategories.forEach((cat) => {
      if (cat._id === catg) cat.status = "active";
      else cat.status = "";
    });
  }

  searchProduct() {
    if (this.prodSearch === "") {
      this.getAllProds();
    } else {
      this.allCategories.forEach((cat) => { cat.status = "" });
      this.prodsService.getProductByName(this.prodSearch).subscribe((data: any) => {
        this.allProducts = data;
        this.allProducts.map(prod => prod.title = prod.title[0].toUpperCase() + prod.title.substring(1));
      });
    }
  }

  getAllProds() {
    this.prodsService.getProducts().subscribe((data: any) => {
      this.allProducts = data;
      this.allProducts.map(prod => prod.title = prod.title[0].toUpperCase() + prod.title.substring(1));
    });
    this.allCategories.forEach((cat) => { cat.status = "" });
  }
  openProdModal(id) {
    let modal = document.getElementById(id);
    modal.style.display = "flex";
  }
  closeProdModal(id) {
    let modal = document.getElementById(id);
    modal.classList.add('removed');
    setTimeout(() => {
      modal.style.display = "none";
      modal.classList.remove('removed');
      this.quantity = 1;
    }, 250);

  }
  handleQuantity(action) {
    if (action === "minus" && this.quantity > 1) this.quantity--;
    else if (action === "plus") this.quantity++;
  }
  addToCart(prod) {
    this.cartsService.checkOpenCart().subscribe(data => {
      let newCartItem = {
        productID: prod._id,
        cartID: data._id,
        quantity: this.quantity,
        finalPrice: (prod.price * this.quantity),
        name: prod.title,
        image: prod.image
      }
      this.cartsService.addCartItem(newCartItem).subscribe(itemData => {
        if (itemData) {
          this.closeProdModal(itemData.productID);
          this.quantity = 1;
          this.cartsService.checkCartItems(itemData.cartID).subscribe(data => {
            this.userCartItems = data;
            this.handleFinalPrice(data);
          });
          this.showClearCart = true;
        }
      });
    });
  }
  handleFinalPrice(data) {
    let valueSum = data.map(i => i.finalPrice);
    valueSum = valueSum.reduce((a, b) => { return a + b }, 0);
    this.totalCartValue = valueSum;
  }

  removeCartItem(itemID) {
    this.cartsService.removeCartItem(itemID).subscribe(data => {
      if (data._id) {
        this.cartsService.checkCartItems(data.cartID).subscribe(data => {
          this.userCartItems = data;
          this.handleFinalPrice(data);
          if (data.length === 0) this.showClearCart = false;
        });
      }
    })
  }

  clearCart() {
    this.cartsService.clearCart(this.currentCart._id).subscribe(data => {
      if (data.ok) {
        this.cartsService.checkCartItems(data.cartID).subscribe(data => {
          this.userCartItems = data;
        });
        this.showClearCart = false;
        this.totalCartValue = 0;
      }
    });
  }

}
