import { AfterViewInit, Component } from '@angular/core';
import Iconify from '@iconify/iconify';
import { ToasterService } from './toaster.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})

export class AppComponent implements AfterViewInit {
  title = 'Dashboard';

  constructor(private toasterService: ToasterService) { }

  ngAfterViewInit(): void {
    Iconify.scan();
  }
  
  showToaster() {
    this.toasterService.success('This is a success message!', 'Success');
  }

  showError() {
    this.toasterService.error('Something went wrong!', 'Error');
  }

  showInfo() {
    this.toasterService.info('This is an info message', 'Info');
  }

  showWarning() {
    this.toasterService.warning('Warning message', 'Warning');
  }

}

