# Image Background Remover

AI-powered image background remover using remove.bg API. Built with Next.js + Tailwind CSS.

## Features

- 🖼️ **Drag & Drop** - Simply drag and drop your images
- 🤖 **AI Powered** - Uses remove.bg API for high-quality background removal
- ⚡ **Fast** - Process images in seconds
- 🔒 **Privacy First** - Images are processed in memory, never stored
- 📱 **Responsive** - Works on desktop and mobile

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [remove.bg API](https://www.remove.bg/api) - Background removal

## Getting Started

### Prerequisites

- Node.js 18+
- A remove.bg API key ([Get one here](https://www.remove.bg/api))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ansonpan002/image-background-remover.git
cd image-background-remover
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your remove.bg API key
2. Drag and drop or click to select an image
3. Wait for the AI to process
4. Download your image with transparent background

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ansonpan002/image-background-remover)

### Deploy to Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`

## API Costs

This app uses the remove.bg API. You'll need to provide your own API key:
- Free tier: 50 credits/month
- Paid plans start at $0.09 per image

See [remove.bg pricing](https://www.remove.bg/pricing) for details.

## License

MIT
