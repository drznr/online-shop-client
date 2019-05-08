import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ProductsService } from '../../services/products.service';
import { CartsService } from '../../services/carts.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  msg: string = "";
  name: string = "";
  userId: string = "";
  productsNum: number = 0;
  ordersNum: number = 0;
  openCartFrom: string = "";

  constructor(private usersService: UsersService, private prodsService: ProductsService, private cartsService: CartsService, private orderService: OrdersService) { }

  ngOnInit() {
    this.prodsService.getProducts().subscribe((data: any) => {
      this.productsNum = data.length;
    });
    this.orderService.getAllOrders().subscribe((data: any) => {
      this.ordersNum = data.length;
    });
    this.usersService.checkSession().subscribe((data: any) => {
      if (data.connected) {
        this.userId = data.user._id;
        this.name = data.user.Fname;
        this.name = this.name[0].toUpperCase() + this.name.substring(1);
        if (data.user.Role === "admin") {
          this.msg = "Hello " + this.name + "!";
        } else {
          this.cartsService.checkOpenCart().subscribe((data: any) => {
            if (data) {
              this.openCartFrom = data.creationDate;
              this.cartsService.checkCartItems(data._id).subscribe((itemsData: any) => {
                if (itemsData.length !== 0) {
                  // ACTIVE CART
                  this.renderActiveCartMsg(itemsData);
                } else {
                  //EMPTY CART  
                  this.orderService.getUserOrders(this.userId).subscribe((data: any) => {
                    if (data.length > 0) {
                      // THERE ARE ORDERS ----CHECK WHAT'S LAST
                      let ordersDatesArray = data.map(ord => ord.orderDate);
                      let lastOrderDate=ordersDatesArray.slice(-1)[0];
                      lastOrderDate = lastOrderDate.substring(4, 15);
                      this.msg = `Hello ${this.name}, your last order was on ${lastOrderDate}.`;
                    } else this.msg = `Hello ${this.name}, Your'e welcome to start your first shop!`;
                  });
                }
              });
            } else {
              this.msg = `Hello ${this.name}, Your'e welcome to start your first shop!`;
            }
          });
        }
      }
    });
    this.usersService.userLoginEventEmitter.subscribe((data: any) => {
      if (data) {
        this.userId = data._id;
        this.name = data.Fname;
        this.name = this.name[0].toUpperCase() + this.name.substring(1);
        this.cartsService.checkOpenCart().subscribe(data => {
          if (data) {
            this.openCartFrom = data.creationDate;
            this.cartsService.checkCartItems(data._id).subscribe((itemsData: any) => {
              if (itemsData.length !== 0) {
                // ACTIVE CART
                this.renderActiveCartMsg(itemsData);
              } else {
                // EMPTY CART   -
                this.orderService.getUserOrders(this.userId).subscribe((data: any) => {
                  if (data.length > 0) {
                    // THERE ARE ORDERS ----CHECK WHAT'S LAST
                    let ordersDatesArray = data.map(ord => ord.orderDate);
                    let lastOrderDate=ordersDatesArray.slice(-1)[0];
                    lastOrderDate = lastOrderDate.substring(4, 15);
                    this.msg = `Hello ${this.name}, your last order was on ${lastOrderDate}.`;
                  } else this.msg = `Hello ${this.name}, Your'e welcome to start your first shop!`;
                });
              }
            });
          } else {
            this.msg = `Hello ${this.name}, Your'e welcome to start your first shop!`;
          }
        });
      }
    });
    this.usersService.userLogOutEventEmitter.subscribe((data: any) => {
      if (data) {
        this.msg = "";
      }
    });
  }

  renderActiveCartMsg(itemsData) {
    this.cartsService.openCartEventEmitter.emit(true);
    let viewDate = this.openCartFrom.substring(4, 15);
    let priceSum = itemsData.map(item => item.finalPrice);
    priceSum = priceSum.reduce((a, b) => { return a + b }, 0);
    this.msg = `Hello ${this.name}, you have an open cart from ${viewDate}, with the total amout of ${priceSum}$.`;
  }

}
