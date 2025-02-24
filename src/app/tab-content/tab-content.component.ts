import { Component, Input, SimpleChanges } from '@angular/core';
import { MainService } from '../services/main.service';
import { ToasterService } from '../toaster.service';


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

  isAscending = true;
  psize: number = 10;
  currentPage: number = 1;
  pagesArray: number[] = [];
  rowsPerPageOptions: number[] = [10, 20, 50];

  searchQuery: string = '';
  filteredDomains: any[] = [];

  Bakcupdomain: string = '';
  backupdomain: string[] = [];
  isbackupdomain: boolean = false;


  tabs = [
    { id: 'Sport', name: 'SPORT' },
    { id: 'Races', name: 'RACES' },
    { id: 'Exchgames', name: 'EXCHGAMES' },
    { id: 'Tvstreams', name: 'TV STREAMS' },
    { id: 'CasinoStreams', name: 'CASINO STREAMS' }
  ];

  constructor(private mainService: MainService, private toastr: ToasterService) { }
  @Input() filterType: string = 'all';

  ngOnInit() {
    this.fetchDomains();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.filterDomains();
    this.calculatePages();
  }

  fetchDomains() {
    this.mainService.getDomains().subscribe(
      (response: any) => {
        if (response && response.result) {
          this.domains = response.result || [];
          this.filterDomains();
          this.calculatePages();
        }
      }
    );
  }

  onSearchInputChange() {
    this.filterDomains();
    this.calculatePages();
  }

  filterDomains() {
    const query = this.searchQuery.toLowerCase().trim();

    let tempDomains = [];

    if (this.filterType === 'mainscore') {
      tempDomains = this.domains.filter(domain => domain.isMainscore);
    } else if (this.filterType === 'skyfancy') {
      tempDomains = this.domains.filter(domain => domain.isSkyfancy);
    } else if (this.filterType === 'static') {
      tempDomains = this.domains.filter(domain => domain.isStaticDomain);
    } else {
      tempDomains = [...this.domains];
    }

    // search query
    if (query) {
      this.filteredDomains = tempDomains.filter(domain =>
        domain.Domain.toLowerCase().includes(query)
      );
    } else {
      this.filteredDomains = tempDomains;
    }

  }

  addDomain() {
    if (!this.newDomain.trim()) {
      this.toastr.warning('Please enter a valid domain name', 'Warning');
      return;
    }

    const domainData = {
      Domain: this.newDomain,
      isStaticDomain: this.isStaticDomain ? 1 : 0,
      isSkyfancy: this.isSkyfancy ? 1 : 0,
      isMainscore: this.isMainscore ? 1 : 0
    };

    this.mainService.addDomain(domainData).subscribe(
      () => {
        this.toastr.success('Domain added successfully!', 'Success');
        this.newDomain = '';
        this.isStaticDomain = false;
        this.isSkyfancy = false;
        this.isMainscore = false;
        this.fetchDomains();
        this.closeModal();
      }
    );
  }

  editdomain(domain: any) {
    this.id = domain.id;
    this.newDomain = domain.Domain;
    this.isMainscore = domain.isMainscore;
    this.isSkyfancy = domain.isSkyfancy;
    this.isStaticDomain = domain.isStaticDomain;
    this.isupdatedDomain = true;
  }

  openBackupModal(domain: any) {
    this.id = domain.id;
    this.newDomain = domain.Domain || '';
    this.isMainscore = domain.isMainscore || false;
    this.isSkyfancy = domain.isSkyfancy || false;
    this.isStaticDomain = domain.isStaticDomain || false;
    this.Bakcupdomain = '';
    this.mainService.getBackupDomains(this.newDomain).subscribe(
      (res: any) => {
        this.backupdomain = res.result || [];
        this.isbackupdomain = true;
      },
      (error) => {
        console.error('Error fetching backup domains:', error);
        this.isbackupdomain = true;
      }
    );
  }

  removeBackupDomain() {

  }

  // Update domains
  updateDomain() {
    if (!this.newDomain.trim()) {
      this.toastr.error('Main domain cannot be empty!', 'Error');
      return;
    }

    const backupDomainArray = this.Bakcupdomain.split(',')
      .map((domain) => domain.trim())
      .filter((domain) => domain);

    const domainData = {
      Domain: this.newDomain,
      backupDomains: backupDomainArray,
      isStaticDomain: this.isStaticDomain ? 1 : 0,
      isSkyfancy: this.isSkyfancy ? 1 : 0,
      isMainscore: this.isMainscore ? 1 : 0,
    };

    if (!this.id) return;

    this.mainService.editDomain(this.id, domainData).subscribe(
      () => {
        this.toastr.success('Domain updated successfully!', 'Success');
        this.fetchDomains();
        this.closeBackup();
      },
      (error) => {
        this.toastr.error('Failed to update domain.', 'Error');
      }
    );
  }

  // Close the modal
  closeBackup() {
    this.isbackupdomain = false;
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
          this.toastr.success('Domain deleted successfully!', 'Success');
          this.fetchDomains();
          this.closeModal();
        } else {
          this.toastr.error('Failed to delete domain', 'Error');
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
    const totalPages = Math.ceil(this.filteredDomains.length / this.psize);
    this.pagesArray = this.generatePagination(totalPages);
  }

  generatePagination(totalPages: number): number[] {
    const pages: number[] = [];
    const visiblePages = 3;

    if (totalPages <= visiblePages + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (this.currentPage <= visiblePages) {
      for (let i = 1; i <= visiblePages; i++) {
        pages.push(i);
      }
      if (totalPages > visiblePages + 2) {
        pages.push(-1); // '...' ka symbol
      }
      pages.push(totalPages);
    }
    else if (this.currentPage > visiblePages && this.currentPage < totalPages - 3) {
      pages.push(1);
      pages.push(-1); // '...' show karega
      for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push(-1);
      pages.push(totalPages);
    }
    else {
      pages.push(1);
      pages.push(-1);
      for (let i = totalPages - (visiblePages - 1); i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  goToPage(page: number) {
    if (page === -1) return; // Agar '...' pe click ho to kuch na kare
    this.currentPage = page;
    this.calculatePages();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.calculatePages();
    }
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.filteredDomains.length / this.psize)) {
      this.currentPage++;
      this.calculatePages();
    }
  }

  getDisplayedRange(): string {
    const start = (this.currentPage - 1) * this.psize + 1;
    const end = Math.min(this.currentPage * this.psize, this.filteredDomains.length);
    const total = this.filteredDomains.length;
    return `${start} - ${end} of ${total}`;
  }

  onRowsPerPageChange(): void {
    this.currentPage = 1;
    this.calculatePages();
  }

  // custom pagination controls end

  sortDomains() {
    this.isAscending = !this.isAscending;
    this.filteredDomains.sort((a, b) =>
      this.isAscending ? a.Domain.localeCompare(b.Domain) : b.Domain.localeCompare(a.Domain)
    );
  }

}
