import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display social media links', () => {
    const socialMediaLinks = fixture.debugElement.queryAll(By.css('.social-links a'));
    const expectedLinks = [
      'https://facebook.com/yourcompany',
      'https://twitter.com/yourcompany',
      'https://linkedin.com/company/yourcompany'
    ];
    expect(socialMediaLinks.length).toBe(expectedLinks.length);
    socialMediaLinks.forEach((link, index) => {
      expect(link.nativeElement.getAttribute('href')).toBe(expectedLinks[index]);
      expect(link.nativeElement.getAttribute('target')).toBe('_blank');
    });
  });
  
});
