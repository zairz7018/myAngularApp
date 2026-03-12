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
  styles: [`.container{height:100vh}.sidenav{width:240px;padding:1rem}.content{padding:1rem}`],
  template: `
  <mat-sidenav-container class="container">
    <mat-sidenav mode="side" opened class="sidenav">
      <h3>Gestion Étudiants</h3>
      <p><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></p>
      <p><a routerLink="/students" routerLinkActive="active">Étudiants</a></p>
      <p><a routerLink="/classes" routerLinkActive="active">Classes</a></p>
      <p><a routerLink="/departments" routerLinkActive="active">Filières</a></p>
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
