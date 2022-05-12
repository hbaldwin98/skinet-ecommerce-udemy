import { ShopParams } from './../shared/models/shopParams';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IType } from './../shared/models/productType';

@Injectable({
  providedIn: 'root',
})
export class ShopService implements OnInit {
  products: IProduct[];
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getProducts(new ShopParams());
  }

  /**
   * Retrieve the list of products from our API.
   *
   * @param {number} [brandId] - optional brandId filter
   * @param {number} [typeId] - optional typeId filter
   * @return {*}  {Observable<IPagination>}
   * @memberof ShopService
   */
  getProducts(shopParams: ShopParams): Observable<IPagination> {
    let params = new HttpParams();

    if (shopParams.brandId !== 0) {
      params = params.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId !== 0) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this.http
      .get<IPagination>(this.baseUrl + 'products', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          this.products = response.body.data;
          return response.body;
        })
      );
  }

  getProduct(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  /**
   * Retrieve the list of brand types from our API.
   *
   * @return {*}  {Observable<IBrand[]>}
   * @memberof ShopService
   */
  getBrands(): Observable<IBrand[]> {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  /**
   * Retrieve the list of product types from our API.
   *
   * @return {*}  {Observable<IType[]>}
   * @memberof ShopService
   */
  getTypes(): Observable<IType[]> {
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }
}
