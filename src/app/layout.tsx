import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelSynth - AI Pixel Art Generator",
  description: "Generate stunning pixel art with AI in true '80s synthwave style",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-synth-dark text-white font-retro-sans min-h-screen">
        <div className="relative min-h-screen">
          {/* Retro grid background */}
          <div className="fixed inset-0 retro-grid opacity-20 pointer-events-none"></div>
          
          {/* Header */}
          <header className="relative z-10 glass-effect border-b border-neon-blue/30 backdrop-blur-md">
            <div className="container mx-auto px-4 py-6">
              <nav className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl md:text-3xl font-pixel gradient-text">
                    PixelSynth
                  </h1>
                  <div className="hidden md:block w-px h-8 bg-neon-blue opacity-50"></div>
                  <span className="hidden md:block text-sm text-gray-400 font-retro-sans">
                    AI Pixel Art Generator
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  <a 
                    href="/" 
                    className="text-neon-blue hover:text-neon-pink transition-colors duration-300 font-retro-sans font-bold"
                  >
                    Home
                  </a>
                  <a 
                    href="/generate" 
                    className="text-neon-blue hover:text-neon-pink transition-colors duration-300 font-retro-sans font-bold"
                  >
                    Generate
                  </a>
                  <a 
                    href="/pricing" 
                    className="text-neon-blue hover:text-neon-pink transition-colors duration-300 font-retro-sans font-bold"
                  >
                    Pricing
                  </a>
                  <a 
                    href="/admin" 
                    className="text-xs text-gray-500 hover:text-neon-blue transition-colors duration-300 font-retro-sans"
                  >
                    Admin
                  </a>
                </div>
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main className="relative z-10 flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="relative z-10 border-t border-neon-blue mt-auto">
            <div className="container mx-auto px-4 py-6 text-center">
              <p className="text-sm text-gray-400">
                Powered by GetImg.ai • Made with ✨ for creators everywhere
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
