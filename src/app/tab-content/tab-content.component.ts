import { Component } from '@angular/core';
import { MainService } from '../services/main.service';


@Component({
    selector: 'app-tab-content',
    templateUrl: './tab-content.component.html',
    styleUrls: ['./tab-content.component.css'],
    standalone: false
})
export class TabContentComponent {

  activeTab = 'Sport';
  id: string = '';
  domains: any[] = [];
  newDomain: string = '';
  isSkyfancy: boolean = false;
  isMainscore: boolean = false;
  isStaticDomain: boolean = false;
  isModalOpen: boolean = false;
  isupdatedDomain: boolean = false;
  isremoveDomain: boolean = false;

  psize: number = 10;
  currentPage: number = 1;
  pagesArray: number[] = [];
  rowsPerPageOptions: number[] = [10, 20, 50];

  searchQuery: string = '';
  filteredDomains: any[] = [];


  tabs = [
    { id: 'Sport', name: 'SPORT' },
    { id: 'Races', name: 'RACES' },
    { id: 'Exchgames', name: 'EXCHGAMES' },
    { id: 'Tvstreams', name: 'TV STREAMS' },
    { id: 'CasinoStreams', name: 'CASINO STREAMS' }
  ];

  constructor(private mainService: MainService) { }

  ngOnInit() {
    this.fetchDomains();
  }

  fetchDomains() {
    this.mainService.getDomains().subscribe((response: any) => {
      if (response && response.result) {
        this.domains = response.result || [];
        this.filterDomains();
        this.calculatePages();
      }
    });
  }

  filterDomains() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredDomains = this.domains.filter(domain =>
      domain.Domain.toLowerCase().includes(query)
    );
  }

  onSearchInputChange() {
    this.filterDomains();
    this.calculatePages();
  }

  addDomain() {
    if (!this.newDomain.trim()) {
      return;
    }

    const domainData = {
      Domain: this.newDomain,
      isStaticDomain: this.isStaticDomain ? 1 : 0,
      isSkyfancy: this.isSkyfancy ? 1 : 0,
      isMainscore: this.isMainscore ? 1 : 0
    };

    this.mainService.addDomain(domainData).subscribe(() => {
      this.newDomain = '';
      this.isStaticDomain = false;
      this.isSkyfancy = false;
      this.isMainscore = false;
      this.fetchDomains();
      this.closeModal();
    });
  }

  editdomain(domain: any) {
    this.id = domain.id;
    this.newDomain = domain.Domain;
    this.isMainscore = domain.isMainscore;
    this.isSkyfancy = domain.isSkyfancy;
    this.isStaticDomain = domain.isStaticDomain;
    this.isupdatedDomain = true;
  }

  updateDomain() {
    if (!this.newDomain.trim()) return;
    const domainData = {
      Domain: this.newDomain,
      isStaticDomain: this.isStaticDomain ? 1 : 0,
      isSkyfancy: this.isSkyfancy ? 1 : 0,
      isMainscore: this.isMainscore ? 1 : 0,
    };

    if (!this.id) return;

    this.mainService.editDomain(this.id, domainData).subscribe(
      () => {
        this.fetchDomains();
        this.closeModal();
      },
      (error) => {
        console.error('Error updating domain:', error);
      }
    );
  }

  resetFields() {
    this.newDomain = '';
    this.isMainscore = false;
    this.isSkyfancy = false;
    this.isStaticDomain = false;
  }

  removedomain(domainId: string) {
    this.id = domainId;
    this.isremoveDomain = true;
  }

  deleteDomain(): void {
    if (!this.id) {
      return;
    }
    this.mainService.deleteDomain(this.id).subscribe(
      (resp: any) => {
        if (resp && resp.errorCode === 0) {
          this.fetchDomains();
          this.closeModal();
        }
      }
    );
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isupdatedDomain = false;
    this.isremoveDomain = false;
    this.resetFields();
  }

  // custom pagination controls start

  calculatePages() {
    const totalPages = Math.ceil(this.domains.length / this.psize);
    this.pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.pagesArray.length) {
      this.currentPage++;
    }
  }

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.psize + 1;
    const end = Math.min(this.currentPage * this.psize, this.domains.length);
    const total = this.domains.length;
    return `${start} - ${end} of ${total}`;
  }

  onRowsPerPageChange(): void {
    this.currentPage = 1;
    this.calculatePages();
  }

  // custom pagination controls end

  isAscending = true;

  sortDomains() {
    this.isAscending = !this.isAscending;
    this.filteredDomains.sort((a, b) =>
      this.isAscending ? a.Domain.localeCompare(b.Domain) : b.Domain.localeCompare(a.Domain)
    );
  }

}
