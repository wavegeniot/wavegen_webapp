import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase!: SupabaseClient
  private router = inject(Router)

  user = new BehaviorSubject<User | null>(null)
  role = signal('')

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.key)

    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session !== null && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
        this.user.next(session!.user)
        this.router.navigate(['/dashboard'])
        this.getCurrentUserRole(session!.user.id)
      } else {
        this.user.next(null)
      }
    })
  }

  async signUp(email: string, password: string, name: string, lastname: string) {
    return this.supabase.auth.signUp(
      {
        email,
        password,

        options: {
          data: {
            name: name,
            lastname: lastname
          }
        }
      }
    )
  }

  async signInWithPassword(email: string, password: string) {
    await this.supabase.auth.signInWithPassword({ email, password })
  }

  async signOut() {
    await this.supabase.auth.signOut()
  }

  getCurrentUserRole(uuid: string) {
    this.getUserRole(uuid)
      .then((data: any) => {
        if (data === '1') {
          this.role.set('ADMIN')
        } else {
          this.role.set('USER')
        }
      })
  }

  async getUserRole(uuid: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('role')
      .eq('id', uuid)

    return { data, error }
  }

  get currentUser() {
    return this.user.asObservable()
  }

  get currentUserRole() {
    return this.role()
  }
}
