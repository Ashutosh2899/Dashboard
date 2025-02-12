import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from '../toaster.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    standalone: false
})
export class HeaderComponent {

    isActive: boolean = false;
    activeItem = 'dashboard';

    constructor(private router: Router,private toastr: ToasterService) { }

    toggleSidebar() {
        this.isActive = !this.isActive;
    }

    Logout() {
        localStorage.clear();
        this.toastr.success('Logout successful!', 'Success'); // ✅ Show toaster
        this.router.navigate(['/login']);
      }
}


