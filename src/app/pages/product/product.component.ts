import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  isLoggedIn = false;
  username = '';
  products: Product[] = [];
  loading = false;
  error = '';

  // ✅ Backend URL
  //private baseUrl = 'https://drop-dreamer-backend-production.up.railway.app';
    private baseUrl=environment.apiBaseUrl ;


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      this.isLoggedIn = true;
      this.username = parsedUser.firstName || parsedUser.email || 'User';
    } else {
      this.isLoggedIn = false;
    }

    this.fetchProducts();
  }

  // ✅ Fetch all products from backend (with 5 image URLs)
  fetchProducts() {
    this.loading = true;
    this.http.get<Product[]>(`${this.baseUrl}/products`).subscribe({
      next: (res) => {
        this.loading = false;
        this.products = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to fetch products. Please try again.';
        console.error('❌ Product fetch error:', err);
      }
    });
  }

  // ✅ Logout and redirect back to products page
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.username = '';
    this.router.navigate(['/products']);
  }
}
