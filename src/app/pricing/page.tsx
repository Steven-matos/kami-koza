'use client'

import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: 'Hobby Pack',
      price: '$2.99',
      credits: '100',
      costPerImage: '$0.03',
      features: [
        '100 pixel art generations',
        'FLUX.1 AI model access',
        'Commercial use rights',
        'High-resolution downloads',
        'Credits never expire'
      ],
      popular: false,
      buttonText: 'Get Started',
      savings: null
    },
    {
      name: 'Creator Pack',
      price: '$9.99',
      credits: '500',
      costPerImage: '$0.02',
      features: [
        '500 pixel art generations',
        'FLUX.1 + SDXL models',
        'Commercial use rights',
        'High-resolution downloads',
        'Priority generation queue',
        'Credits never expire'
      ],
      popular: true,
      buttonText: 'Most Popular',
      savings: 'Save 33%'
    },
    {
      name: 'Studio Pack',
      price: '$24.99',
      credits: '1,500',
      costPerImage: '$0.017',
      features: [
        '1,500 pixel art generations',
        'All AI models available',
        'Commercial use rights',
        'High-resolution downloads',
        'Priority generation queue',
        'Bulk generation tools',
        'Credits never expire'
      ],
      popular: false,
      buttonText: 'Best Value',
      savings: 'Save 43%'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-pixel text-neon-pink mb-6 animate-pulse-neon">
          Affordable Pixel Art Generation
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Professional-quality AI pixel art at transparent, fair prices. 
          Pay only for what you use with credits that never expire.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
          <div className="text-neon-blue font-pixel">
            ⚡ Commercial usage rights included
          </div>
          <div className="text-neon-green font-pixel">
            💎 Credits never expire
          </div>
          <div className="text-neon-purple font-pixel">
            🚀 Powered by FLUX.1 AI
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative p-8 rounded-lg transition-all duration-300 hover:scale-105 ${
              plan.popular
                ? 'neon-border bg-gradient-to-b from-synth-medium to-synth-dark shadow-neon-glow-lg'
                : 'border-2 border-gray-600 bg-synth-medium hover:border-neon-blue'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-neon-pink to-neon-purple px-4 py-1 rounded-full text-xs font-pixel text-white">
                  MOST POPULAR
                </span>
              </div>
            )}

            {plan.savings && (
              <div className="absolute -top-4 -right-4">
                <span className="bg-gradient-to-r from-neon-green to-neon-blue px-3 py-1 rounded-full text-xs font-pixel text-white">
                  {plan.savings}
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-pixel text-neon-blue mb-4">
                {plan.name}
              </h3>
              
              <div className="mb-6">
                <span className="text-4xl font-pixel text-white">
                  {plan.price}
                </span>
                <div className="text-neon-pink text-sm font-pixel mt-2">
                  {plan.credits} generations
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {plan.costPerImage} per image
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <span className="text-neon-green mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded font-pixel transition-all duration-300 ${
                  plan.popular
                    ? 'retro-button'
                    : 'bg-synth-dark border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-synth-dark'
                }`}
                onClick={() => alert('Payment integration coming soon! This is a demo.')}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Value Proposition Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-pixel text-neon-blue mb-6">
            Why Choose PixelSynth?
          </h2>
          <p className="text-gray-300 text-lg">
            Compare our transparent, fair pricing with the competition
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-synth-medium rounded-lg border border-gray-600 text-center">
            <div className="text-2xl mb-4">💰</div>
            <h3 className="text-lg font-pixel text-neon-green mb-3">
              Transparent Pricing
            </h3>
            <p className="text-gray-300 text-sm">
              No hidden fees, no monthly subscriptions. Pay once, use forever. 
              Starting at just $0.017 per image.
            </p>
          </div>
          
          <div className="p-6 bg-synth-medium rounded-lg border border-gray-600 text-center">
            <div className="text-2xl mb-4">🎨</div>
            <h3 className="text-lg font-pixel text-neon-pink mb-3">
              Premium Quality
            </h3>
            <p className="text-gray-300 text-sm">
              FLUX.1 and SDXL models deliver authentic pixel art with perfect 
              retro aesthetics and crisp detail.
            </p>
          </div>
          
          <div className="p-6 bg-synth-medium rounded-lg border border-gray-600 text-center">
            <div className="text-2xl mb-4">⚡</div>
            <h3 className="text-lg font-pixel text-neon-blue mb-3">
              Lightning Fast
            </h3>
            <p className="text-gray-300 text-sm">
              Generate high-quality pixel art in seconds, not minutes. 
              Perfect for rapid prototyping and iteration.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-pixel text-neon-blue text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-synth-medium rounded-lg border border-gray-600">
            <h3 className="text-lg font-pixel text-neon-pink mb-3">
              How does pricing work?
            </h3>
            <p className="text-gray-300">
              Each image generation costs 1 credit. Our prices range from $0.017-$0.03 per image, 
              making us significantly more affordable than competitors while maintaining quality.
            </p>
          </div>

          <div className="p-6 bg-synth-medium rounded-lg border border-gray-600">
            <h3 className="text-lg font-pixel text-neon-pink mb-3">
              Can I use images commercially?
            </h3>
            <p className="text-gray-300">
              Yes! All plans include full commercial usage rights. 
              Use your generated pixel art in games, marketing, NFTs, or any project.
            </p>
          </div>

          <div className="p-6 bg-synth-medium rounded-lg border border-gray-600">
            <h3 className="text-lg font-pixel text-neon-pink mb-3">
              Do credits expire?
            </h3>
            <p className="text-gray-300">
              Never! Your credits are yours to keep forever. Use them at your own pace 
              without worrying about monthly limits or expiration dates.
            </p>
          </div>

          <div className="p-6 bg-synth-medium rounded-lg border border-gray-600">
            <h3 className="text-lg font-pixel text-neon-pink mb-3">
              What AI models do you use?
            </h3>
            <p className="text-gray-300">
              We use cutting-edge FLUX.1 and Stable Diffusion XL models, 
              specifically optimized for pixel art generation with authentic retro aesthetics.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16 p-8 neon-border rounded-lg bg-synth-medium">
        <h3 className="text-2xl font-pixel text-neon-pink mb-4">
          Ready to Create?
        </h3>
        <p className="text-gray-300 mb-6">
          Start generating amazing pixel art today. No commitment required!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/generate" className="retro-button">
            Try Free Generations
          </Link>
          <button 
            className="bg-synth-dark border-2 border-neon-blue text-neon-blue px-6 py-3 font-pixel hover:bg-neon-blue hover:text-synth-dark transition-all duration-300"
            onClick={() => alert('Contact form coming soon!')}
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  )
} 