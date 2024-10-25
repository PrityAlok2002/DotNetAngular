import { Component, OnInit } from '@angular/core';
import { Manufacturer } from '../../models/manufacturer-list';
import { ManufacturerService } from '../../services/manufacturer-list.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manufacturer-list',
  templateUrl: './manufacturer-list.component.html',
  styleUrls: ['./manufacturer-list.component.css']
})
export class ManufacturerListComponent implements OnInit {
  manufacturers: Manufacturer[] = [];
  filteredManufacturers: Manufacturer[] = [];
  vendors: string[] = []; 
  showFilter: boolean = false;
  filter: any = {
    manufacturerName: '',
    vendor: ''
  };


  constructor(private manufacturerService: ManufacturerService, private router: Router) { }

  ngOnInit(): void {
    this.getManufacturers();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onInputChange() {
    if (this.filter.manufacturerName) {
      this.filter.manufacturerName = this.filter.manufacturerName.replace(/^\s+/, '');
    }

    if (this.filter.manufacturerName.length > 20) {
      this.filter.manufacturerName = this.filter.manufacturerName.substring(0, 20);
    }
    this.applyFilter();
  }

  applyFilter(): void {
    this.filterManufacturers();
  }

  filterManufacturers(): void {
    this.filteredManufacturers = this.manufacturers.filter(manufacturer =>
      manufacturer.manufacturerName.toLowerCase().includes(this.filter.manufacturerName.toLowerCase()) &&
      (!this.filter.vendor || manufacturer.limitedToVendors.includes(this.filter.vendor))
    );
  }

  getManufacturers(): void {
    this.manufacturerService.getManufacturers().subscribe((data: Manufacturer[]) => {
      this.manufacturers = data;
      this.filteredManufacturers = data;
      this.vendors = this.extractVendors(data);
    });
  }

  extractVendors(manufacturers: Manufacturer[]): string[] {
    const vendorSet = new Set<string>();
    manufacturers.forEach(manufacturer => {
      manufacturer.limitedToVendors.split(',').forEach(vendor => vendorSet.add(vendor.trim()));
    });
    return Array.from(vendorSet);
  }

  sortManufacturers(key: keyof Manufacturer): void {
    const direction = this.sortDirection[key] || 'asc';
    this.sortDirection[key] = direction === 'asc' ? 'desc' : 'asc';
    this.filteredManufacturers.sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  sortDirection: { [key: string]: 'asc' | 'desc' } = {};

  navigateToManufacturerDetails() {
    this.router.navigate(['/manufacturer-details']);
  }
}
