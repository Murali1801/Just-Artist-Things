# Quick Setup Guide

## First Time Setup

1. **Install Dependencies**
   ```bash
   cd art-things-brochure
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to: http://localhost:3000
   - You should see the landing page

## Common Issues & Solutions

### Issue: Port 3000 already in use
**Solution:** 
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Issue: Module not found errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build errors
**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Project Routes

- **/** → Redirects to /landing
- **/landing** → Landing page with about & features
- **/home** → Product catalog page

## Key Files to Customize

1. **Products:** `app/home/page.tsx` (PRODUCTS array)
2. **Contact Info:** `components/footer.tsx`
3. **WhatsApp/Instagram:** `components/product-detail.tsx`
4. **Theme Colors:** `app/globals.css`

## Development Tips

- Hot reload is enabled - changes appear instantly
- TypeScript errors will show in terminal
- Use dark mode toggle in header to test both themes
- Images should be placed in `/public` folder

## Need Help?

Check the main README.md for detailed documentation.
