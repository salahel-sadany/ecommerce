import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemsList } from './cart-items-list';

describe('CartItemsList', () => {
  let component: CartItemsList;
  let fixture: ComponentFixture<CartItemsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartItemsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartItemsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
