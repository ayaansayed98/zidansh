# Category Filtering Implementation Plan

## Overview
Link categories with cloth types of featured products so that clicking on a category displays only that category's clothes with a heading, and provide an option to revert the category choice.

## Current State Analysis
- Categories.tsx: Has categories with names like 'Kurtis', 'Co-ord Sets', 'A line 2 piece sets', etc.
- FeaturedProducts.tsx: Products have cloth_type matching category names
- App.tsx: Renders both components but no filtering logic

## Implementation Steps
1. Add selectedCategory state in App.tsx
2. Pass selectedCategory and setSelectedCategory to Categories and FeaturedProducts
3. Make categories clickable in Categories.tsx
4. Filter products in FeaturedProducts.tsx based on selectedCategory
5. Add category heading when filtered
6. Add revert option (clear filter button)

## Cloth Type Mapping
- Kurtis: 'Kurtis'
- Co-ord Sets: 'Co-ord Sets'
- A line 2 piece sets: 'A line 2 piece sets'
- 3 piece cotton sets: '3 piece cotton sets'
- Plus size 3 piece cotton sets: 'Plus size 3 piece cotton sets'

## Files Modified
- ✅ project/src/App.tsx: Added state management and prop passing
- ✅ project/src/components/Categories.tsx: Made clickable, added onClick handlers
- ✅ project/src/components/FeaturedProducts.tsx: Added filtering logic, heading, revert button

## Testing
- Click on categories to filter products
- Verify heading changes to selected category
- Check "Clear Filter" button resets the filter
- Ensure filtering works with both "Featured Products" and "All Products" views
