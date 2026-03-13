import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule],
  styles: [
    `.container { height: 100vh; }`,
    `.sidenav { width: 240px; padding: 1rem; background: #fff; border-right: 1px solid #e7ecf3; }`,
    `.menu-link { display: block; padding: .5rem .75rem; border-radius: 8px; text-decoration: none; color: #23395d; margin-bottom: .25rem; }`,
    `.menu-link.active { background: #e9f1ff; font-weight: 600; }`,
    `.content { padding: 1rem; overflow: auto; min-height: calc(100vh - 64px); }`
  ],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav mode="side" opened class="sidenav">
        <h3>Gestion Étudiants</h3>
        <a class="menu-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a class="menu-link" routerLink="/students" routerLinkActive="active">Étudiants</a>
        <a class="menu-link" routerLink="/classes" routerLinkActive="active">Classes</a>
        <a class="menu-link" routerLink="/departments" routerLinkActive="active">Filières</a>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Backoffice scolaire</span>
          <span class="spacer"></span>
          <button mat-button (click)="logout()"><mat-icon>logout</mat-icon> Déconnexion</button>
        </mat-toolbar>
        <main class="content"><router-outlet /></main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
