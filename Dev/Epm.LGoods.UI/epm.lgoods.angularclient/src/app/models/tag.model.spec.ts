import { Tag } from './tag.model';

describe('Tag Model', () => {
  it('should create a Tag instance with correct properties', () => {
    const tag: Tag = {
      tagId: 1,
      tagName: 'Sample Tag',
      taggedProducts: 5,
      published: true
    };

    expect(tag).toBeTruthy();
    expect(tag.tagId).toBe(1);
    expect(tag.tagName).toBe('Sample Tag');
    expect(tag.taggedProducts).toBe(5);
    expect(tag.published).toBe(true);
  });

  it('should create a Tag instance without optional properties', () => {
    const tag: Tag = {
      tagName: 'Sample Tag',
      taggedProducts: 5,
      published: true
    };

    expect(tag).toBeTruthy();
    expect(tag.tagId).toBeUndefined();
    expect(tag.tagName).toBe('Sample Tag');
    expect(tag.taggedProducts).toBe(5);
    expect(tag.published).toBe(true);
  });
});
