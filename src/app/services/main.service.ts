import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private apiUrl = 'https://api2.streamingtv.fun:3479';

  constructor(private http: HttpClient) { }

  // addDomain(domain: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/AddDomain`, { Domain: domain, isStaticDomain: 0, isSkyfancy: 1, isMainscore: 0 });
  // }

  addDomain(domainData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddDomain`, domainData);
  }


  getDomains(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getDomain`);
  }

  editDomain(id: string, domainData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/EditDomain/${id}`, domainData);
  }  

  deleteDomain(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeleteDomain/${id}`);
  }  

}
