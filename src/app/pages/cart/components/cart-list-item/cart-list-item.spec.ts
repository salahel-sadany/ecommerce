import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListItem } from './cart-list-item';

describe('CartListItem', () => {
  let component: CartListItem;
  let fixture: ComponentFixture<CartListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartListItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartListItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
