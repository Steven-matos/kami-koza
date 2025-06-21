# 🎨 PixelSynth - AI Pixel Art Generator

A retro-futuristic AI-powered pixel art generator built with Next.js, featuring an authentic '80s synthwave aesthetic. Transform your imagination into stunning pixel art masterpieces with the power of artificial intelligence.

![PixelSynth Preview](https://via.placeholder.com/800x400/0a0a0f/ff10f0?text=PixelSynth+%E2%9A%A1+AI+Pixel+Art+Generator)

## ✨ Features

- 🤖 **AI-Powered Generation**: Create unique pixel art from text descriptions
- 🌈 **Synthwave Aesthetic**: Authentic '80s neon styling with retro animations
- ⚡ **Lightning Fast**: Generate images in seconds, not hours
- 💰 **Monetization Ready**: Built-in credit system and pricing pages
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎨 **Download Support**: Save your creations in high quality
- 🔧 **TypeScript**: Fully typed for better development experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom '80s theme
- **Fonts**: Press Start 2P (pixel font) & Orbitron (retro sans)
- **API**: Next.js API Routes for backend functionality
- **Deployment**: Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- An AI image generation API key (optional for demo)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pixelsynth.git
   cd pixelsynth
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your AI API key:
   ```env
   AI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Project Structure

```
pixelsynth/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-pixel-art/    # AI generation API route
│   │   ├── generate/                  # Image generation page
│   │   ├── pricing/                   # Pricing and plans page
│   │   ├── globals.css               # Global styles with '80s theme
│   │   ├── layout.tsx                # Root layout with retro styling
│   │   └── page.tsx                  # Homepage with hero section
├── public/                           # Static assets
├── tailwind.config.ts               # Custom '80s Tailwind theme
├── .env.local                       # Environment variables
└── README.md                        # This file
```

## 🎨 Customization

### Colors
The project uses a custom '80s color palette defined in `tailwind.config.ts`:
- `neon-pink`: #ff10f0
- `neon-blue`: #00f0ff  
- `neon-purple`: #bf00ff
- `synth-dark`: #0a0a0f
- `synth-medium`: #1a1a2e

### Fonts
- **Press Start 2P**: Pixel-perfect retro gaming font
- **Orbitron**: Futuristic sans-serif for body text

### Animations
- Neon glow effects on buttons and borders
- Pulsing animations for text elements
- Animated grid backgrounds

## 🔧 API Integration

The project includes a mock AI generation API. To integrate with real AI services:

1. **Choose an AI service**: Replicate, OpenAI DALL-E, Getimg.ai, etc.
2. **Update the API route**: Modify `src/app/api/generate-pixel-art/route.ts`
3. **Add your API key**: Set `AI_API_KEY` in your environment variables

### Example Integration (Replicate)

```typescript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.AI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: "pixel-art-model-id",
    input: {
      prompt: `${prompt}, pixel art style, 8-bit, synthwave colors`,
      width: 512,
      height: 512,
    }
  })
})
```

## 💰 Monetization

The project includes a complete monetization system:

- **Credit System**: Track user generations
- **Pricing Page**: Multiple subscription tiers
- **Payment Integration**: Ready for Stripe/PayPal integration
- **Usage Limits**: Enforce generation limits

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**: Commit your code to a GitHub repository
2. **Connect to Vercel**: Import your repository at [vercel.com](https://vercel.com)
3. **Add Environment Variables**: Set `AI_API_KEY` in Vercel project settings
4. **Deploy**: Automatic deployment on every push

### Other Platforms

- **Netlify**: Add environment variables in site settings
- **Railway**: Configure environment variables in project settings
- **Docker**: Use the included Dockerfile for containerization

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads with '80s styling
- [ ] Navigation between pages works
- [ ] Text input accepts prompts
- [ ] Generate button triggers API call
- [ ] Loading states display correctly
- [ ] Error handling works properly
- [ ] Image download functionality
- [ ] Credit system decrements properly
- [ ] Pricing page displays correctly
- [ ] Responsive design on mobile

### Running Tests

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🎯 Roadmap

- [ ] **Real AI Integration**: Connect to production AI services
- [ ] **User Authentication**: Add login/register functionality
- [ ] **Payment Processing**: Integrate Stripe for payments
- [ ] **Image Gallery**: Save and browse generated images
- [ ] **Social Features**: Share creations with community
- [ ] **Advanced Styles**: More pixel art style options
- [ ] **Batch Generation**: Generate multiple images at once
- [ ] **API Access**: Provide API for developers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- **Inspiration**: '80s synthwave aesthetic and retro computing
- **Fonts**: Google Fonts for Press Start 2P and Orbitron
- **Colors**: Classic neon color palette from the '80s era
- **Community**: Thanks to all contributors and users

---

**Ready to create some pixel magic?** 🎨⚡

[🚀 View Live Demo](https://your-demo-url.vercel.app) | [📖 Documentation](https://your-docs-url.com) | [💬 Discord](https://your-discord-invite)

*Made with ❤️ and lots of neon*
