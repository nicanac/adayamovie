import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

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
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
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
          <h2
            class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900"
          >
            Completing authentication...
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Please wait while we finish setting up your account
          </p>
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

  error = signal<string | null>(null);

  ngOnInit() {
    const requestToken = this.route.snapshot.queryParamMap.get('request_token');
    const approved = this.route.snapshot.queryParamMap.get('approved');

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
        this.error.set('Failed to create session. Please try again.');
        console.error('Session creation error:', err);
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
    });
  }
}
