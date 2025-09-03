import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private api: ApiService, private router: Router) {}

  get userId(): number | null {
    const raw = localStorage.getItem('userId');
    const id = raw != null ? Number(raw) : null;
    return id != null && !Number.isNaN(id) ? id : null;
  }

  isAuthenticated(): boolean {
    return this.userId != null;
  }

  async signIn(email: string, name?: string): Promise<void> {
    const user = await firstValueFrom(this.api.signin({ email, name }));
    localStorage.setItem('userId', String((user as any).userId));
    localStorage.setItem('email', (user as any).email);
  }

  signOut(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    this.router.navigateByUrl('/');
  }
}