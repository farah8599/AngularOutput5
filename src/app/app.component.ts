import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Product } from './model/products';
import { ProductService } from './Service/products.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'AngularHttpRequest';
  allProducts: Product[] = [];
  isFetching: boolean = false;
  editMode: boolean = false;
  currentProductId: string;
  errorMessage: string = null;
  errorSub: Subscription
  @ViewChild('productsForm') form: NgForm;

  constructor(private productService: ProductService) {

  }
  //constructor(private http: HttpClient){}
  ngOnInit() {
    this.fetchProducts();
    this.errorSub = this.productService.error.subscribe((message) => {
      this.errorMessage = message;
    })
  }

  onProductsFetch() {
    this.fetchProducts();
  }

  onProductCreate(products: { pName: string, desc: string, price: string }) {
    // this.http.post('https://angular-83cee-default-rtdb.firebaseio.com/products.json',products).subscribe((res)=>{console.log(res); });
    if (!this.editMode)
      this.productService.createProduct(products).subscribe((res) => {
        products = Object.assign(products, { id: res['name'] });
        this.allProducts.push(products);
        console.log(products);
      },
        // (err) => {
        //     this.error.next(err.message);
        // }
      );
    else
      this.productService.updateProduct(this.currentProductId, products);
  }

  private fetchProducts() {
    this.isFetching = true;
    this.productService.fetchProduct().subscribe((products) => {
      this.allProducts = products;
      this.isFetching = false;
    }, (err) => {
      this.errorMessage = err.message;
    })
  }

  onDeleteProduct(id: string) {
    console.log(id)
    this.productService.deleteProduct(id).subscribe(() => {
      const index = this.allProducts.findIndex((obj) => 
        obj.id === id
      )
      console.log(index)
      if (index !== -1)
      {
        this.allProducts.splice(index, 1);

      }
      console.log(this.allProducts)
    });
  }

  onDeleteAllProducts() {
    this.productService.deleteAllProducts();
  }

  onEditClicked(id: string) {
    this.currentProductId = id;
    //Get the product based on the id
    let currentProduct = this.allProducts.find((p) => { return p.id === id });
    //console.log(this.form);

    //Populate the form with the product details
    this.form.setValue({
      pName: currentProduct.pName,
      desc: currentProduct.desc,
      price: currentProduct.price
    });

    //Change the button value to update product
    this.editMode = true;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}


