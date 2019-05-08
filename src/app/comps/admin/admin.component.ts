import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  productForm = new FormGroup({
    title: new FormControl("", Validators.required),
    categoryID: new FormControl("", Validators.required),
    price: new FormControl(null, Validators.required),
    image: new FormControl("", Validators.required)
  });

  constructor(private usersService: UsersService, private prodsService: ProductsService, private router: Router) { }
  showContent: boolean = false;
  sidebarOpen: boolean = false;
  editOn: boolean = false;
  sidebarWidth: number = 1;
  contentWidth: number = 11;
  prodSearch: string = "";
  itemToEdit: string = "";
  sidebarTitle: string = "Add Product";
  allCategories: any[] = new Array();
  allProducts: any[] = new Array();


  ngOnInit() {
    this.usersService.checkSession().subscribe(data => {
      if (!data.isAdmin) {
        this.router.navigate(['error']);
      } else this.showContent = true;
    });
    this.getAllCategories();
    this.getAllProds();
  }
  

  handleSidebar() {
    if (this.sidebarOpen) {
      this.sidebarWidth = 1;
      this.contentWidth = 11;
      document.getElementsByClassName('admin-content-head')[0].classList.remove('gap');
    } else {
      this.sidebarWidth = 4;
      this.contentWidth = 8;
      document.getElementsByClassName('admin-content-head')[0].classList.add('gap');
    }
    document.getElementById('admin-sidebar').classList.toggle('active');
    this.sidebarOpen = !this.sidebarOpen;
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
  getAllCategories() {
    this.prodsService.getCategories().subscribe(data => {
      this.allCategories = data;
    });
  }

  getProdsByCategory(catgId) {
    this.prodsService.getProductByCategories(catgId).subscribe((data: any) => {
      this.allProducts = data;
      this.allProducts.map(prod => prod.title = prod.title[0].toUpperCase() + prod.title.substring(1));
    });
    this.allCategories.forEach((cat) => {
      if (cat._id === catgId) cat.status = "active";
      else cat.status = "";
    });
  }

  setProductDetails(product) {
    if (!this.sidebarOpen) this.handleSidebar();
    this.editOn = true;
    this.sidebarTitle = product.title;
    this.itemToEdit = product._id;
    let prodsCatg: any = this.allCategories.find(catg => catg._id == product.categoryID);
    prodsCatg = prodsCatg.title;
    this.productForm.setValue({
      title: product.title,
      categoryID: prodsCatg,
      price: product.price,
      image: product.image
    });
  }

  resetSidebar() {
    this.sidebarTitle = "Add Product";
    this.editOn = false;
    this.productForm.reset();
  }

  saveProduct() {
    let catgInput = this.productForm.value.categoryID;
    catgInput = catgInput[0].toUpperCase() + catgInput.substring(1);
    this.prodsService.searchCategory(catgInput).subscribe(data => {
      if (data) {
        this.productForm.value.categoryID = data._id;
        this.prodsService.saveNewProduct(this.productForm.value).subscribe((data: any) => {
          if (data._id) {
            this.getAllProds();
            this.productForm.reset();
          }
        });
      } else {
        this.prodsService.addNewCategory({ title: catgInput }).subscribe((data: any) => {
          this.productForm.value.categoryID = data._id;
          this.prodsService.saveNewProduct(this.productForm.value).subscribe((data: any) => {
            if (data._id) {
              this.getAllCategories();
              this.getAllProds();
              this.productForm.reset();
            }
          });
        });
      }
    });
  }

  editProduct() {
    //   this.itemToEdit is the prod ID    &&&&&&&   this.productForm.value is the prod obj
    let catgInput = this.productForm.value.categoryID;
    catgInput = catgInput[0].toUpperCase() + catgInput.substring(1);
    this.prodsService.searchCategory(catgInput).subscribe(data => {
      if (data) {
        this.productForm.value.categoryID = data._id;
        this.prodsService.updateProduct(this.itemToEdit, this.productForm.value).subscribe((data: any) => {
          if (data._id) {
            this.getAllProds();
            this.resetSidebar();
          }
        });
      } else {
        this.prodsService.addNewCategory({ title: catgInput }).subscribe((data: any) => {
          this.productForm.value.categoryID = data._id;
          this.prodsService.updateProduct(this.itemToEdit, this.productForm.value).subscribe((data: any) => {
            if (data._id) {
              this.getAllCategories();
              this.getAllProds();
              this.resetSidebar();
            }
          });
        });
      }
    });
  }

}
