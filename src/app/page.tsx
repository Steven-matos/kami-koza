import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-neon-pink rotate-45 opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-neon-blue rotate-12 opacity-30 animate-pulse"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-neon-purple opacity-20 rotate-45 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 text-center max-w-5xl relative z-10">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-pixel gradient-text mb-6 leading-tight">
              PixelSynth
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-neon-pink to-neon-blue mx-auto mb-8"></div>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-pixel text-neon-blue mb-12 leading-relaxed">
            AI-Powered <span className="text-neon-pink">Pixel Art</span> Generator
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            Create stunning retro-futuristic pixel art with cutting-edge AI technology. 
            Transform your imagination into <span className="text-neon-blue font-bold">vibrant digital masterpieces </span> 
            in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <Link href="/generate" className="retro-button text-xl px-8 py-4">
              ✨ Start Creating
            </Link>
            
            <Link 
              href="/pricing" 
              className="glass-effect px-8 py-4 text-neon-blue hover:text-neon-pink transition-all duration-300 font-bold border-2 border-transparent hover:border-neon-blue"
            >
              View Pricing →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-pixel text-neon-pink mb-2">10K+</div>
              <div className="text-sm text-gray-400">Images Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-pixel text-neon-blue mb-2">1000+</div>
              <div className="text-sm text-gray-400">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-pixel text-neon-purple mb-2">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-pixel text-neon-green mb-2">&lt;3s</div>
              <div className="text-sm text-gray-400">Generation Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-pixel gradient-text mb-4">
              Why Choose PixelSynth?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-neon-pink to-neon-blue mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="feature-card group text-center">
              <div className="text-5xl mb-6 group-hover:animate-bounce">🎨</div>
              <h3 className="text-xl font-pixel text-neon-blue mb-4">AI-Powered</h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced neural networks trained on thousands of authentic pixel art pieces 
                to create stunning, original artwork in seconds.
              </p>
            </div>
            
            <div className="feature-card group text-center">
              <div className="text-5xl mb-6 group-hover:animate-bounce">⚡</div>
              <h3 className="text-xl font-pixel text-neon-pink mb-4">Lightning Fast</h3>
              <p className="text-gray-300 leading-relaxed">
                Generate professional-quality pixel art in under 3 seconds. 
                No more waiting hours for your creative vision to come to life.
              </p>
            </div>
            
            <div className="feature-card group text-center">
              <div className="text-5xl mb-6 group-hover:animate-bounce">🌈</div>
              <h3 className="text-xl font-pixel text-neon-purple mb-4">Synthwave Style</h3>
              <p className="text-gray-300 leading-relaxed">
                Authentic '80s aesthetic with vibrant neon colors, retro vibes, 
                and that unmistakable synthwave atmosphere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-synth-dark via-synth-medium to-synth-dark opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-pixel gradient-text mb-8">
            Ready to Create?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of artists and creators who are already using PixelSynth 
            to bring their retro-futuristic visions to life.
          </p>
          <Link href="/generate" className="retro-button text-2xl px-12 py-6">
            🎯 Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}
