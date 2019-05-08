import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './comps/main/main.component';
import { ErrorComponent } from './comps/error/error.component';
import { AdminComponent } from './comps/admin/admin.component';
import { ShopComponent } from './comps/shop/shop.component';
import { RegisterComponent } from './comps/register/register.component';
import { OrderComponent } from './comps/order/order.component';

const routes: Routes = [
  {path: "", pathMatch: "full", component: MainComponent},
  {path: "home", component: MainComponent},
  {path: "register", component: RegisterComponent},
  {path: "admin", component: AdminComponent},
  {path: "shop", component: ShopComponent},
  {path: "shop/order", component: OrderComponent},
  {path: "**", component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
