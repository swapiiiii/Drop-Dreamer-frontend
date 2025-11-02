import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  products: any[] = [];
  loading = false;
  error = '';

  private baseUrl = 'https://drop-dreamer-backend-production.up.railway.app';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
  const user = localStorage.getItem('user');

  if (user) {
    const parsedUser = JSON.parse(user);
    this.isLoggedIn = true;
    this.username = parsedUser.firstName || parsedUser.email || 'User';
  } else {
    // ✅ Don't redirect — just show products publicly
    this.isLoggedIn = false;
  }

  this.fetchProducts();
}


  // ✅ Fetch all products from backend
  fetchProducts() {
    this.loading = true;
    this.http.get(`${this.baseUrl}/products`).subscribe({
      next: (res: any) => {
        this.loading = false;
        // Ensure array type
        this.products = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to fetch products. Please try again.';
        console.error('❌ Product fetch error:', err);
      }
    });
  }

  // ✅ Logout and redirect to login page
  logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  this.isLoggedIn = false;
  this.username = '';
  
  // ✅ Redirect back to public products page instead of login
  this.router.navigate(['/products']);
}

}
