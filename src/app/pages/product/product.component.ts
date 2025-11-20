import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  mainCategory?: string;
  subCategory?: string;
  imageUrl1?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  isLoggedIn = false;
  username = '';
  products: Product[] = [];
  loading = false;
  error = '';

  selectedCategory: string = 'all';

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user) {
      const u = JSON.parse(user);
      this.isLoggedIn = true;
      this.username = u.firstName || u.email || 'User';
    }

    this.fetchProducts(); // default load all
  }

  // 🟦 Fetch Products based on category
  fetchProducts(category: string = 'all') {
  this.loading = true;
  this.error = '';
  this.selectedCategory = category;

  let url = `${this.baseUrl}/products`;

  if (category !== 'all') {
    // ✔ Correct backend parameter name
    url = `${this.baseUrl}/products?mainCategory=${category}`;
  }

  this.http.get<Product[]>(url).subscribe({
    next: (res) => {
      this.loading = false;
      this.products = Array.isArray(res) ? res : [];
    },
    error: (err) => {
      this.loading = false;
      this.error = 'Failed to fetch products. Please try again.';
      console.error("❌ Product fetch error:", err);
    }
  });
}


  filterByCategory(category: string) {
    console.log("Selected category:", category); // debug
    this.fetchProducts(category);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.username = '';
    this.router.navigate(['/products']);
  }
}
