import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './comps/header/header.component';
import { MainComponent } from './comps/main/main.component';
import { ErrorComponent } from './comps/error/error.component';
import { LoginComponent } from './comps/login/login.component';
import { AboutComponent } from './comps/about/about.component';
import { NotificationsComponent } from './comps/notifications/notifications.component';
import { AdminComponent } from './comps/admin/admin.component';
import { ShopComponent } from './comps/shop/shop.component';
import { RegisterComponent } from './comps/register/register.component';
import { OrderComponent } from './comps/order/order.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent,
    ErrorComponent,
    LoginComponent,
    AboutComponent,
    NotificationsComponent,
    AdminComponent,
    ShopComponent,
    RegisterComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
