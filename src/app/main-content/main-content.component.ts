import { Component} from '@angular/core';

@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.css'],
    standalone: false
})
export class MainContentComponent {
    selectedFilter: string = 'all'; // Default value

    onFilterChange(filter: string) {
      console.log('Filter received in AppComponent:', filter);
      this.selectedFilter = filter;
    }
}
