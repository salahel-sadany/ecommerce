import { Component, input, signal, input as routerInput, computed } from '@angular/core';
import { Product } from '../../models/product';
import { CurrencyPipe } from '@angular/common';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-products-grid',
  imports: [ProductCard],
  templateUrl: './products-grid.html',
  styleUrl: './products-grid.css',
})
export default class ProductsGrid {
  protected readonly products = signal<Product[]>([
    {
      id: 'p1',
      name: 'Vanguard Premium Headphones',
      description:
        'Professional grade noise-canceling headphones with spatial audio support and leather ear cups.',
      price: 249.99,
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
      rating: 4.9,
      reviewCount: 1540,
      inStock: true,
      category: 'Electronics',
    },
    {
      id: 'p2',
      name: 'Everest Peak Backpack',
      description:
        'Water-resistant, 30L capacity adventure backpack with a dedicated 16-inch laptop compartment.',
      price: 75.0,
      imageUrl:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      rating: 4.6,
      reviewCount: 890,
      inStock: true,
      category: 'Lifestyle',
    },
    {
      id: 'p3',
      name: 'Titanium Chrono Watch',
      description:
        'Minimalist brushed titanium timepiece with a sapphire crystal face and Italian leather strap.',
      price: 189.0,
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      rating: 4.8,
      reviewCount: 320,
      inStock: false,
      category: 'Accessories',
    },
    {
      id: 'p4',
      name: 'Lumos Mechanical Keyboard',
      description:
        'Tenkeyless mechanical keyboard featuring hot-swappable switches and frosted acrylic casing.',
      price: 129.99,
      imageUrl:
        'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop',
      rating: 4.7,
      reviewCount: 2105,
      inStock: true,
      category: 'Computing',
    },
    {
      id: 'p5',
      name: 'Arcane Wireless Mouse',
      description:
        'Ergonomic 16,000 DPI sensor mouse with customizable side buttons and ultra-low latency.',
      price: 59.5,
      imageUrl:
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop',
      rating: 4.4,
      reviewCount: 450,
      inStock: true,
      category: 'Computing',
    },
  ]);

  protected readonly category = routerInput.required<string>();

  protected readonly filteredProducts = computed(() =>
    this.category() === 'all'
      ? this.products()
      : this.products().filter((p) => p.category.toLowerCase() === this.category().toLowerCase()),
  );
}
