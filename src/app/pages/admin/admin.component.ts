import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products: any[] = [];
  newProduct: any = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: '',
    imageUrl5: ''
  };
  editMode: boolean = false;
  selectedProductId: number | null = null;
  message = '';
  loading = false;

  private baseUrl = 'https://drop-dreamer-backend-production.up.railway.app/products';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // ✅ Redirect non-admin users
    if (!user || !token || JSON.parse(user).role !== 'ADMIN') {
      alert('Unauthorized! Only admin can access this page.');
      this.router.navigate(['/login']);
      return;
    }

    this.fetchProducts();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // ✅ Fetch all products
  fetchProducts() {
    this.loading = true;
    this.http.get(`${this.baseUrl}`).subscribe({
      next: (res: any) => {
        this.products = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.message = '❌ Failed to fetch products';
        console.error(err);
      }
    });
  }

  // ✅ Add or Update product
  saveProduct() {
    const headers = this.getAuthHeaders();

    if (this.editMode && this.selectedProductId) {
      // 🔄 Update product
      this.http.put(`${this.baseUrl}/${this.selectedProductId}`, this.newProduct, { headers }).subscribe({
        next: () => {
          this.message = '✅ Product updated successfully';
          this.resetForm();
          this.fetchProducts();
        },
        error: (err) => {
          this.message = '❌ Failed to update product';
          console.error(err);
        }
      });
    } else {
      // ➕ Add product
      this.http.post(`${this.baseUrl}/add`, this.newProduct, { headers }).subscribe({
        next: () => {
          this.message = '✅ Product added successfully';
          this.resetForm();
          this.fetchProducts();
        },
        error: (err) => {
          this.message = '❌ Failed to add product';
          console.error(err);
        }
      });
    }
  }

  // ✅ Edit product (populate form)
  editProduct(product: any) {
    this.newProduct = { ...product };
    this.selectedProductId = product.id;
    this.editMode = true;
  }

  // ✅ Delete product
  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const headers = this.getAuthHeaders();
    this.http.delete(`${this.baseUrl}/${id}`, { headers }).subscribe({
      next: () => {
        this.message = '🗑️ Product deleted successfully';
        this.fetchProducts();
      },
      error: (err) => {
        this.message = '❌ Failed to delete product';
        console.error(err);
      }
    });
  }

  // ✅ Reset form
  resetForm() {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      imageUrl4: '',
      imageUrl5: ''
    };
    this.selectedProductId = null;
    this.editMode = false;
  }

  // ✅ Logout
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
