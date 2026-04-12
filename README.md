# Just Artist Things - Art Brochure Website

A modern, responsive Next.js website showcasing handcrafted art products including custom frames, resin art, personalized keychains, and decorative items.

## Features

- 🎨 Beautiful product showcase with carousel and grid layouts
- 🌓 Dark/Light theme support
- 📱 Fully responsive design
- 🔍 Product search and category filtering
- 💬 WhatsApp and Instagram inquiry integration
- ⚡ Fast performance with Next.js 16
- 🎭 Smooth animations with Framer Motion

## Tech Stack

- **Framework:** Next.js 16.0.10
- **UI Library:** React 19.2.0
- **Styling:** Tailwind CSS 4.1.9
- **Components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion 12.26.2
- **Icons:** Lucide React
- **Language:** TypeScript 5

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Navigate to the project directory:
```bash
cd art-things-brochure
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
art-things-brochure/
├── app/
│   ├── home/           # Main product showcase page
│   ├── landing/        # Landing page with about & testimonials
│   ├── layout.tsx      # Root layout with theme provider
│   ├── page.tsx        # Root page (redirects to landing)
│   └── globals.css     # Global styles
├── components/
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── header.tsx      # Navigation header
│   ├── hero.tsx        # Hero section
│   ├── footer.tsx      # Footer with contact info
│   ├── product-carousel.tsx
│   ├── product-grid.tsx
│   ├── product-detail.tsx
│   └── theme-provider.tsx
├── lib/
│   └── utils.ts        # Utility functions
├── public/             # Static assets (images)
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Routes

- `/` - Redirects to landing page
- `/landing` - Landing page with about, testimonials, and features
- `/home` - Main product catalog page

## Customization

### Adding Products

Edit the `PRODUCTS` array in `app/home/page.tsx`:

```typescript
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Product Name",
    category: "Category",
    image: "/image-path.jpg",
    description: "Product description",
  },
  // Add more products...
]
```

### Contact Information

Update contact details in `components/footer.tsx`:
- Email: diyak7153@gmail.com
- Phone: +91 9370015472
- Location: Boisar, Palghar, Maharashtra

### WhatsApp & Instagram

Update links in `components/product-detail.tsx`:
- `WHATSAPP_NUMBER`: Your WhatsApp number
- `INSTAGRAM_URL`: Your Instagram profile URL

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Other Platforms

Build the project:
```bash
npm run build
```

The output will be in the `.next` folder. Follow your hosting provider's Next.js deployment guide.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved

## Contact

For inquiries, reach out via:
- Email: diyak7153@gmail.com
- Phone: +91 9370015472
- Instagram: [@just__artist.things](https://www.instagram.com/just__artist.things)
