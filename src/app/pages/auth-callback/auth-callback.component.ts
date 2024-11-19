import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="max-w-md w-full space-y-8 p-4">
        @if (error()) {
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error() }}</h3>
            </div>
          </div>
        </div>
        } @else {
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"
          ></div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Completing authentication...
          </h2>
        </div>
        }
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private window = inject(DOCUMENT).defaultView!;

  error = signal<string | null>(null);

  ngOnInit() {
    // Get the full URL to handle both development and production
    const currentUrl = this.window.location.href;
    const requestToken = this.route.snapshot.queryParamMap.get('request_token');
    const approved = this.route.snapshot.queryParamMap.get('approved');

    console.log('Auth callback URL:', currentUrl);
    console.log('Request token:', requestToken);
    console.log('Approved:', approved);

    if (!requestToken || approved !== 'true') {
      this.error.set('Authentication was cancelled or invalid');
      setTimeout(() => this.router.navigate(['/login']), 3000);
      return;
    }

    this.authService.createSession(requestToken).subscribe({
      next: () => {
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        console.error('Session creation error:', err);
        this.error.set('Failed to create session. Please try again.');
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
    });
  }
}
