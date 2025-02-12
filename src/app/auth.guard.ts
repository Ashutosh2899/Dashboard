import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from './services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,private tokenService : TokenService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userInfo = this.tokenService.getUserInfo();
    if (userInfo) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
