import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart';
import { ToasterService } from './toaster-service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly toaster = inject(ToasterService);

  private readonly productsSignal = signal<Product[]>([
    // CATEGORY: Electronics
    {
      id: 'p1',
      name: 'Vanguard Headphones',
      description: 'High-fidelity noise canceling headphones with a 40-hour battery.',
      price: 249.99,
      imageUrl: 'https://picsum.photos/id/211/800/450',
      rating: 4.9,
      reviewCount: 1540,
      inStock: true,
      category: 'Electronics',
    },
    {
      id: 'p2',
      name: 'Nebula 4K Projector',
      description: 'Pocket-sized cinema experience with built-in streaming apps.',
      price: 450.0,
      imageUrl: 'https://picsum.photos/id/250/800/450',
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      category: 'Electronics',
    },
    // CATEGORY: Computing
    {
      id: 'p3',
      name: 'Lumos RGB Keyboard',
      description: 'Mechanical switches with customizable backlighting and macro keys.',
      price: 129.99,
      imageUrl: 'https://picsum.photos/id/160/800/450',
      rating: 4.7,
      reviewCount: 2105,
      inStock: true,
      category: 'Computing',
    },
    {
      id: 'p4',
      name: 'Arcane Wireless Mouse',
      description: 'Ergonomic 16k DPI sensor with ultra-low latency wireless tech.',
      price: 59.5,
      imageUrl: 'https://picsum.photos/id/0/800/450',
      rating: 4.4,
      reviewCount: 450,
      inStock: true,
      category: 'Computing',
    },
    {
      id: 'p5',
      name: 'PixelView 27" Monitor',
      description: '4K IPS panel with 144Hz refresh rate for pro-grade color accuracy.',
      price: 380.0,
      imageUrl: 'https://picsum.photos/id/3/800/450',
      rating: 4.8,
      reviewCount: 312,
      inStock: false,
      category: 'Computing',
    },
    // CATEGORY: Home
    {
      id: 'p6',
      name: 'Nordic Oak Table',
      description: 'Solid oak construction with a minimalist Scandinavian design.',
      price: 320.0,
      imageUrl: 'https://picsum.photos/id/42/800/450',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      category: 'Home',
    },
    {
      id: 'p7',
      name: 'Everest Backpack',
      description: 'Waterproof 30L bag with a dedicated tech compartment for commuters.',
      price: 85.0,
      imageUrl: 'https://picsum.photos/id/161/800/450',
      rating: 4.2,
      reviewCount: 670,
      inStock: true,
      category: 'Home',
    },
    // CATEGORY: Fitness
    {
      id: 'p8',
      name: 'Onyx Adjustable Dumbbells',
      description: 'Space-saving weights that adjust from 5 to 50 lbs instantly.',
      price: 399.0,
      imageUrl: 'https://picsum.photos/id/442/800/450',
      rating: 4.7,
      reviewCount: 1102,
      inStock: true,
      category: 'Fitness',
    },
    {
      id: 'p9',
      name: 'Zenith Smart Watch',
      description: 'Comprehensive health tracking with heart rate and sleep analysis.',
      price: 199.0,
      imageUrl: 'https://picsum.photos/id/48/800/450',
      rating: 4.4,
      reviewCount: 890,
      inStock: true,
      category: 'Fitness',
    },
    // CATEGORY: Outdoor
    {
      id: 'p10',
      name: 'Alpine Camping Tent',
      description: 'Ultralight 2-person tent with wind-resistant aerodynamic frame.',
      price: 215.0,
      imageUrl: 'https://picsum.photos/id/103/800/450',
      rating: 4.8,
      reviewCount: 560,
      inStock: false,
      category: 'Outdoor',
    },
    {
      id: 'p11',
      name: 'Solar Power Bank',
      description: 'High-capacity 20k mAh battery with integrated solar panels.',
      price: 65.0,
      imageUrl: 'https://picsum.photos/id/537/800/450',
      rating: 4.6,
      reviewCount: 230,
      inStock: true,
      category: 'Outdoor',
    },
  ]);
  private readonly wishlistProductsSignal = signal<Product[]>([]);
  private readonly categoriesSignal = signal<string[]>([
    'all',
    'electronics',
    'computing',
    'home',
    'Fitness',
    'Outdoor',
  ]);
  private readonly cartItemsSignal = signal<CartItem[]>([]);

  readonly products = this.productsSignal.asReadonly();
  readonly categories = this.categoriesSignal.asReadonly();
  readonly wishlistProducts = this.wishlistProductsSignal.asReadonly();
  readonly cartItems = this.cartItemsSignal.asReadonly();
  readonly cartPrice = computed(() => {
    const subTotal = this.cartItems().reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );
    return subTotal;
  });

  addToWishlist(productId: string, toastIt = true) {
    this.wishlistProductsSignal.update((wishListProducts) => {
      if (this.isInWishlist(productId)) return [...wishListProducts];

      const wishlistedProduct = this.products().find((p) => p.id === productId);

      if (wishlistedProduct) {
        if (toastIt) this.toaster.success('Product is added to wishlist');
        return [...wishListProducts, wishlistedProduct];
      } else return [...wishListProducts];
    });
  }

  removeFromWishlist(productId: string, toastIt = true) {
    this.wishlistProductsSignal.update((wishlistProducts) => {
      const newWishlistProducts = wishlistProducts.filter((p) => p.id !== productId);
      if (toastIt) this.toaster.success('Product is removed from wishlist');
      return newWishlistProducts;
    });
  }

  clearWishlist() {
    this.wishlistProductsSignal.set([]);
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistProducts().some((p) => p.id === productId);
  }

  isInCart(productId: string): boolean {
    return this.cartItems().some((i) => i.product.id === productId);
  }

  addToCart(productId: string, quantity = 1, toastIt = true) {
    const addedProduct = this.products().find((p) => p.id === productId);

    if (!addedProduct) return;

    this.cartItemsSignal.update((items) => {
      if (this.isInCart(productId)) {
        if (toastIt) this.toaster.error('Product is already in cart');
        return items;
      }

      if (toastIt) this.toaster.success('Product is added to cart');
      return [
        ...items,
        {
          product: addedProduct,
          quantity,
        },
      ];
    });
  }

  removeFromCart(productId: string, toastIt = true) {
    this.cartItemsSignal.update((Items) => {
      const newCartItems = Items.filter((i) => i.product.id !== productId);
      if (toastIt) this.toaster.success('Product is removed from Cart');
      return newCartItems;
    });
  }

  increaseQuantity(item: CartItem) {
    this.cartItemsSignal.update((items) =>
      items.map((i) => (i.product.id === item.product.id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity === 1) return;
    this.cartItemsSignal.update((items) =>
      items.map((i) => (i.product.id === item.product.id ? { ...i, quantity: i.quantity - 1 } : i)),
    );
  }

  addAllToCart() {
    const newCartItems: CartItem[] = [];

    this.wishlistProducts().forEach((p) => {
      if (!this.isInCart(p.id)) newCartItems.push({ product: p, quantity: 1 });
    });

    this.cartItemsSignal.update((items) => [...items, ...newCartItems]);
    this.clearWishlist();
  }
}
