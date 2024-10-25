import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProductFilterComponent } from './product-filter.component';
import { ProductFilter } from '../../models/product-filter';

describe('ProductFilterComponent', () => {
  let component: ProductFilterComponent;
  let fixture: ComponentFixture<ProductFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductFilterComponent],
      imports: [FormsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial filterValues set correctly', () => {
    const initialValues: ProductFilter = {
      productName: "",
      productType: "",
      countryOfOrigin: ""
    };
    expect(component.filterValues).toEqual(initialValues);
  });

  it('should update filterValues on handleChange', () => {
    const mockInputElement = {
      name: 'productName',
      value: 'Laptop'
    } as HTMLInputElement;

    const event = {
      target: mockInputElement
    } as unknown as Event;

    component.handleChange(event);

    expect(component.filterValues.productName).toBe('Laptop');
  });



  it('should call onApplyFilters with filterValues on handleSubmit', () => {
    spyOn(component.onApplyFilters, 'emit');

    component.filterValues = {
      productName: 'Phone',
      productType: 'Electronics',
      countryOfOrigin: 'United States'
    };

    component.handleSubmit();

    expect(component.onApplyFilters.emit).toHaveBeenCalledWith(component.filterValues);
  });

  it('should emit closeSidebar event on close button click', () => {
    spyOn(component.closeSidebar, 'emit');

    const closeButton = fixture.debugElement.query(By.css('.close-btn')).nativeElement;
    closeButton.click();

    expect(component.closeSidebar.emit).toHaveBeenCalled();
  });

  it('should not trigger onApplyFilters if form values are empty', () => {
    spyOn(component.onApplyFilters, 'emit');

    component.filterValues = {
      productName: '',
      productType: '',
      countryOfOrigin: ''
    };

    component.handleSubmit();

    expect(component.onApplyFilters.emit).toHaveBeenCalledWith(component.filterValues);
  });

});
