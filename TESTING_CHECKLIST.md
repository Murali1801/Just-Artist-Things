# Testing Checklist

Use this checklist to verify all features are working correctly.

## Initial Setup
- [ ] Dependencies installed (`npm install` completed successfully)
- [ ] Development server starts without errors (`npm run dev`)
- [ ] No console errors in browser developer tools
- [ ] Website loads at http://localhost:3000

## Navigation & Routing
- [ ] Root URL (/) redirects to /landing
- [ ] /landing page loads correctly
- [ ] /home page loads correctly
- [ ] Header navigation links work (Home, About, Contact)
- [ ] Smooth scrolling works on landing page sections

## Landing Page (/landing)
- [ ] Hero section displays correctly
- [ ] "Explore Collection" button navigates to /home
- [ ] Stats section shows (100+ customers, 30+ products, 4.9 rating)
- [ ] About the Artist section displays
- [ ] Testimonials section shows 3 reviews
- [ ] "Why Handmade Matters" section displays
- [ ] Materials & Care section shows
- [ ] Features section displays
- [ ] Contact/CTA section at bottom
- [ ] Footer displays with all information

## Home Page (/home)
- [ ] Header displays with logo and navigation
- [ ] Hero section shows with product image
- [ ] Product carousel displays featured products
- [ ] Carousel navigation arrows work (prev/next)
- [ ] "Our Collection" section displays
- [ ] Search bar is functional
- [ ] Category filter buttons display
- [ ] All category filters work (All, Frames, Decor, Accessories, Special Occasion)
- [ ] Product grid displays all products
- [ ] Products display correct images, names, descriptions
- [ ] "Enquire" button on each product works

## Product Detail Modal
- [ ] Clicking "Enquire" opens product detail modal
- [ ] Modal displays product image correctly
- [ ] Product name and description show
- [ ] Category badge displays
- [ ] "Inquire on WhatsApp" button works (opens WhatsApp with pre-filled message)
- [ ] "Inquire on Instagram" button works (opens Instagram profile)
- [ ] "You Might Also Like" section shows related products
- [ ] Clicking related product updates the modal
- [ ] Close button (X) closes the modal
- [ ] Clicking outside modal closes it
- [ ] Body scroll is disabled when modal is open

## Search & Filter
- [ ] Search bar filters products by name
- [ ] Search bar filters products by description
- [ ] Search is case-insensitive
- [ ] "No products found" message shows when no results
- [ ] "Clear Filters" button appears when filters are active
- [ ] "Clear Filters" button resets search and category
- [ ] Category filter updates product grid
- [ ] Loading skeleton shows when filters change

## Theme Toggle
- [ ] Theme toggle button in header works
- [ ] Light theme displays correctly
- [ ] Dark theme displays correctly
- [ ] Theme persists on page refresh
- [ ] All components look good in both themes
- [ ] Images are visible in both themes
- [ ] Text is readable in both themes

## Responsive Design
### Desktop (1920x1080)
- [ ] Layout looks good
- [ ] All elements are properly aligned
- [ ] Images are not stretched
- [ ] Text is readable

### Tablet (768x1024)
- [ ] Layout adapts correctly
- [ ] Navigation works
- [ ] Product grid shows 2 columns
- [ ] Modal is responsive

### Mobile (375x667)
- [ ] Layout is mobile-friendly
- [ ] Mobile menu works
- [ ] Product grid shows 1 column
- [ ] Modal fits screen
- [ ] Touch interactions work
- [ ] Buttons are easily tappable

## Animations
- [ ] Page transitions are smooth
- [ ] Hover effects work on products
- [ ] Modal open/close animations work
- [ ] Carousel transitions are smooth
- [ ] Hero section floating animation works
- [ ] Scroll animations trigger correctly

## Images
- [ ] All product images load correctly
- [ ] Logo displays in header
- [ ] Hero image displays
- [ ] No broken image icons
- [ ] Images have proper aspect ratios
- [ ] GIF images work (Baby Shower Decor)
- [ ] GIF shows on hover in product grid

## Footer
- [ ] Footer displays on all pages
- [ ] Contact information is correct
  - Email: diyak7153@gmail.com
  - Phone: +91 9370015472
  - Location: Boisar, Palghar, Maharashtra
- [ ] Quick links work
- [ ] Social media icons display
- [ ] Newsletter input field works
- [ ] Subscribe button is clickable

## Performance
- [ ] Pages load quickly (< 3 seconds)
- [ ] No lag when scrolling
- [ ] Smooth animations (60fps)
- [ ] Images load progressively
- [ ] No memory leaks (check browser dev tools)

## Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## Build & Production
- [ ] `npm run build` completes without errors
- [ ] `npm run start` runs production build
- [ ] Production build works correctly
- [ ] No console errors in production

## Accessibility
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Images have alt text
- [ ] Buttons have proper labels
- [ ] Color contrast is sufficient

## Contact Integration
- [ ] WhatsApp link opens with correct number (919370015472)
- [ ] WhatsApp message is pre-filled with product name
- [ ] Instagram link opens correct profile
- [ ] Email link works (diyak7153@gmail.com)

## Edge Cases
- [ ] Empty search results handled gracefully
- [ ] Long product names don't break layout
- [ ] Many products don't break grid
- [ ] Modal works with products without related items
- [ ] Works with JavaScript disabled (graceful degradation)

---

## Issues Found

Document any issues you find during testing:

1. Issue: _______________
   Steps to reproduce: _______________
   Expected: _______________
   Actual: _______________

2. Issue: _______________
   Steps to reproduce: _______________
   Expected: _______________
   Actual: _______________

---

## Sign-off

- [ ] All critical features tested and working
- [ ] All major bugs fixed
- [ ] Ready for deployment

Tested by: _______________
Date: _______________
