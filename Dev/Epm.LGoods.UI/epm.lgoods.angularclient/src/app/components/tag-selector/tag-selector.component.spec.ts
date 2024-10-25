import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, EMPTY, throwError } from 'rxjs';
import { TagSelectorComponent } from './tag-selector.component';
import { ProductTagService } from '../../services/product-tag.service';
import { Tag } from '../../models/tag.model';

describe('TagSelectorComponent', () => {
  let component: TagSelectorComponent;
  let fixture: ComponentFixture<TagSelectorComponent>;
  let productTagServiceSpy: jasmine.SpyObj<ProductTagService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const productTagSpy = jasmine.createSpyObj('ProductTagService', ['getAllTags', 'addTagsToProduct', 'getTagsForProduct']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error','warning']);

    await TestBed.configureTestingModule({
      declarations: [TagSelectorComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: ProductTagService, useValue: productTagSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    productTagServiceSpy = TestBed.inject(ProductTagService) as jasmine.SpyObj<ProductTagService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSelectorComponent);
    component = fixture.componentInstance;

    productTagServiceSpy.getAllTags.and.returnValue(of({
      $values: [
        { tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true },
        { tagId: 2, tagName: 'Tag2', taggedProducts: 3, published: true },
        { tagId: 3, tagName: 'Tag3', taggedProducts: 0, published: false }
      ]
    }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all tags on init', () => {
    expect(component.allTags.length).toBe(3);
    expect(component.filteredTags.length).toBe(3);
  });

  it('should filter tags based on input', () => {
    component.inputText = 'Tag1';
    component.filterTags();
    expect(component.filteredTags.length).toBe(1);
    expect(component.filteredTags[0].tagName).toBe('Tag1');
  });

  it('should add tag to selected tags', () => {
    const tag: Tag = { tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true };
    component.addTag(tag, new Event('click'));
    expect(component.selectedTags.length).toBe(1);
    expect(component.selectedTags[0].tagName).toBe('Tag1');
  });

  it('should remove tag from selected tags', () => {
    const tag: Tag = { tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true };
    component.selectedTags = [tag];
    component.removeTag(tag, new Event('click'));
    expect(component.selectedTags.length).toBe(0);
  });

  it('should submit tags', () => {
    component.productId = 1;
    component.selectedTags = [
      { tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true },
      { tagId: 2, tagName: 'Tag2', taggedProducts: 3, published: true }
    ];
    productTagServiceSpy.addTagsToProduct.and.returnValue(EMPTY);
    component.submitTags();
    expect(productTagServiceSpy.addTagsToProduct).toHaveBeenCalledWith(1, [1, 2]);
  });

  it('should enable submit button when tags are selected', () => {
    component.selectedTags = [{ tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true }];
    expect(component.canSubmitTags()).toBeTrue();
  });

  it('should disable submit button when no tags are selected', () => {
    component.selectedTags = [];
    expect(component.canSubmitTags()).toBeFalse();
  });

  it('should close dropdown when clicking outside', () => {
    component.showDropdown = true;
    const event = new Event('click');
    Object.defineProperty(event, 'target', { value: document.body });

    component.clickOutside(event);

    expect(component.showDropdown).toBeFalse();
  });

  it('should not close dropdown when clicking inside', () => {
    component.showDropdown = true;
    const event = new Event('click');
    Object.defineProperty(event, 'target', { value: component['elementRef'].nativeElement });

    component.clickOutside(event);

    expect(component.showDropdown).toBeTrue();
  });

  it('should toggle dropdown and filter tags', () => {
    const event = new Event('click');
    spyOn(event, 'stopPropagation');
    spyOn(component, 'filterTags');

    component.showDropdown = false;
    component.toggleDropdown(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.showDropdown).toBeTrue();
    expect(component.filterTags).toHaveBeenCalled();
  });

  it('should filter tags and show dropdown on input', () => {
    spyOn(component, 'filterTags');

    component.handleInput();

    expect(component.filterTags).toHaveBeenCalled();
    expect(component.showDropdown).toBeTrue();
  });

  it('should handle error when submitting tags', () => {
    component.productId = 1;
    component.selectedTags = [{ tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true }];
    const error = new Error('Test error');
    productTagServiceSpy.addTagsToProduct.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    component.submitTags();

    expect(console.error).toHaveBeenCalledWith(error);
    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Failed to add tags to the product. Please try again.', 'Error');
  });
  it('should disable submit button when input is invalid', () => {
    component.selectedTags = [{ tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true }];
    component.inputText = 'InvalidTag';
    component.invalidInput = true;
    expect(component.canSubmitTags()).toBeFalse();
  });
  it('should add tag to selected tags and reset input', () => {
    const tag: Tag = { tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true };
    component.inputText = 'Tag1';
    component.invalidInput = true;
    component.addTag(tag, new Event('click'));
    expect(component.selectedTags.length).toBe(1);
    expect(component.selectedTags[0].tagName).toBe('Tag1');
    expect(component.inputText).toBe('');
    expect(component.invalidInput).toBeFalse();
  });
  it('should navigate to product tags page', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.navigateToProductTag();
    expect(routerSpy).toHaveBeenCalledWith(['/product-tags']);
  });


  it('should handle error when loading existing tags', () => {
    component.productId = 1;
    const error = new Error('Test error');
    productTagServiceSpy.getTagsForProduct.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    component.loadExistingTags();

    expect(console.error).toHaveBeenCalledWith('Error loading existing tags:', error);
    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Failed to load existing tags for the product.', 'Error');
    expect(component.existingTags.length).toBe(0);
  });

  it('should not add tag if it already exists in existingTags', () => {
    const existingTag: Tag = { tagId: 1, tagName: 'ExistingTag', taggedProducts: 5, published: true };
    component.existingTags = [existingTag];
    component.addTag(existingTag, new Event('click'));

    expect(component.selectedTags.length).toBe(0);
    expect(toastrServiceSpy.warning).toHaveBeenCalledWith(
      'The tag "ExistingTag" is already associated with this product.',
      'Warning'
    );
  });

  it('should reload existing tags after successful tag submission', () => {
    component.productId = 1;
    component.selectedTags = [{ tagId: 1, tagName: 'Tag1', taggedProducts: 5, published: true }];
    productTagServiceSpy.addTagsToProduct.and.returnValue(of(void 0));
    spyOn(component, 'loadExistingTags');

    component.submitTags();

    expect(component.loadExistingTags).toHaveBeenCalled();
    expect(component.selectedTags.length).toBe(0);
  });

  it('should handle empty response when loading existing tags', () => {
    component.productId = 1;
    productTagServiceSpy.getTagsForProduct.and.returnValue(of());

    component.loadExistingTags();

    expect(component.existingTags.length).toBe(0);
  });

});
