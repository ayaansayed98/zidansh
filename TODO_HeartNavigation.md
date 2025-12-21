# TODO: Heart Icon Navigation to All Products

## Tasks
- [ ] Lift `showAll` state from FeaturedProducts to App.tsx
- [ ] Add `navigateToProduct` function in App.tsx that sets showAll=true and highlights the product
- [ ] Update FeaturedProducts props to include showAll and navigateToProduct
- [ ] Change heart icon onClick to call navigateToProduct instead of addToFavorites
- [ ] Update FeaturedProductsProps interface to reflect new props

## Testing
- [ ] Test that clicking heart icon switches to "All Products" view
- [ ] Test that the clicked product is highlighted/navigated to
- [ ] Verify no conflicts with existing functionality
