import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ManufacturerListComponent } from './manufacturer-list.component';
import { ManufacturerService } from '../../services/manufacturer-list.service';
import { Manufacturer } from '../../models/manufacturer-list';

describe('ManufacturerListComponent', () => {
  let component: ManufacturerListComponent;
  let fixture: ComponentFixture<ManufacturerListComponent>;
  let mockManufacturerService: jasmine.SpyObj<ManufacturerService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let manufacturers: Manufacturer[];

  beforeEach(async () => {
    manufacturers = [
      { manufacturerId: 1, manufacturerName: 'Manufacturer1', published: true, displayOrder: 1, limitedToVendors: 'Best Deals', createdOn: new Date() },
      { manufacturerId: 2, manufacturerName: 'Manufacturer2', published: true, displayOrder: 2, limitedToVendors: 'Quality Mart', createdOn: new Date() },
      { manufacturerId: 3, manufacturerName: 'Manufacturer1', published: true, displayOrder: 3, limitedToVendors: 'Best Deals', createdOn: new Date() }
    ];

    mockManufacturerService = jasmine.createSpyObj('ManufacturerService', ['getManufacturers']);
    mockManufacturerService.getManufacturers.and.returnValue(of(manufacturers));

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ManufacturerListComponent],
      providers: [
        { provide: ManufacturerService, useValue: mockManufacturerService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize manufacturers on ngOnInit', () => {
    component.ngOnInit();
    expect(component.manufacturers).toEqual(manufacturers);
    expect(component.filteredManufacturers).toEqual(manufacturers);
  });

  it('should toggle filter visibility', () => {
    expect(component.showFilter).toBeFalse();
    component.toggleFilter();
    expect(component.showFilter).toBeTrue();
    component.toggleFilter();
    expect(component.showFilter).toBeFalse();
  });

  it('should filter manufacturers based on filter criteria', () => {
    component.filter.manufacturerName = 'Manufacturer1';
    component.filter.vendor = 'Best Deals';
    component.filterManufacturers();
    expect(component.filteredManufacturers.length).toBe(2);
    expect(component.filteredManufacturers[0].manufacturerName).toBe('Manufacturer1');
  });

  it('should return all manufacturers if no filter criteria are set', () => {
    component.filter.manufacturerName = '';
    component.filter.vendor = '';
    component.filterManufacturers();
    expect(component.filteredManufacturers.length).toBe(3);
  });

  it('should sort manufacturers by given key', () => {
    component.sortManufacturers('manufacturerName');
    expect(component.filteredManufacturers[0].manufacturerName).toBe('Manufacturer1');
    expect(component.filteredManufacturers[1].manufacturerName).toBe('Manufacturer1');
    expect(component.filteredManufacturers[2].manufacturerName).toBe('Manufacturer2');

    component.sortManufacturers('displayOrder');
    expect(component.filteredManufacturers[0].displayOrder).toBe(1);
    expect(component.filteredManufacturers[1].displayOrder).toBe(2);
    expect(component.filteredManufacturers[2].displayOrder).toBe(3);

    component.filteredManufacturers = [
      { manufacturerId: 1, manufacturerName: 'A', published: true, displayOrder: 1, limitedToVendors: 'Vendor1', createdOn: new Date() },
      { manufacturerId: 2, manufacturerName: 'B', published: true, displayOrder: 1, limitedToVendors: 'Vendor2', createdOn: new Date() }
    ];
    component.sortManufacturers('displayOrder');
    expect(component.filteredManufacturers[0].manufacturerName).toBe('A');
    expect(component.filteredManufacturers[1].manufacturerName).toBe('B');
  });

  it('should trim leading and trailing spaces', () => {
    component.filter.manufacturerName = '  LongManufacturerName  ';
    component.onInputChange();
    expect(component.filter.manufacturerName).toBe('LongManufacturerName');
  });

  it('should enforce maximum length', () => {
    component.filter.manufacturerName = 'LongManufacturerNameThatExceedsLength';
    component.onInputChange();
    expect(component.filter.manufacturerName).toBe('LongManufacturerName');
  });

  it('should not alter a short valid name', () => {
    component.filter.manufacturerName = 'ShortName';
    component.onInputChange();
    expect(component.filter.manufacturerName).toBe('ShortName');
  });



  it('should navigate to /manufacturer-details on navigateToManufacturerDetails', () => {
    component.navigateToManufacturerDetails();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/manufacturer-details']);
  });
});
