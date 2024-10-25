import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Ensure the template is rendered
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display the header', () => {
    fixture.detectChanges();  // Ensure the template is rendered
    const headerElement = fixture.debugElement.query(By.css('header'));  // Adjust selector as needed
    expect(headerElement).toBeTruthy();  // Ensure the header element exists
  });
  it('should display the logo', () => {
    fixture.detectChanges();  // Ensure the template is rendered
    const logoElement = fixture.debugElement.query(By.css('img'));  // Adjust selector as needed
    expect(logoElement).toBeTruthy();  // Ensure the logo element exists
  });

});
