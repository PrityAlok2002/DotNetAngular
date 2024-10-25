import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TagService } from '../../services/tag.service';
import { ProductTagsComponent } from './product-tags.component';
import { Tag } from '../../models/tag.model';

describe('ProductTagsComponent', () => {
  let component: ProductTagsComponent;
  let fixture: ComponentFixture<ProductTagsComponent>;
  let tagServiceMock: jasmine.SpyObj<TagService>;

  const mockTags: Tag[] = [
    { tagName: 'Tag1', taggedProducts: 1, published: true },
    { tagName: 'Tag2', taggedProducts: 2, published: false }
  ];

  beforeEach(async () => {
    const tagServiceSpy = jasmine.createSpyObj('TagService', ['getTags', 'addTag', 'updateTag', 'deleteTag']);

    await TestBed.configureTestingModule({
      declarations: [ProductTagsComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, MatSnackBarModule],
      providers: [
        { provide: TagService, useValue: tagServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTagsComponent);
    component = fixture.componentInstance;
    tagServiceMock = TestBed.inject(TagService) as jasmine.SpyObj<TagService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tags on initialization', () => {
    tagServiceMock.getTags.and.returnValue(of(mockTags));
    fixture.detectChanges();

    expect(component.tags.length).toBe(2);
    expect(component.noDataFound).toBeFalse();
  });

  it('should handle error when loading tags', () => {
    tagServiceMock.getTags.and.returnValue(throwError('Error loading tags'));
    fixture.detectChanges();

    expect(component.noDataFound).toBeTrue();
  });

  it('should toggle filter', () => {
    expect(component.filterOpen).toBeFalse();
    component.toggleFilter();
    expect(component.filterOpen).toBeTrue();
    component.toggleFilter();
    expect(component.filterOpen).toBeFalse();
  });

  it('should apply filter and load tags', () => {
    tagServiceMock.getTags.and.returnValue(of(mockTags)); // Ensure getTags returns an observable
    spyOn(component, 'loadTags').and.callThrough();
    component.filter = { tagName: 'Tag1', published: 'Unspecified' }; // Ensure filter conditions trigger loadTags
    component.applyFilter();
    expect(component.loadTags).toHaveBeenCalled();
  });



  it('should reset filter and load tags', () => {
    tagServiceMock.getTags.and.returnValue(of(mockTags)); // Ensure getTags returns an observable
    spyOn(component, 'loadTags').and.callThrough();
    component.resetFilter();
    expect(component.filter.tagName).toBe('');
    expect(component.filter.published).toBe('Unspecified');
    expect(component.loadTags).toHaveBeenCalled();
  });

  it('should validate tag name and tagged products before adding tag', () => {
    spyOn(component, 'isTagNameValid').and.returnValue(true);
    spyOn(component, 'isTaggedProductsValid').and.returnValue(true);
    tagServiceMock.addTag.and.returnValue(of());

    component.newTag = { tagName: 'ValidTag', taggedProducts: 123, published: true };
    component.addTag();
    expect(component.isTagNameValid).toHaveBeenCalledWith('ValidTag');
    expect(component.isTaggedProductsValid).toHaveBeenCalledWith(123);
    expect(tagServiceMock.addTag).toHaveBeenCalled();
  });

  it('should not add tag if validation fails', () => {
    spyOn(component, 'isTagNameValid').and.returnValue(false);
    spyOn(component, 'isTaggedProductsValid').and.returnValue(true);

    component.newTag = { tagName: 'InvalidTag', taggedProducts: 123, published: true };
    component.addTag();
    expect(component.isTagNameValid).toHaveBeenCalled();
    expect(tagServiceMock.addTag).not.toHaveBeenCalled();
  });

  it('should update tag', () => {
    tagServiceMock.updateTag.and.returnValue(of());
    const tagToUpdate = { tagName: 'UpdatedTag', taggedProducts: 456, published: true };

    component.updateTag(tagToUpdate);
    expect(tagServiceMock.updateTag).toHaveBeenCalledWith(tagToUpdate);
  });

  it('should delete tag with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    tagServiceMock.deleteTag.and.returnValue(of());

    component.deleteTag(1);
    expect(tagServiceMock.deleteTag).toHaveBeenCalledWith(1);
  });

  it('should cancel delete if confirmation is false', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteTag(1);
    expect(tagServiceMock.deleteTag).not.toHaveBeenCalled();
  });

  it('should toggle sort direction', () => {
    component.tags = mockTags;
    component.toggleSort();
    expect(component.sortDirection).toBe('desc');
    component.toggleSort();
    expect(component.sortDirection).toBe('asc');
  });

  it('should validate tagged products input', () => {
    const event = { target: { value: '123abc4567890' } } as unknown as Event;
    component.validateTaggedProducts(event);
    expect(component.newTag.taggedProducts).toBe(1234567890);
  });

  it('should validate tag name input', () => {
    const event = { target: { value: 'TagName@123' } } as unknown as Event;
    component.validateTagName(event);
    expect(component.newTag.tagName).toBe('TagName123');
  });

  it('should show confirmation popup', () => {
    component.showConfirmationPopup(1);
    expect(component.tagIdToDelete).toBe(1);
    expect(component.showConfirmPopup).toBeTrue();
  });

  it('should cancel delete', () => {
    component.cancelDelete();
    expect(component.tagIdToDelete).toBeUndefined();
    expect(component.showConfirmPopup).toBeFalse();
  });

  it('should validate tag name correctly', () => {
    expect(component.isTagNameValid('ValidName123')).toBeTrue();
    expect(component.isTagNameValid('Invalid Name!')).toBeFalse();
  });

  it('should validate tagged products correctly', () => {
    expect(component.isTaggedProductsValid(1234567890)).toBeTrue();
    expect(component.isTaggedProductsValid(12345678901)).toBeFalse();
  });
});
