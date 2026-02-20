import { Star, Heart, X } from 'lucide-react';
const fallbackImg = '/zidansh img/realimg/img1.jpg';
import { useEffect, useState, useMemo } from 'react';
import { analyticsService, generateSessionId } from '../lib/analytics';
import { reviewsService } from '../lib/reviews';
import { motion } from 'framer-motion';
import { Product as ProductType } from '../types/product';

interface FeaturedProductsProps {
  addToFavorites: (product: any) => void;
  isFavorite: (productId: number) => boolean;
  highlightedProduct: number | null;
  showAll: boolean;
  setShowAll: (showAll: boolean) => void;
  navigateToProduct: (productId: number) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const products: ProductType[] = [
  {
    id: 1,
    name: 'Yellow, grey and white printed kurta with trousers(No dupatta)',

    brand: 'Zidansh Collection',

    description: `1. Product Details: Yellow, Gray, and White Printed Kurta with Trousers (No Dupatta Visible)
2. Kurta Design:
    * Floral and leaf motifs printed
    * A-line shape
    * Paneled style (implied by the flare and split)
    * Stand collar (Mandarin neck), three-quarter sleeves
    * No visible pockets
    * Calf length with a high straight front slit and flared hem
    * Likely Cotton machine weave fabric
3. Trousers Design:
    * Matching printed Trousers
    * Elasticated or fixed waistband (not fully visible)
    * Slip-on closure
    * Size & Fit: The model (estimated height 5'6" - 5'8") is wearing a size that fits well.
    * Material & Care: Likely Machine Wash/Hand Wash (assuming cotton)
4. Specifications:
    * Sleeve Length: Three-Quarter Sleeves
    * Top Shape: A-Line / Flared
    * Top Type: Kurta
    * Bottom Type: Trousers (Straight/Slim Fit)
    * Dupatta: Without Dupatta (as per image)
    * Top Pattern: Printed (Floral/Leaf motifs)
    * Top Design Styling: Panelled / Front-Slit
    * Top Hemline: Flared (below the slit)`,
    cloth_type: 'A line 2 piece sets',
    basePrice: 699,
    baseOriginalPrice: 1099,
    rating: 4.5,
    reviews: 1234,
    discount: 36,
    images: ['img1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL']
      }
    ],
    variations: [
      { id: 'var_1_1', sku: 'PRD001-S', attributes: { Size: 'S' }, price: 699, originalPrice: 1099, stock: 0, lowStockThreshold: 5, isActive: true },
      { id: 'var_1_2', sku: 'PRD001-M', attributes: { Size: 'M' }, price: 699, originalPrice: 1099, stock: 0, lowStockThreshold: 5, isActive: true },
      { id: 'var_1_3', sku: 'PRD001-L', attributes: { Size: 'L' }, price: 699, originalPrice: 1099, stock: 0, lowStockThreshold: 5, isActive: true },
      { id: 'var_1_4', sku: 'PRD001-XL', attributes: { Size: 'XL' }, price: 699, originalPrice: 1099, stock: 0, lowStockThreshold: 5, isActive: true },
      { id: 'var_1_5', sku: 'PRD001-2XL', attributes: { Size: '2XL' }, price: 699, originalPrice: 1099, stock: 0, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
    // demo 3D model (replace with your product GLB in /public/models/<file>.glb)
    model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  },
  {
    id: 2,
    name: 'White sleeveless kurti with large blue floral print',

    brand: 'Zidansh Collection',

    description: `Kurti Design:
- Large, stylized floral/botanical motifs printed in blue.
- Straight shape
- Basic styling
- Round neck with minimal white embroidery/beadwork near the placket area.
- Sleeveless (tank/cut-off sleeves, additional sleeves added if required)
- Side slits
- Mid-thigh to knee length
- Cotton
- Pattern: Bold, oversized blue floral motifs on a white background, creating a high-contrast look.

Size & Fit: The model (estimated height 5'6" - 5'8") is wearing a size that fits well.

Material & Care: Likely Machine Wash (assuming standard print on cotton).

Specifications:
- Sleeve Length: Sleeveless
- Top Shape: Straight
- Top Type: Kurti
- Dupatta: Without Dupatta (Fusion/Western wear)

Top Pattern: Printed (Bold Floral)

Top Design Styling: Basic/Straight

Top Hemline: Straight with side slits`,
    cloth_type: 'Kurtis',
    basePrice: 349,
    baseOriginalPrice: 599,
    rating: 4.3,
    reviews: 987,
    discount: 42,
    images: ['img2.jpg', 'img2.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL']
      }
    ],
    variations: [
      { id: 'var_2_1', sku: 'PRD002-S', attributes: { Size: 'S' }, price: 349, originalPrice: 599, stock: 18, lowStockThreshold: 5, isActive: true },
      { id: 'var_2_2', sku: 'PRD002-M', attributes: { Size: 'M' }, price: 349, originalPrice: 599, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_2_3', sku: 'PRD002-L', attributes: { Size: 'L' }, price: 349, originalPrice: 599, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_2_4', sku: 'PRD002-XL', attributes: { Size: 'XL' }, price: 349, originalPrice: 599, stock: 8, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 3,
    name: 'Black sleeveless kurti with white print/embroidery',

    brand: 'Zidansh Collection',

    description: `Kurta Design:
- Ethnic motifs in white/silver print and embroidery.Straight shape
- Basic or princess-cut styling
- Round neck with an embroidered and embellished yoke/placket detail.
- Sleeveless (tank/cut-off sleeves, additional sleeves given)
- Side slits
- Mid-calf length
- Cotton

Pattern: White floral/botanical motifs vertically distributed across; detailed yoke embroidery.

Size & Fit: The model (estimated height 5'6" - 5'8") is wearing a size that fits well.

Material & Care: Gentle Hand/Machine Wash

Specifications:
- Sleeve Length: Sleeveless
- Top Shape: Straight
- Top Type: Kurti
- Dupatta: Without Dupatta (Casual wear)

Top Pattern: Printed and Embroidered (Yoke)

Top Design Styling: Basic/Straight

Top Hemline: Straight with side slits`,
    cloth_type: 'Kurtis',
    basePrice: 349,
    baseOriginalPrice: 599,
    rating: 4.4,
    reviews: 756,
    discount: 42,
    images: ['img3.jpg', 'img3.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      { id: 'var_3_1', sku: 'PRD003-S', attributes: { Size: 'S' }, price: 349, originalPrice: 599, stock: 12, lowStockThreshold: 5, isActive: true },
      { id: 'var_3_2', sku: 'PRD003-M', attributes: { Size: 'M' }, price: 349, originalPrice: 599, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_3_3', sku: 'PRD003-L', attributes: { Size: 'L' }, price: 349, originalPrice: 599, stock: 16, lowStockThreshold: 5, isActive: true },
      { id: 'var_3_4', sku: 'PRD003-XL', attributes: { Size: 'XL' }, price: 349, originalPrice: 599, stock: 9, lowStockThreshold: 5, isActive: true },
      { id: 'var_3_5', sku: 'PRD003-2XL', attributes: { Size: '2XL' }, price: 349, originalPrice: 599, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_3_6', sku: 'PRD003-3XL', attributes: { Size: '3XL' }, price: 349, originalPrice: 599, stock: 2, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 4,
    name: 'Pink floral co-ord set',

    brand: 'Zidansh Collection',

    description: `Top Design:
- Large abstract floral/leaf motifs printed in shades of purple and pink with blue accents.
- Straight, slightly tunic-length button-down shirt shape.
- Shirt collar (spread collar), button placket closure.
- Three-quarter sleeves with cuff/roll-up detail.
- Straight hem.
- Rayon Cotton blend fabric.

Trousers Design:
- Matching printed straight-cut trousers.
- Ankle-length.

Size & Fit: The model (estimated height 5'7" - 5'9") is wearing a size that fits well.

Material & Care: Hand Wash/Machine Wash Gentle.

Specifications:
- Sleeve Length: Three-Quarter Sleeves
- Top Shape: Straight/Shirt Style
- Top Type: Shirt/Tunic (Part of a Co-ord Set)
- Bottom Type: Trousers (Straight Cut)
- Dupatta: Without Dupatta (Western/Fusion wear)

Top Pattern: Printed (Abstract Floral)

Top Design Styling: Button-Down Co-ord Set

Top Hemline: Straight`,
    cloth_type: 'Co-ord Sets',
    basePrice: 599,
    baseOriginalPrice: 999,
    rating: 4.8,
    reviews: 856,
    discount: 40,
    images: ['img4.jpg', 'img4.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL']
      }
    ],
    variations: [
      { id: 'var_4_1', sku: 'PRD004-S', attributes: { Size: 'S' }, price: 599, originalPrice: 999, stock: 14, lowStockThreshold: 5, isActive: true },
      { id: 'var_4_2', sku: 'PRD004-M', attributes: { Size: 'M' }, price: 599, originalPrice: 999, stock: 18, lowStockThreshold: 5, isActive: true },
      { id: 'var_4_3', sku: 'PRD004-L', attributes: { Size: 'L' }, price: 599, originalPrice: 999, stock: 11, lowStockThreshold: 5, isActive: true },
      { id: 'var_4_4', sku: 'PRD004-XL', attributes: { Size: 'XL' }, price: 599, originalPrice: 999, stock: 6, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 5,
    name: 'Pink floral printed kurti, paired with dark blue jeans (Casual look)',

    brand: 'Zidansh Collection',

    description: `Kurta Design:
- Small floral motifs printed in white and light pink on a magenta/dusty rose base.
- Straight shape, slightly A-line flare.
- V-neck with a partial button placket and pin-tuck detailing on the yoke.
- Three-quarter sleeves.
- Mid-thigh to knee length with side slits.
- Cotton or Viscose fabric.
- Pattern: Small all-over floral print.

Material & Care: Gentle Hand/Machine Wash

Specifications:
- Sleeve Length: Three-Quarter Sleeves
- Top Shape: Straight / Slightly A-Line
- Top Type: Kurti
- Dupatta: Without Dupatta (Casual wear)

Top Pattern: Printed (Small Floral)

Top Design Styling: Pin-tuck Yoke

Top Hemline: Straight with side slits`,
    cloth_type: 'Kurtis',
    basePrice: 349,
    baseOriginalPrice: 699,
    rating: 4.6,
    reviews: 623,
    discount: 50,
    images: ['img5.jpg', 'img5.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL']
      }
    ],
    variations: [
      { id: 'var_5_1', sku: 'PRD005-S', attributes: { Size: 'S' }, price: 349, originalPrice: 699, stock: 16, lowStockThreshold: 5, isActive: true },
      { id: 'var_5_2', sku: 'PRD005-M', attributes: { Size: 'M' }, price: 349, originalPrice: 699, stock: 21, lowStockThreshold: 5, isActive: true },
      { id: 'var_5_3', sku: 'PRD005-L', attributes: { Size: 'L' }, price: 349, originalPrice: 699, stock: 13, lowStockThreshold: 5, isActive: true },
      { id: 'var_5_4', sku: 'PRD005-XL', attributes: { Size: 'XL' }, price: 349, originalPrice: 699, stock: 7, lowStockThreshold: 5, isActive: true },
      { id: 'var_5_5', sku: 'PRD005-2XL', attributes: { Size: '2XL' }, price: 349, originalPrice: 699, stock: 3, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 6,
    name: 'Peach floral printed kurti, paired with dark blue jeans (Casual look)',

    brand: 'Zidansh Collection',

    description: `Kurta Design:
- Multi-colored floral and botanical motifs printed (shades of blue, orange, brown, green) on a peach/light pink base.
- Straight shape, slightly A-line flare.
- V-neck with a partial button placket and pin-tuck detailing on the yoke (identical design style to the pink kurti).
- Three-quarter sleeves.
- Mid-thigh to knee length with side slits.
- Cotton or Viscose fabric.
- Pattern: Multi-colored dense all-over floral print.

Material & Care: Gentle Hand/Machine Wash

Specifications:
- Sleeve Length: Three-Quarter Sleeves
- Top Shape: Straight / Slightly A-Line
- Top Type: Kurti
- Dupatta: Without Dupatta (Casual wear)

Top Pattern: Printed (Multi-colored Floral)

Top Design Styling: Pin-tuck Yoke

Top Hemline: Straight with side slits`,
    cloth_type: 'Kurtis',
    basePrice: 349,
    baseOriginalPrice: 699,
    rating: 4.7,
    reviews: 445,
    discount: 50,
    images: ['img6.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      { id: 'var_6_1', sku: 'PRD006-S', attributes: { Size: 'S' }, price: 349, originalPrice: 699, stock: 19, lowStockThreshold: 5, isActive: true },
      { id: 'var_6_2', sku: 'PRD006-M', attributes: { Size: 'M' }, price: 349, originalPrice: 699, stock: 24, lowStockThreshold: 5, isActive: true },
      { id: 'var_6_3', sku: 'PRD006-L', attributes: { Size: 'L' }, price: 349, originalPrice: 699, stock: 17, lowStockThreshold: 5, isActive: true },
      { id: 'var_6_4', sku: 'PRD006-XL', attributes: { Size: 'XL' }, price: 349, originalPrice: 699, stock: 10, lowStockThreshold: 5, isActive: true },
      { id: 'var_6_5', sku: 'PRD006-2XL', attributes: { Size: '2XL' }, price: 349, originalPrice: 699, stock: 5, lowStockThreshold: 5, isActive: true },
      { id: 'var_6_6', sku: 'PRD006-3XL', attributes: { Size: '3XL' }, price: 349, originalPrice: 699, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 7,
    name: 'Blue and white polka dot kurta set with two contrasting patterned fabric pieces (a trouser and dupatta)',

    brand: 'Zidansh Collection',

    description: `Kurta Design:
- Large white polka dots printed on a bright blue/teal base.
- A-line shape, slightly flared.
- Round neck with a detailed contrasting yoke featuring white chevron/zigzag and vertical geometric patterns.
- Three-quarter sleeves.
- Partial button placket with three wooden buttons.
- Knee/Calf length.Cotton fabric (as indicated by file name).

Trousers/Dupatta Design:
- Trouser Piece: White chevron/zigzag pattern on a blue/teal base.
- Dupatta Piece: Small white floral/booties pattern on a blue/teal base.

Material & Care: Hand Wash/Machine Wash Gentle).

Specifications:
- Sleeve Length: Three-Quarter Sleeves
- Top Shape: A-Line / Flared
- Top Type: Kurta
- Bottom Type: Trousers (Separate pattern shown)
- Dupatta: Yes (Separate pattern shown)

Top Pattern: Printed (Large Polka Dots)

Top Design Styling: Contrast Yoke / Button Detail

Top Hemline: Flared`,
    cloth_type: '3 piece cotton sets',
    basePrice: 679,
    baseOriginalPrice: 999,
    rating: 4.6,
    reviews: 2341,
    discount: 32,
    images: ['img7.jpg', 'img7.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      { id: 'var_7_1', sku: 'PRD007-S', attributes: { Size: 'S' }, price: 679, originalPrice: 999, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_7_2', sku: 'PRD007-M', attributes: { Size: 'M' }, price: 679, originalPrice: 999, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_7_3', sku: 'PRD007-L', attributes: { Size: 'L' }, price: 679, originalPrice: 999, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_7_4', sku: 'PRD007-XL', attributes: { Size: 'XL' }, price: 679, originalPrice: 999, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_7_5', sku: 'PRD007-2XL', attributes: { Size: '2XL' }, price: 679, originalPrice: 999, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_7_6', sku: 'PRD007-3XL', attributes: { Size: '3XL' }, price: 679, originalPrice: 999, stock: 4, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 8,
    name: 'Jaipuri cotton biscuit 3-piece',

    brand: 'Zidansh Collection',

    description: `Kurta Design:
    * Large white floral and botanical motifs printed on a biscuit/khaki base.
    * straight shape
    * Round neck with a detailed contrasting yoke featuring geometric white patterns.
    * Three-quarter sleeves.
    * Partial button placket with three small wooden buttons
    * Cotton fabric 
 Trousers/Dupatta Design:
    * Trouser Piece: White horizontal geometric/border pattern on a biscuit/khaki base.
    * Dupatta Piece: Same print as the Kurta (large floral) 
    * Material & Care: Hand Wash/Machine Wash Gentle.
 Specifications:
    * Sleeve Length: Three-Quarter Sleeves
    * Top Shape: straight
    * Top Type: Kurta
    * Bottom Type: Trousers (Separate pattern shown)
    * Dupatta: Yes (Separate pattern shown)`,
    cloth_type: '3 piece cotton sets',
    basePrice: 679,
    baseOriginalPrice: 1099,
    rating: 4.7,
    reviews: 1678,
    discount: 38,
    images: ['img8.jpg', 'img8.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL']
      }
    ],
    variations: [
      { id: 'var_8_1', sku: 'PRD008-S', attributes: { Size: 'S' }, price: 679, originalPrice: 1099, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_8_2', sku: 'PRD008-M', attributes: { Size: 'M' }, price: 679, originalPrice: 1099, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_8_3', sku: 'PRD008-L', attributes: { Size: 'L' }, price: 679, originalPrice: 1099, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_8_4', sku: 'PRD008-XL', attributes: { Size: 'XL' }, price: 679, originalPrice: 1099, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_8_5', sku: 'PRD008-2XL', attributes: { Size: '2XL' }, price: 679, originalPrice: 1099, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_8_6', sku: 'PRD008-3XL', attributes: { Size: '3XL' }, price: 679, originalPrice: 1099, stock: 4, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 9,
    name: 'Natural khadi cotton and trousers co-ord set',

    brand: 'Zidansh Collection',

    description: `Top Design:
    * Khadi base with Printed botanical motifs in rustic colors (burnt orange, rust, dark green, brown) along the hem and sleeves.
    * Short Tunic length, straight fit.
    * Stand Collar (Mandarin collar) with a front placket.
    * Three-quarter sleeves with cuff detail.
    * Front slit at the hem.
    *  Khadi Cotton fabric 
 Trousers Design:
    * Matching Off-White/Natural straight-cut trousers.
    * Printed botanical motifs along the hem, matching the tunic print.
    * Bottom Pairing: Styled with beige flats/sandals.
Specifications:
    * Sleeve Length: Three-Quarter Sleeves
    * Top Shape: Straight / Short Tunic
    * Top Type: Kurti/Tunic (Co-ord Set)
    * Bottom Type: Trousers (Straight Cut)
    * Dupatta: Without Dupatta`,
    cloth_type: 'Co-ord Sets',
    basePrice: 750,
    baseOriginalPrice: 1199,
    rating: 4.5,
    reviews: 892,
    discount: 37,
    images: ['img9.jpg', 'img9.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL']
      }
    ],
    variations: [
      { id: 'var_9_1', sku: 'PRD009-S', attributes: { Size: 'S' }, price: 750, originalPrice: 1199, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_9_2', sku: 'PRD009-M', attributes: { Size: 'M' }, price: 750, originalPrice: 1199, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_9_3', sku: 'PRD009-L', attributes: { Size: 'L' }, price: 750, originalPrice: 1199, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_9_4', sku: 'PRD009-XL', attributes: { Size: 'XL' }, price: 750, originalPrice: 1199, stock: 15, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 10,
    name: 'Sleeveless kurti with pink/muave geometric print',

    brand: 'Zidansh Collection',

    description: `Product Details: Sleeveless Kurti with Pink/Mauve Geometric Print
 Kurta Design:
    * Geometric/tiled pattern printed in pink/mauve and white.
    * Straight shape.
    * Round neck with an embroidered and embellished yoke.
    * Sleeveless (additional sleeves given)
    * Cotton 
    * Pattern: Small repeating geometric/checkered block print.
 Specifications:
    * Sleeve Length: Sleeveless
    * Top Shape: Straight
    * Top Type: Kurti
    * Dupatta: Without Dupatta (Fusion wear)`,
    cloth_type: 'Kurtis',
    basePrice: 349,
    baseOriginalPrice: 999,
    rating: 4.6,
    reviews: 734,
    discount: 65,
    images: ['img10.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      { id: 'var_10_1', sku: 'PRD010-S', attributes: { Size: 'S' }, price: 349, originalPrice: 999, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_10_2', sku: 'PRD010-M', attributes: { Size: 'M' }, price: 349, originalPrice: 999, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_10_3', sku: 'PRD010-L', attributes: { Size: 'L' }, price: 349, originalPrice: 999, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_10_4', sku: 'PRD010-XL', attributes: { Size: 'XL' }, price: 349, originalPrice: 999, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_10_5', sku: 'PRD010-2XL', attributes: { Size: '2XL' }, price: 349, originalPrice: 999, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_10_6', sku: 'PRD010-3XL', attributes: { Size: '3XL' }, price: 349, originalPrice: 999, stock: 4, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 11,
    name: 'Blue and white floral printed anarkali set with trouser and dupatta 3-piece suit',

    brand: 'Zidansh Collection',

    description: `2. Kurta Design:
    * Dense white floral/botanical motifs printed on a deep turquoise/teal blue base.
    * Anarkali shape with flare (Ghera).
    * V-neck with an ornate white lace/crochet border on the neckline.
    * Three-quarter sleeves.
    * Tie-up detail (Dori/Tassel) on the side waist.
    * Ankle length.
    * Likely Cotton fabric.
3. Trousers Design:
    * Matching printed trousers with a white geometric/small print pattern on the blue base.
    * Dupatta: Matching printed Dupatta with a dense print and a wide border featuring a larger contrasting white floral design.
4. Specifications:
    * Sleeve Length: Three-Quarter Sleeves
    * Top Shape: Anarkali / Flared
    * Top Type: Kurta
    * Bottom Type: Trousers (Slim/Straight)
    * Dupatta: With Dupatta (Matching Printed)`,
    cloth_type: '3 piece cotton sets',
    basePrice: 999,
    baseOriginalPrice: 1499,
    rating: 4.4,
    reviews: 567,
    discount: 33,
    images: ['img11.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
      }
    ],
    variations: [
      { id: 'var_11_1', sku: 'PRD011-S', attributes: { Size: 'S' }, price: 999, originalPrice: 1499, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_11_2', sku: 'PRD011-M', attributes: { Size: 'M' }, price: 999, originalPrice: 1499, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_11_3', sku: 'PRD011-L', attributes: { Size: 'L' }, price: 999, originalPrice: 1499, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_11_4', sku: 'PRD011-XL', attributes: { Size: 'XL' }, price: 999, originalPrice: 1499, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_11_5', sku: 'PRD011-2XL', attributes: { Size: '2XL' }, price: 999, originalPrice: 1499, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_11_6', sku: 'PRD011-3XL', attributes: { Size: '3XL' }, price: 999, originalPrice: 1499, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_11_7', sku: 'PRD011-4XL', attributes: { Size: '4XL' }, price: 999, originalPrice: 1499, stock: 2, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 12,
    name: 'Dusty rose/muave and beige floral printed A-line kurta and trousers co-ord set',

    brand: 'Zidansh Collection',

    description: `Kurta Design:
* Large stylized beige floral motifs printed on a dusty rose/mauve base.
* A-line shape with a significant flare.
* V-neck
* Three-quarter sleeves.
* Cotton
Trousers Design:
* Matching printed straight-cut trousers with the same floral pattern.
Specifications:
* Sleeve Length: Three-Quarter Sleeves
* Top Shape: A-Line / Flared
* Top Type: Kurta (Part of a Co-ord Set)
* Bottom Type: Trousers (Straight Cut)
* Dupatta: Without Dupatta (as per image)`,
    cloth_type: 'A line 2 piece sets',
    basePrice: 699,
    baseOriginalPrice: 1099,
    rating: 4.7,
    reviews: 1234,
    discount: 36,
    images: ['img12.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL']
      }
    ],
    variations: [
      { id: 'var_12_1', sku: 'PRD012-S', attributes: { Size: 'S' }, price: 699, originalPrice: 1099, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_12_2', sku: 'PRD012-M', attributes: { Size: 'M' }, price: 699, originalPrice: 1099, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_12_3', sku: 'PRD012-L', attributes: { Size: 'L' }, price: 699, originalPrice: 1099, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_12_4', sku: 'PRD012-XL', attributes: { Size: 'XL' }, price: 699, originalPrice: 1099, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_12_5', sku: 'PRD012-2XL', attributes: { Size: '2XL' }, price: 699, originalPrice: 1099, stock: 8, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 13,
    name: 'Red and multi-colour printed kurti',

    brand: 'Zidansh Collection',

    description: `Kurta Design:
* Print resembles Ajrak or traditional block print motifs (concentric geometric and floral shapes) in shades of navy blue, beige/tan, and  on a deep Red/Maroon base.
* A-line shape with a good flare (Ghera).
* Stand collar (Mandarin collar) with a V-cut at the front.
* Three-quarter sleeves.
* Cotton fabric (common for block prints).
Trousers Design:
* Matching printed straight-cut trousers with the same Ajrak-style pattern.

Specifications:
* Sleeve Length: Three-Quarter Sleeves
* Top Shape: A-Line / Flared
* Top Type: Kurta (Part of a Co-ord Set)
* Bottom Type: Trousers (Straight Cut)
* Dupatta: Without Dupatta`,
    cloth_type: 'A line 2 piece sets',
    basePrice: 649,
    baseOriginalPrice: 1099,
    rating: 4.5,
    reviews: 890,
    discount: 41,
    images: ['img13.jpg', 'img13.1.jpg', 'img13.2.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      { id: 'var_13_1', sku: 'PRD013-S', attributes: { Size: 'S' }, price: 649, originalPrice: 1099, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_13_2', sku: 'PRD013-M', attributes: { Size: 'M' }, price: 649, originalPrice: 1099, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_13_3', sku: 'PRD013-L', attributes: { Size: 'L' }, price: 649, originalPrice: 1099, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_13_4', sku: 'PRD013-XL', attributes: { Size: 'XL' }, price: 649, originalPrice: 1099, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_13_5', sku: 'PRD013-2XL', attributes: { Size: '2XL' }, price: 649, originalPrice: 1099, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_13_6', sku: 'PRD013-3XL', attributes: { Size: '3XL' }, price: 649, originalPrice: 1099, stock: 4, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 14,
    name: 'Off-white/natural khadi cotton short kurti with embroidery',

    brand: 'Zidansh Collection',

    description: `Product Details: Off-White/Natural Khadi Cotton short Kurti with embroidery
* Solid Off-White/Natural color.
* Straight fit, short length (mid-thigh or slightly below).
* Round neck with a short slit.
* Intricate multi-colored embroidery on the chest surrounded by floral/leaf elements.
* Three-quarter sleeves with embroidered borders at the cuffs (matching the main border).

Specifications:
* Sleeve Length: Three-Quarter Sleeves
* Top Shape: Straight
* Top Type: Kurti
* Dupatta: Without Dupatta`,
    cloth_type: 'Kurtis',
    basePrice: 399,
    baseOriginalPrice: 799,
    rating: 4.9,
    reviews: 3421,
    discount: 50,
    images: ['img14.jpg', 'img14.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
      }
    ],
    variations: [
      { id: 'var_14_1', sku: 'PRD014-S', attributes: { Size: 'S' }, price: 399, originalPrice: 799, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_14_2', sku: 'PRD014-M', attributes: { Size: 'M' }, price: 399, originalPrice: 799, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_14_3', sku: 'PRD014-L', attributes: { Size: 'L' }, price: 399, originalPrice: 799, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_14_4', sku: 'PRD014-XL', attributes: { Size: 'XL' }, price: 399, originalPrice: 799, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_14_5', sku: 'PRD014-2XL', attributes: { Size: '2XL' }, price: 399, originalPrice: 799, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_14_6', sku: 'PRD014-3XL', attributes: { Size: '3XL' }, price: 399, originalPrice: 799, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_14_7', sku: 'PRD014-4XL', attributes: { Size: '4XL' }, price: 399, originalPrice: 799, stock: 2, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 15,
    name: 'Off-white khadi cotton short kurti with peacock embroidery',

    brand: 'Zidansh Collection',

    description: `Product Details: Off-White Khadi Cotton Short Kurti with Peacock Embroidery
* Solid Off-White/Natural color with a textured Khadi cotton feel.
* Straight fit, short length kurti (typically ending at mid-thigh).
* Simple round neckline.
* Three-quarter length sleeves

Specifications:
* Sleeve Length: Three-Quarter
* Pattern Type: Embroidered (Peacock and Floral)
* Material: Khadi Cotton
* Dupatta: Without Dupatta`,
    cloth_type: 'Kurtis',
    basePrice: 399,
    baseOriginalPrice: 799,
    rating: 4.8,
    reviews: 2100,
    discount: 50,
    images: ['img15.jpg', 'img15.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL']
      }
    ],
    variations: [
      { id: 'var_15_1', sku: 'PRD015-S', attributes: { Size: 'S' }, price: 399, originalPrice: 799, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_15_2', sku: 'PRD015-M', attributes: { Size: 'M' }, price: 399, originalPrice: 799, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_15_3', sku: 'PRD015-L', attributes: { Size: 'L' }, price: 399, originalPrice: 799, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_15_4', sku: 'PRD015-XL', attributes: { Size: 'XL' }, price: 399, originalPrice: 799, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_15_5', sku: 'PRD015-2XL', attributes: { Size: '2XL' }, price: 399, originalPrice: 799, stock: 8, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 16,
    name: 'Floral embroidered cream/beige with maroon print',

    brand: 'Zidansh Collection',

    description: `Product Details:
* Color: Cream/Beige with Maroon Print
* Sleeve Length: 3/4th Sleeves
* Pattern: Floral / Embroidered
* Occasion: Casual, Festive, Fusion Wear
* Wash Care: Hand wash /Gentle machine wash`,
    cloth_type: 'A line 2 piece sets',
    basePrice: 499,
    baseOriginalPrice: 999,
    rating: 4.7,
    reviews: 1567,
    discount: 50,
    images: ['img16.jpg', 'img16.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL']
      }
    ],
    variations: [
      { id: 'var_16_1', sku: 'PRD016-S', attributes: { Size: 'S' }, price: 499, originalPrice: 999, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_16_2', sku: 'PRD016-M', attributes: { Size: 'M' }, price: 499, originalPrice: 999, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_16_3', sku: 'PRD016-L', attributes: { Size: 'L' }, price: 499, originalPrice: 999, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_16_4', sku: 'PRD016-XL', attributes: { Size: 'XL' }, price: 499, originalPrice: 999, stock: 15, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 17,
    name: '3 piece cotton suit with shades of royal blue, white and lime',

    brand: 'Zidansh Collection',

    description: `This is a beautiful 3-piece cotton suit featuring an all-over intricate print in shades of royal blue, white, and lime green.Specifications:
- Sleeve Length: Full Sleeves
- Top Shape: Straight
- Top Type: Long Kurti
- Bottom Type: Trousers (Printed, matching colors)
- Dupatta: Included (Matching Printed Cotton)`,
    cloth_type: '3 piece cotton sets',
    basePrice: 1049,
    baseOriginalPrice: 1599,
    rating: 4.6,
    reviews: 945,
    discount: 34,
    images: ['img17.jpg', 'img17.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
      }
    ],
    variations: [
      { id: 'var_17_1', sku: 'PRD017-S', attributes: { Size: 'S' }, price: 1049, originalPrice: 1599, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_17_2', sku: 'PRD017-M', attributes: { Size: 'M' }, price: 1049, originalPrice: 1599, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_17_3', sku: 'PRD017-L', attributes: { Size: 'L' }, price: 1049, originalPrice: 1599, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_17_4', sku: 'PRD017-XL', attributes: { Size: 'XL' }, price: 1049, originalPrice: 1599, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_17_5', sku: 'PRD017-2XL', attributes: { Size: '2XL' }, price: 1049, originalPrice: 1599, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_17_6', sku: 'PRD017-3XL', attributes: { Size: '3XL' }, price: 1049, originalPrice: 1599, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_17_7', sku: 'PRD017-4XL', attributes: { Size: '4XL' }, price: 1049, originalPrice: 1599, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_17_8', sku: 'PRD017-5XL', attributes: { Size: '5XL' }, price: 1049, originalPrice: 1599, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 18,
    name: '3 piece grey cotton suit set',

    brand: 'Zidansh Collection',

    description: `Embrace comfortable elegance with this stunning Grey Cotton Suit Set, featuring intricate block prints and a sophisticated color palette. This three-piece ensemble is perfect for daily wear, office settings, and smart casual events.
Feature Detail:
* Color: Grey (Multi-toned block print)
* Fabric: Cotton
* Top Shape: Straight, Long Kurti
* Sleeve Length: Three-Quarter Sleeves
* Bottom Type: Trousers/Pants (Straight Cut)
* Dupatta: Matching Printed Cotton Dupatta
* Set Contents: Kurta, Bottom, and Dupatta (3-Piece Set)`,
    cloth_type: '3 piece cotton sets',
    basePrice: 679,
    baseOriginalPrice: 1099,
    rating: 4.5,
    reviews: 678,
    discount: 38,
    images: ['img18.jpg', 'img18.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      { id: 'var_18_1', sku: 'PRD018-S', attributes: { Size: 'S' }, price: 679, originalPrice: 1099, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_18_2', sku: 'PRD018-M', attributes: { Size: 'M' }, price: 679, originalPrice: 1099, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_18_3', sku: 'PRD018-L', attributes: { Size: 'L' }, price: 679, originalPrice: 1099, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_18_4', sku: 'PRD018-XL', attributes: { Size: 'XL' }, price: 679, originalPrice: 1099, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_18_5', sku: 'PRD018-2XL', attributes: { Size: '2XL' }, price: 679, originalPrice: 1099, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_18_6', sku: 'PRD018-3XL', attributes: { Size: '3XL' }, price: 679, originalPrice: 1099, stock: 4, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 19,
    name: 'Cotton long kurti 3 piece suit set (pink and white)',

    brand: 'Zidansh Collection',

    description: `🌸 Plus-Size Elegance: Cotton Long Kurti 3-Piece Suit Set 🌸
Step into effortless style and comfort with our gorgeous Plus-Size Cotton Long Kurti 3-Piece Suit Set.
The breathable cotton fabric ensures all-day ease, making it perfect for both casual outings and ethnic occasions.
Key Features:
* Fabric: Soft, breathable cotton
* Design: Intricate floral pattern 
* Style: Long kurti with matching pants and dupatta
* Fit: Designed to offer a comfortable and flattering look for plus-size figures.`,
    cloth_type: 'Plus size 3 piece cotton sets',
    basePrice: 749,
    baseOriginalPrice: 1299,
    rating: 4.7,
    reviews: 1123,
    discount: 42,
    images: ['img19.jpg', 'img19.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
      }
    ],
    variations: [
      { id: 'var_19_1', sku: 'PRD019-S', attributes: { Size: 'S' }, price: 749, originalPrice: 1299, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_19_2', sku: 'PRD019-M', attributes: { Size: 'M' }, price: 749, originalPrice: 1299, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_19_3', sku: 'PRD019-L', attributes: { Size: 'L' }, price: 749, originalPrice: 1299, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_19_4', sku: 'PRD019-XL', attributes: { Size: 'XL' }, price: 749, originalPrice: 1299, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_19_5', sku: 'PRD019-2XL', attributes: { Size: '2XL' }, price: 749, originalPrice: 1299, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_19_6', sku: 'PRD019-3XL', attributes: { Size: '3XL' }, price: 749, originalPrice: 1299, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_19_7', sku: 'PRD019-4XL', attributes: { Size: '4XL' }, price: 749, originalPrice: 1299, stock: 2, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 20,
    name: 'Cotton 3 piece suit set (green and white)',

    brand: 'Zidansh Collection',

    description: `💚 Flattering Comfort: Plus-Size Cotton 3-Piece Suit Set 💚
Experience the perfect blend of tradition and comfort with our elegant Plus-Size Cotton Long Kurti 3-Piece Suit Set.
Designed with a focus on a comfortable and flattering fit, this set features the beautiful, eye-catching floral print. The breathable, high-quality cotton fabric ensures you stay cool and stylish all day, making it an ideal choice for both work and festive occasions.
Product Details:
* Fabric: Premium breathable cotton
* Style: Long Kurti, straight-fit pants, and coordinating dupatta
* Print: Detailed, intricate floral pattern 
* Fit: Tailored specifically for the plus-size silhouette, offering maximum comfort and elegance.
Look stunning and feel confident!`,
    cloth_type: '3 piece cotton sets',
    basePrice: 749,
    baseOriginalPrice: 1299,
    rating: 4.4,
    reviews: 789,
    discount: 42,
    images: ['img20.jpg', 'img20.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL']
      }
    ],
    variations: [
      { id: 'var_20_1', sku: 'PRD020-S', attributes: { Size: 'S' }, price: 749, originalPrice: 1299, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_20_2', sku: 'PRD020-M', attributes: { Size: 'M' }, price: 749, originalPrice: 1299, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_20_3', sku: 'PRD020-L', attributes: { Size: 'L' }, price: 749, originalPrice: 1299, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_20_4', sku: 'PRD020-XL', attributes: { Size: 'XL' }, price: 749, originalPrice: 1299, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_20_5', sku: 'PRD020-2XL', attributes: { Size: '2XL' }, price: 749, originalPrice: 1299, stock: 8, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 21,
    name: 'Yellow floral co-ord set',

    brand: 'Zidansh Collection',

    description: 'Yellow floral co-ord set. Bright and cheerful, perfect for sunny days and happy vibes.',
    cloth_type: 'Co-ord Sets',
    basePrice: 699,
    baseOriginalPrice: 1199,
    rating: 4.4,
    reviews: 987,
    discount: 42,
    images: ['img21.jpg', 'img21.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      { id: 'var_21_1', sku: 'PRD021-S', attributes: { Size: 'S' }, price: 699, originalPrice: 1199, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_21_2', sku: 'PRD021-M', attributes: { Size: 'M' }, price: 699, originalPrice: 1199, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_21_3', sku: 'PRD021-L', attributes: { Size: 'L' }, price: 699, originalPrice: 1199, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_21_4', sku: 'PRD021-XL', attributes: { Size: 'XL' }, price: 699, originalPrice: 1199, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_21_5', sku: 'PRD021-2XL', attributes: { Size: '2XL' }, price: 699, originalPrice: 1199, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_21_6', sku: 'PRD021-3XL', attributes: { Size: '3XL' }, price: 699, originalPrice: 1199, stock: 4, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 22,
    name: 'Green floral co-ord set',

    brand: 'Zidansh Collection',

    description: 'Experience comfort and style with this premium quality piece from Zidansh.',
    cloth_type: 'Co-ord Sets',
    basePrice: 699,
    baseOriginalPrice: 1199,
    rating: 4.6,
    reviews: 1456,
    discount: 42,
    images: ['img22.jpg', 'img22.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
      }
    ],
    variations: [
      { id: 'var_22_1', sku: 'PRD022-S', attributes: { Size: 'S' }, price: 699, originalPrice: 1199, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_22_2', sku: 'PRD022-M', attributes: { Size: 'M' }, price: 699, originalPrice: 1199, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_22_3', sku: 'PRD022-L', attributes: { Size: 'L' }, price: 699, originalPrice: 1199, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_22_4', sku: 'PRD022-XL', attributes: { Size: 'XL' }, price: 699, originalPrice: 1199, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_22_5', sku: 'PRD022-2XL', attributes: { Size: '2XL' }, price: 699, originalPrice: 1199, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_22_6', sku: 'PRD022-3XL', attributes: { Size: '3XL' }, price: 699, originalPrice: 1199, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_22_7', sku: 'PRD022-4XL', attributes: { Size: '4XL' }, price: 699, originalPrice: 1199, stock: 2, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 23,
    name: 'Purple floral co-ord set',

    brand: 'Zidansh Premium',

    description: 'Purple floral co-ord set from our Premium collection. Radiant and stylish for the modern look.',
    cloth_type: 'Co-ord Sets',
    basePrice: 699,
    baseOriginalPrice: 1199,
    rating: 4.8,
    reviews: 2345,
    discount: 42,
    images: ['img23.jpg', 'img23.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']
      }
    ],
    variations: [
      { id: 'var_23_1', sku: 'PRD023-S', attributes: { Size: 'S' }, price: 699, originalPrice: 1199, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_23_2', sku: 'PRD023-M', attributes: { Size: 'M' }, price: 699, originalPrice: 1199, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_23_3', sku: 'PRD023-L', attributes: { Size: 'L' }, price: 699, originalPrice: 1199, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_23_4', sku: 'PRD023-XL', attributes: { Size: 'XL' }, price: 699, originalPrice: 1199, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_23_5', sku: 'PRD023-2XL', attributes: { Size: '2XL' }, price: 699, originalPrice: 1199, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_23_6', sku: 'PRD023-3XL', attributes: { Size: '3XL' }, price: 699, originalPrice: 1199, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_23_7', sku: 'PRD023-4XL', attributes: { Size: '4XL' }, price: 699, originalPrice: 1199, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_23_8', sku: 'PRD023-5XL', attributes: { Size: '5XL' }, price: 699, originalPrice: 1199, stock: 1, lowStockThreshold: 5, isActive: true },
      { id: 'var_23_9', sku: 'PRD023-6XL', attributes: { Size: '6XL' }, price: 699, originalPrice: 1199, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 24,
    name: 'White lucknowi long kurti (rayon-plain)',

    brand: 'Zidansh Premium',

    description: `✨ White Lucknowi Long Kurti (Rayon – Plain)
Elegant, soft & breathable rayon fabric with subtle Lucknowi charm. Perfect for everyday comfort or festive grace 🤍✨
Pair it with leggings or palazzos for a classy ethnic look!`,
    cloth_type: 'Kurtis',
    basePrice: 349,
    baseOriginalPrice: 699,
    rating: 4.9,
    reviews: 2890,
    discount: 50,
    images: ['img24.jpg', 'img24.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
      }
    ],
    variations: [
      { id: 'var_24_1', sku: 'PRD024-S', attributes: { Size: 'S' }, price: 349, originalPrice: 699, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_24_2', sku: 'PRD024-M', attributes: { Size: 'M' }, price: 349, originalPrice: 699, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_24_3', sku: 'PRD024-L', attributes: { Size: 'L' }, price: 349, originalPrice: 699, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_24_4', sku: 'PRD024-XL', attributes: { Size: 'XL' }, price: 349, originalPrice: 699, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_24_5', sku: 'PRD024-2XL', attributes: { Size: '2XL' }, price: 349, originalPrice: 699, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_24_6', sku: 'PRD024-3XL', attributes: { Size: '3XL' }, price: 349, originalPrice: 699, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_24_7', sku: 'PRD024-4XL', attributes: { Size: '4XL' }, price: 349, originalPrice: 699, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_24_8', sku: 'PRD024-5XL', attributes: { Size: '5XL' }, price: 349, originalPrice: 699, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 25,
    name: 'The heritage print cotton co-ord set (Green)',

    brand: 'Zidansh Premium',

    description: `🌴 The Heritage Print Cotton Co-Ord Set 🐪

Type: 2-Piece Co-Ord Set (Top & Bottom)
Material: Cotton
Top Style: Short Kurti
Top Neckline: Mandarin/Band Collar
Bottom Style: Palazzo Pants (Wide-Legged)
Print: Heritage/Kutch-inspired (Camels, Birds, Coconut Trees)
Base Color: Green/Purple/Indigo Blue/Yellow Ochre
Sleeve Length: 3/4th (or elbow length)
Occasion: Casual, Ethnic, Festive Wear`,
    cloth_type: 'Co-ord Sets',
    basePrice: 1199,
    baseOriginalPrice: 1999,
    rating: 4.9,
    reviews: 2890,
    discount: 40,
    images: ['img25.jpg', 'img25.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
      }
    ],
    variations: [
      { id: 'var_25_1', sku: 'PRD025-S', attributes: { Size: 'S' }, price: 1199, originalPrice: 1999, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_25_2', sku: 'PRD025-M', attributes: { Size: 'M' }, price: 1199, originalPrice: 1999, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_25_3', sku: 'PRD025-L', attributes: { Size: 'L' }, price: 1199, originalPrice: 1999, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_25_4', sku: 'PRD025-XL', attributes: { Size: 'XL' }, price: 1199, originalPrice: 1999, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_25_5', sku: 'PRD025-2XL', attributes: { Size: '2XL' }, price: 1199, originalPrice: 1999, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_25_6', sku: 'PRD025-3XL', attributes: { Size: '3XL' }, price: 1199, originalPrice: 1999, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_25_7', sku: 'PRD025-4XL', attributes: { Size: '4XL' }, price: 1199, originalPrice: 1999, stock: 2, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 26,
    name: 'The heritage print cotton co-ord set (Blue)',

    brand: 'Zidansh Premium',

    description: `🌴 The Heritage Print Cotton Co-Ord Set 🐪

Type: 2-Piece Co-Ord Set (Top & Bottom)
Material: Cotton
Top Style: Short Kurti
Top Neckline: Mandarin/Band Collar
Bottom Style: Palazzo Pants (Wide-Legged)
Print: Heritage/Kutch-inspired (Camels, Birds, Coconut Trees)
Base Color: Green/Purple/Indigo Blue/Yellow Ochre
Sleeve Length: 3/4th (or elbow length)
Occasion: Casual, Ethnic, Festive Wear`,
    cloth_type: 'Co-ord Sets',
    basePrice: 1199,
    baseOriginalPrice: 1999,
    rating: 4.9,
    reviews: 2890,
    discount: 40,
    images: ['img26.jpg', 'img26.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
      }
    ],
    variations: [
      { id: 'var_26_1', sku: 'PRD026-S', attributes: { Size: 'S' }, price: 1199, originalPrice: 1999, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_26_2', sku: 'PRD026-M', attributes: { Size: 'M' }, price: 1199, originalPrice: 1999, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_26_3', sku: 'PRD026-L', attributes: { Size: 'L' }, price: 1199, originalPrice: 1999, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_26_4', sku: 'PRD026-XL', attributes: { Size: 'XL' }, price: 1199, originalPrice: 1999, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_26_5', sku: 'PRD026-2XL', attributes: { Size: '2XL' }, price: 1199, originalPrice: 1999, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_26_6', sku: 'PRD026-3XL', attributes: { Size: '3XL' }, price: 1199, originalPrice: 1999, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_26_7', sku: 'PRD026-4XL', attributes: { Size: '4XL' }, price: 1199, originalPrice: 1999, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_26_8', sku: 'PRD026-5XL', attributes: { Size: '5XL' }, price: 1199, originalPrice: 1999, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 27,
    name: 'The heritage print cotton co-ord set (Maroon)',

    brand: 'Zidansh Premium',

    description: `🌴 The Heritage Print Cotton Co-Ord Set 🐪

Type: 2-Piece Co-Ord Set (Top & Bottom)
Material: Cotton
Top Style: Short Kurti
Top Neckline: Mandarin/Band Collar
Bottom Style: Palazzo Pants (Wide-Legged)
Print: Heritage/Kutch-inspired (Camels, Birds, Coconut Trees)
Base Color: Green/Purple/Indigo Blue/Yellow Ochre
Sleeve Length: 3/4th (or elbow length)
Occasion: Casual, Ethnic, Festive Wear`,
    cloth_type: 'Co-ord Sets',
    basePrice: 1199,
    baseOriginalPrice: 1999,
    rating: 4.9,
    reviews: 2890,
    discount: 40,
    images: ['img27.jpg', 'img27.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL']
      }
    ],
    variations: [
      { id: 'var_27_1', sku: 'PRD027-S', attributes: { Size: 'S' }, price: 1199, originalPrice: 1999, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_27_2', sku: 'PRD027-M', attributes: { Size: 'M' }, price: 1199, originalPrice: 1999, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_27_3', sku: 'PRD027-L', attributes: { Size: 'L' }, price: 1199, originalPrice: 1999, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_27_4', sku: 'PRD027-XL', attributes: { Size: 'XL' }, price: 1199, originalPrice: 1999, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_27_5', sku: 'PRD027-2XL', attributes: { Size: '2XL' }, price: 1199, originalPrice: 1999, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_27_6', sku: 'PRD027-3XL', attributes: { Size: '3XL' }, price: 1199, originalPrice: 1999, stock: 4, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 28,
    name: 'The heritage print cotton co-ord set (Yellow)',

    brand: 'Zidansh Premium',

    description: `🌴 The Heritage Print Cotton Co-Ord Set 🐪

Type: 2-Piece Co-Ord Set (Top & Bottom)
Material: Cotton
Top Style: Short Kurti
Top Neckline: Mandarin/Band Collar
Bottom Style: Palazzo Pants (Wide-Legged)
Print: Heritage/Kutch-inspired (Camels, Birds, Coconut Trees)
Base Color: Green/Purple/Indigo Blue/Yellow Ochre
Sleeve Length: 3/4th (or elbow length)
Occasion: Casual, Ethnic, Festive Wear`,
    cloth_type: 'Co-ord Sets',
    basePrice: 1199,
    baseOriginalPrice: 1999,
    rating: 4.9,
    reviews: 2890,
    discount: 40,
    images: ['img28.jpg', 'img28.1.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
      }
    ],
    variations: [
      { id: 'var_28_1', sku: 'PRD028-S', attributes: { Size: 'S' }, price: 1199, originalPrice: 1999, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_28_2', sku: 'PRD028-M', attributes: { Size: 'M' }, price: 1199, originalPrice: 1999, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_28_3', sku: 'PRD028-L', attributes: { Size: 'L' }, price: 1199, originalPrice: 1999, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_28_4', sku: 'PRD028-XL', attributes: { Size: 'XL' }, price: 1199, originalPrice: 1999, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_28_5', sku: 'PRD028-2XL', attributes: { Size: '2XL' }, price: 1199, originalPrice: 1999, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_28_6', sku: 'PRD028-3XL', attributes: { Size: '3XL' }, price: 1199, originalPrice: 1999, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_28_7', sku: 'PRD028-4XL', attributes: { Size: '4XL' }, price: 1199, originalPrice: 1999, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_28_8', sku: 'PRD028-5XL', attributes: { Size: '5XL' }, price: 1199, originalPrice: 1999, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 29,
    name: 'The heritage print cotton co-ord set (Purple)',

    brand: 'Zidansh Premium',

    description: `🌴 The Heritage Print Cotton Co-Ord Set 🐪

Type: 2-Piece Co-Ord Set (Top & Bottom)
Material: Cotton
Top Style: Short Kurti
Top Neckline: Mandarin/Band Collar
Bottom Style: Palazzo Pants (Wide-Legged)
Print: Heritage/Kutch-inspired (Camels, Birds, Coconut Trees)
Base Color: Green/Purple/Indigo Blue/Yellow Ochre
Sleeve Length: 3/4th (or elbow length)
Occasion: Casual, Ethnic, Festive Wear`,
    cloth_type: 'Co-ord Sets',
    basePrice: 1199,
    baseOriginalPrice: 1999,
    rating: 4.9,
    reviews: 2890,
    discount: 40,
    images: ['img29.jpg', 'img29.1.jpg', 'img29.2.jpg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']
      }
    ],
    variations: [
      { id: 'var_29_1', sku: 'PRD029-S', attributes: { Size: 'S' }, price: 1199, originalPrice: 1999, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_29_2', sku: 'PRD029-M', attributes: { Size: 'M' }, price: 1199, originalPrice: 1999, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_29_3', sku: 'PRD029-L', attributes: { Size: 'L' }, price: 1199, originalPrice: 1999, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_29_4', sku: 'PRD029-XL', attributes: { Size: 'XL' }, price: 1199, originalPrice: 1999, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_29_5', sku: 'PRD029-2XL', attributes: { Size: '2XL' }, price: 1199, originalPrice: 1999, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_29_6', sku: 'PRD029-3XL', attributes: { Size: '3XL' }, price: 1199, originalPrice: 1999, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_29_7', sku: 'PRD029-4XL', attributes: { Size: '4XL' }, price: 1199, originalPrice: 1999, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_29_8', sku: 'PRD029-5XL', attributes: { Size: '5XL' }, price: 1199, originalPrice: 1999, stock: 1, lowStockThreshold: 5, isActive: true },
      { id: 'var_29_9', sku: 'PRD029-6XL', attributes: { Size: '6XL' }, price: 1199, originalPrice: 1999, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 30,
    name: 'Deep purple A-line kurta set',

    brand: 'Zidansh Premium',

    description: `Deep Purple A-Line Kurta Set for Women | Cotton Blend | V-Neck with Embroidered Mirror Work | Three-Quarter Sleeves | Palazzo Trousers | Festive & Casual Wear

Design: Solid deep purple kurta with vertical A-line flare (Ghera) and intricate silver embroidery with mirror/sequin work on the yoke

Neckline: V-neck with detailed embroidery for a festive touch

Fit: Flared A-line silhouette with three-quarter sleeves and optional side pockets adorned with mirror/sequin detailing

Trousers: Matching wide-leg palazzo
trousers in deep purple for a coordinated set

Fabric: Soft, breathable cotton blend suitable for casual and festive wear

Style: Elegant fusion look; perfect for daily wear, casual outings, or festive occasions

Care: Gentle hand wash or machine wash recommended`,
    cloth_type: 'A line 2 piece sets',
    basePrice: 999,
    baseOriginalPrice: 1665,
    rating: 4.9,
    reviews: 2890,
    discount: 40,
    images: ['img30.jpeg', 'img30.1.jpeg', 'img30.2.jpeg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
      }
    ],
    variations: [
      { id: 'var_30_1', sku: 'PRD030-S', attributes: { Size: 'S' }, price: 999, originalPrice: 1665, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_30_2', sku: 'PRD030-M', attributes: { Size: 'M' }, price: 999, originalPrice: 1665, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_30_3', sku: 'PRD030-L', attributes: { Size: 'L' }, price: 999, originalPrice: 1665, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_30_4', sku: 'PRD030-XL', attributes: { Size: 'XL' }, price: 999, originalPrice: 1665, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_30_5', sku: 'PRD030-2XL', attributes: { Size: '2XL' }, price: 999, originalPrice: 1665, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_30_6', sku: 'PRD030-3XL', attributes: { Size: '3XL' }, price: 999, originalPrice: 1665, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_30_7', sku: 'PRD030-4XL', attributes: { Size: '4XL' }, price: 999, originalPrice: 1665, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_30_8', sku: 'PRD030-5XL', attributes: { Size: '5XL' }, price: 999, originalPrice: 1665, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 31,
    name: 'Dusty Rose A-Line Kurta Set',

    brand: 'Zidansh Premium',

    description: `Women’s Dusty Rose A-Line Kurta Set with Palazzo Trousers – Embroidered V-Neck, Three-Quarter Sleeves, Cotton Blend

Elegant dusty rose/onion pink A-line kurta with flare

V-neck with intricate embroidery and mirror/sequin detailing

Three-quarter sleeves for a versatile, chic look

Functional or decorative curved side pockets with mirror accents

Matching wide-leg palazzo trousers included

Comfortable cotton blend fabric, perfect for casual and festive wear

Dupatta not included; styled with black flats`,
    cloth_type: 'A line 2 piece sets',
    basePrice: 999,
    baseOriginalPrice: 1665,
    rating: 4.9,
    reviews: 2890,
    discount: 40,
    images: ['img31.jpeg', 'img31.1.jpeg', 'img31.4.jpeg'],
    attributes: [
      {
        id: 'attr_size',
        name: 'Size', values: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
      }
    ],
    variations: [
      { id: 'var_31_1', sku: 'PRD031-S', attributes: { Size: 'S' }, price: 999, originalPrice: 1665, stock: 22, lowStockThreshold: 5, isActive: true },
      { id: 'var_31_2', sku: 'PRD031-M', attributes: { Size: 'M' }, price: 999, originalPrice: 1665, stock: 28, lowStockThreshold: 5, isActive: true },
      { id: 'var_31_3', sku: 'PRD031-L', attributes: { Size: 'L' }, price: 999, originalPrice: 1665, stock: 20, lowStockThreshold: 5, isActive: true },
      { id: 'var_31_4', sku: 'PRD031-XL', attributes: { Size: 'XL' }, price: 999, originalPrice: 1665, stock: 15, lowStockThreshold: 5, isActive: true },
      { id: 'var_31_5', sku: 'PRD031-2XL', attributes: { Size: '2XL' }, price: 999, originalPrice: 1665, stock: 8, lowStockThreshold: 5, isActive: true },
      { id: 'var_31_6', sku: 'PRD031-3XL', attributes: { Size: '3XL' }, price: 999, originalPrice: 1665, stock: 4, lowStockThreshold: 5, isActive: true },
      { id: 'var_31_7', sku: 'PRD031-4XL', attributes: { Size: '4XL' }, price: 999, originalPrice: 1665, stock: 2, lowStockThreshold: 5, isActive: true },
      { id: 'var_31_8', sku: 'PRD031-5XL', attributes: { Size: '5XL' }, price: 999, originalPrice: 1665, stock: 1, lowStockThreshold: 5, isActive: true }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
];

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  addToFavorites,
  isFavorite,
  highlightedProduct,
  showAll,
  setShowAll,
  navigateToProduct,
  selectedCategory,
  setSelectedCategory
}) => {
  // Helper function to check if all product variations are out of stock
  const isAllOutOfStock = (product: ProductType) => {
    return product.variations.every((variation: any) => variation.stock === 0 || !variation.isActive);
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});
  const [animatingFavorite, setAnimatingFavorite] = useState<Record<number, boolean>>({});
  const [inventory, setInventory] = useState<Record<string, { stock: number; isActive: boolean }>>({}); // Store live stock & status

  // Fetch live inventory from Supabase
  useEffect(() => {
    const fetchInventory = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) return;

      const url = `${supabaseUrl}/rest/v1/product_variations?select=variation_id,stock,is_active`;

      try {
        const response = await fetch(url, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });

        if (!response.ok) return;

        const data = await response.json();
        const inventoryMap: Record<string, { stock: number; isActive: boolean }> = {};

        data.forEach((item: any) => {
          inventoryMap[item.variation_id] = {
            stock: item.stock,
            isActive: item.is_active
          };
        });
        setInventory(inventoryMap);

      } catch (err) {
        console.error('Inventory sync failed', err);
      }
    };

    fetchInventory();
  }, []);

  // Fetch real-time review stats
  const [reviewStats, setReviewStats] = useState<Record<number, { averageRating: number; totalReviews: number }>>({});

  useEffect(() => {
    const fetchReviewStats = async () => {
      const stats = await reviewsService.getAllReviewsStats();
      setReviewStats(stats);
    };
    fetchReviewStats();
  }, []);

  const baseUrl = import.meta.env.BASE_URL || '/';
  const getSessionId = () => {
    let sessionId = localStorage.getItem('userSession');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('userSession', sessionId);
    }
    return sessionId;
  };

  const trackProductView = (product: any) => {
    const sessionId = getSessionId();
    analyticsService.trackInteraction({
      product_name: product.name,
      product_brand: product.brand,
      product_price: product.basePrice,
      interaction_type: 'view',
      user_session: sessionId
    });
  };


  // Base products list (first 6 featured products)
  const featuredProducts = products.slice(0, 6);

  // Compute derived lists with useMemo for stability and to help debugging.
  // Merge live inventory data into the products
  const displayProducts = useMemo(() => {
    let filteredProducts = showAll ? products : featuredProducts;

    if (selectedCategory) {
      filteredProducts = products.filter(product => product.cloth_type === selectedCategory);
    }

    // Merge live stock levels into variations
    return filteredProducts.map(product => ({
      ...product,
      variations: product.variations.map(variation => {
        const liveData = inventory[variation.id];
        return {
          ...variation,
          // Use live data if available, otherwise fall back to static data
          stock: liveData ? liveData.stock : variation.stock,
          isActive: liveData ? liveData.isActive : variation.isActive
        };
      })
    }));
  }, [showAll, selectedCategory, inventory]);

  // Debugging aid: log when the filter or display list changes
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[FeaturedProducts] showAll=', showAll, 'displayed=', displayProducts.length, 'products=', products.length);
    console.log('[FeaturedProducts] displayProducts:', displayProducts.map(p => ({
      id: p.id,
      name: p.name
    })));
  }, [showAll, displayProducts.length, displayProducts]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04, ease: 'easeOut', duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  return (
    <motion.section id="featured-products" className="py-12 px-4 bg-primary-100" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0 }} variants={sectionVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {selectedCategory || (showAll ? 'All Products' : 'Featured Products')}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm font-medium bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-colors flex items-center gap-1"
                title="Clear category filter"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </h2>

          {!selectedCategory && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-primary-600 font-semibold hover:underline"
              >
                {showAll ? 'Show Less' : 'View All'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-6">
          {displayProducts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No products found</p>
            </div>
          ) : (
            displayProducts.map((product) => (
              <motion.div
                key={product.id}
                id={`product-${product.id}`}
                layout
                initial="hidden"
                animate="show"
                variants={cardVariants}
                className={`bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl overflow-hidden shadow-md card-interactive group ${highlightedProduct === product.id ? 'ring-4 ring-blue-500 ring-opacity-75 scale-105' : ''
                  }`}
                onMouseEnter={() => trackProductView(product)}
              >
                <div className="relative h-44 sm:h-56 md:h-72 overflow-hidden bg-gray-100">
                  {/* skeleton placeholder until image loads */}
                  {!imgLoaded[product.id] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full skeleton" />
                    </div>
                  )}

                  <img
                    src={`${baseUrl}zidansh img/realimg/${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer image-zoom"
                    onClick={() => navigateToProduct(product.id)}
                    onLoad={() => setImgLoaded(prev => ({ ...prev, [product.id]: true }))}
                    onError={(e) => { e.currentTarget.src = fallbackImg; }}
                  />

                  {/* Out of Stock Overlay */}
                  {isAllOutOfStock(product) && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer"
                      onClick={() => navigateToProduct(product.id)}
                    >
                      <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                        <span className="text-red-600 font-bold text-sm md:text-base">Out of Stock</span>
                      </div>
                    </div>
                  )}

                  {/* placeholder shown when image fails to load */}
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary-600 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold">
                    {product.discount}% OFF
                  </div>
                  <button
                    onClick={() => {
                      // trigger local pop animation
                      setAnimatingFavorite(prev => ({ ...prev, [product.id]: true }));
                      setTimeout(() => setAnimatingFavorite(prev => ({ ...prev, [product.id]: false })), 420);
                      addToFavorites(product);
                    }}
                    className={`absolute top-2 right-2 md:top-4 md:right-4 bg-white p-1.5 md:p-2 rounded-full shadow-lg btn-interactive ${animatingFavorite[product.id] ? 'heart-pop' : ''}`}
                  >
                    <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isFavorite(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="p-1.5 sm:p-4 space-y-1 sm:space-y-3">
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium line-clamp-1">{product.brand}</p>
                    <h3 className="text-[11px] sm:text-lg font-semibold text-gray-900 mt-0.5 sm:mt-1 line-clamp-1">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    <div className="flex items-center">
                      <Star className={`h-3 w-3 sm:h-4 sm:w-4 ${reviewStats[product.id]?.totalReviews ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                      <span className="ml-0.5 text-[10px] sm:text-sm font-semibold text-gray-700">
                        {reviewStats[product.id]?.averageRating || 0}
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-xs text-gray-500">({reviewStats[product.id]?.totalReviews || 0})</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-0.5 sm:space-y-0 sm:space-x-2">
                    <span className="text-xs sm:text-2xl font-bold text-gray-900">
                      ₹{product.basePrice}
                    </span>
                    <span className="text-[9px] sm:text-sm text-gray-400 line-through font-light">
                      ₹{product.baseOriginalPrice}
                    </span>
                  </div>

                  {/* <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 btn-interactive"
                >
                  Add to Cart
                </button> */}


                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl max-h-[75vh]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage}
              alt="Product Image"
              className="w-[75%] h-[75%] object-contain rounded-lg mx-auto"
            />
          </div>
        </div>
      )}
    </motion.section>
  );
}

export default FeaturedProducts;
