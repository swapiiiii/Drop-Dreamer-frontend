import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  products: any[] = [];
  loading = false;
  message = '';

  newProduct: any = {
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: '',
    imageUrl5: ''
  };

  editMode = false;
  selectedProductId: number | null = null;

  baseUrl = environment.apiBaseUrl + '/products';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token || JSON.parse(user).role !== 'ADMIN') {
      alert('Unauthorized: Admin only');
      this.router.navigate(['/login']);
      return;
    }

    this.fetchProducts();
  }

  // Auth Header
  getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      })
    };
  }

  // PUBLIC FETCH
  fetchProducts() {
    this.loading = true;

    this.http.get(this.baseUrl).subscribe({
      next: (res: any) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Get products error:', err);
        this.message = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  // ADD OR UPDATE PRODUCT
  saveProduct() {
    this.message = '';

    const cleanProduct = { ...this.newProduct };

    // Remove fields that should not go to backend
    delete cleanProduct.id;
    delete cleanProduct.createdAt;
    delete cleanProduct.updatedAt;

    const headers = this.getAuthHeaders();

    if (this.editMode) {
      // UPDATE
      this.http.put(`${this.baseUrl}/${this.selectedProductId}`, cleanProduct, headers)
        .subscribe({
          next: () => {
            this.message = 'Product updated successfully';
            this.resetForm();
            this.fetchProducts();
          },
          error: (err) => {
            console.error('Update error:', err);
            this.message = 'Failed to update product';
          }
        });

    } else {
      // ADD PRODUCT
      this.http.post(`${this.baseUrl}/add`, cleanProduct, headers)
        .subscribe({
          next: () => {
            this.message = 'Product added successfully';
            this.resetForm();
            this.fetchProducts();
          },
          error: (err) => {
            console.error('Add error:', err);
            this.message = 'Failed to add product';
          }
        });
    }
  }

  // Load product for editing
  editProduct(product: any) {
    this.newProduct = { ...product };
    this.selectedProductId = product.id;
    this.editMode = true;
  }

  // DELETE PRODUCT
  deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;

    const headers = this.getAuthHeaders();

    this.http.delete(`${this.baseUrl}/${id}`, headers).subscribe({
      next: () => {
        this.message = 'Product deleted successfully';
        this.fetchProducts();
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.message = 'Failed to delete product';
      }
    });
  }

  resetForm() {
    this.editMode = false;
    this.selectedProductId = null;
    this.newProduct = {
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      imageUrl4: '',
      imageUrl5: ''
    };
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
