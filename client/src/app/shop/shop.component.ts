import { ShopParams } from './../shared/models/shopParams';
import { IType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true }) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shop: ShopService) {}

  ngOnInit(): void {
    // Retrieve the brands, types, and products for user consumption.
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }
  /**
   * Retrieve the list of products from our shop service
   *
   * @memberof ShopComponent
   */
  getProducts(): void {
    this.shop.getProducts(this.shopParams).subscribe({
      next: (response: IPagination) => {
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: (err) => console.log(err),
    });
  }

  /**
   * Retrieve the list of brands from our shop service
   *
   * @memberof ShopComponent
   */
  getBrands(): void {
    this.shop.getBrands().subscribe({
      next: (response: IBrand[]) => {
        this.brands = [{ id: 0, name: 'All' }, ...response];
      },
      error: (err) => console.log(err),
    });
  }

  /**
   * Retrieve the list of product types from our shop service.
   *
   * @memberof ShopComponent
   */
  getTypes(): void {
    this.shop.getTypes().subscribe({
      next: (response: IType[]) => {
        this.types = [{ id: 0, name: 'All' }, ...response];
      },
      error: (err) => console.log(err),
    });
  }

  onBrandSelected(brandId: number): void {
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number): void {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(sort: any): void {
    this.shopParams.sort = sort.value;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event.page) {
      this.shopParams.pageNumber = event.page;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
