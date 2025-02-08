import { AfterViewInit, Component } from '@angular/core';
import Iconify from '@iconify/iconify';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})

export class AppComponent implements AfterViewInit {
  title = 'Dashboard';
  ngAfterViewInit(): void {
    Iconify.scan();
  }
}

