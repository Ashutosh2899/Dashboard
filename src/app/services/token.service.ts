import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

const USER_INFO = 'UserInfo'; 

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) {}

  setUserInfo(userInfo: any) {
    const userInfoString = JSON.stringify(userInfo);
    this.cookieService.set(USER_INFO, userInfoString);
    localStorage.setItem(USER_INFO, userInfoString); 
  }

  getUserInfo() {
    const userInfo = localStorage.getItem(USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  }


  clearUserInfo() {
    this.cookieService.delete(USER_INFO);
    localStorage.removeItem(USER_INFO);
  }

}
