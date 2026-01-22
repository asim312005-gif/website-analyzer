import { AnalysisResult } from '@/types/analysis';

export const demoAnalysisResult: AnalysisResult = {
  url: 'https://example-modern-saas.com',
  title: 'Modern SaaS Landing Page',
  description: 'A beautifully crafted landing page showcasing modern web technologies',
  doctype: '<!DOCTYPE html>',
  screenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
  
  technologies: [
    { 
      name: 'React', 
      category: 'framework', 
      confidence: 95,
      predicted: true,
      description: 'A JavaScript library for building user interfaces with component-based architecture',
      website: 'https://react.dev',
      usageGuide: `npm install react react-dom\n\nimport React from 'react';\n\nfunction App() {\n  return <h1>Hello World</h1>;\n}`
    },
    { 
      name: 'Next.js', 
      category: 'framework', 
      confidence: 90,
      predicted: true,
      description: 'React framework for production with server-side rendering',
      website: 'https://nextjs.org',
      usageGuide: `npx create-next-app@latest my-app`
    },
    { 
      name: 'Tailwind CSS', 
      category: 'styling', 
      confidence: 98,
      predicted: true,
      description: 'A utility-first CSS framework for rapid UI development',
      website: 'https://tailwindcss.com',
      usageGuide: `npm install -D tailwindcss\nnpx tailwindcss init`
    },
    { 
      name: 'Framer Motion', 
      category: 'animation', 
      confidence: 75,
      predicted: true,
      description: 'Production-ready motion library for React',
      website: 'https://www.framer.com/motion',
      usageGuide: `npm install framer-motion`
    },
    { 
      name: 'TypeScript', 
      category: 'language', 
      confidence: 85,
      predicted: true,
      description: 'JavaScript with syntax for types',
      website: 'https://www.typescriptlang.org',
      usageGuide: `npm install -D typescript`
    },
  ],
  
  components: [
    {
      name: 'Navigation Bar',
      type: 'navigation',
      selector: 'nav.sticky.top-0',
      bounds: { x: 0, y: 0, width: 1200, height: 80 },
      reusabilityScore: 95,
      framework: 'React + Tailwind CSS',
      frameworkUsage: `export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />
        <NavLinks />
        <CTAButton />
      </div>
    </nav>
  );
}`,
      code: `<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
  <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <img src="/logo.svg" class="w-8 h-8" />
      <span class="font-bold text-xl">Brand</span>
    </div>
    <ul class="hidden md:flex gap-8">
      <li><a href="#" class="text-gray-600 hover:text-gray-900">Features</a></li>
      <li><a href="#" class="text-gray-600 hover:text-gray-900">Pricing</a></li>
    </ul>
    <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg">Get Started</button>
  </div>
</nav>`,
      cssCode: `nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #f3f4f6;
}`,
      styles: [
        { property: 'position', value: 'sticky', source: 'class' },
        { property: 'backdrop-filter', value: 'blur(12px)', source: 'class' },
      ]
    },
    {
      name: 'Hero Section',
      type: 'hero',
      selector: 'section.hero',
      bounds: { x: 0, y: 80, width: 1200, height: 600 },
      reusabilityScore: 80,
      framework: 'React + Framer Motion',
      frameworkUsage: `import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-5xl font-bold mb-6">
          Build faster, ship smarter
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The modern platform for teams
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary">Start Free Trial</Button>
          <Button variant="outline">Watch Demo</Button>
        </div>
      </motion.div>
    </section>
  );
}`,
      code: `<section class="py-24 bg-gradient-to-br from-indigo-50 to-white">
  <div class="max-w-4xl mx-auto text-center px-6">
    <h1 class="text-5xl font-bold text-gray-900 mb-6">
      Build faster, ship smarter
    </h1>
    <p class="text-xl text-gray-600 mb-8">
      The modern platform for teams who want to move fast
    </p>
    <div class="flex gap-4 justify-center">
      <button class="bg-indigo-600 text-white px-8 py-3 rounded-lg">Start Free Trial</button>
      <button class="border border-gray-300 px-8 py-3 rounded-lg">Watch Demo</button>
    </div>
  </div>
</section>`,
      cssCode: `.hero {
  padding: 96px 0;
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 100%);
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
}`,
      styles: [
        { property: 'padding', value: '96px 0', source: 'class' },
        { property: 'background', value: 'linear-gradient(135deg, #eef2ff, #ffffff)', source: 'class' },
      ]
    },
    {
      name: 'Feature Card',
      type: 'card',
      selector: 'div.feature-card',
      bounds: { x: 100, y: 720, width: 350, height: 280 },
      reusabilityScore: 98,
      framework: 'React + Tailwind CSS',
      frameworkUsage: `interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group">
      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}`,
      code: `<div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
  <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
    <svg class="w-6 h-6 text-indigo-600">...</svg>
  </div>
  <h3 class="text-xl font-semibold mb-2">Feature Title</h3>
  <p class="text-gray-600">Feature description goes here.</p>
</div>`,
      cssCode: `.feature-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  box-shadow: 0 20px 40px -5px rgba(0,0,0,0.15);
  transform: translateY(-4px);
}`,
      styles: [
        { property: 'padding', value: '24px', source: 'class' },
        { property: 'border-radius', value: '16px', source: 'class' },
      ]
    },
    {
      name: 'CTA Button',
      type: 'button',
      selector: 'button.bg-indigo-600',
      bounds: { x: 500, y: 400, width: 180, height: 48 },
      reusabilityScore: 100,
      framework: 'React + Tailwind CSS',
      frameworkUsage: `interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, variant = 'primary', size = 'md' }: ButtonProps) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    outline: 'border border-gray-300 hover:border-gray-400',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-8 py-3 text-lg',
  };
  
  return (
    <button className={\`rounded-lg font-medium transition-all \${variants[variant]} \${sizes[size]}\`}>
      {children}
    </button>
  );
}`,
      code: `<button class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/25">
  Get Started
</button>`,
      cssCode: `.btn-primary {
  background-color: #4f46e5;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.25);
}

.btn-primary:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
}`,
      styles: [
        { property: 'background-color', value: '#4f46e5', source: 'class' },
        { property: 'border-radius', value: '8px', source: 'class' },
      ]
    },
    {
      name: 'Footer',
      type: 'footer',
      selector: 'footer',
      bounds: { x: 0, y: 2400, width: 1200, height: 300 },
      reusabilityScore: 90,
      framework: 'React + Tailwind CSS',
      frameworkUsage: `export function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'Integrations'],
    Company: ['About', 'Blog', 'Careers'],
    Legal: ['Privacy', 'Terms'],
  };
  
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8">
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <h4 className="font-semibold mb-4">{title}</h4>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}`,
      code: `<footer class="bg-gray-900 text-white py-16">
  <div class="max-w-6xl mx-auto grid grid-cols-4 gap-8 px-6">
    <div>
      <h4 class="font-semibold mb-4">Product</h4>
      <ul class="space-y-2 text-gray-400">
        <li><a href="#">Features</a></li>
        <li><a href="#">Pricing</a></li>
      </ul>
    </div>
  </div>
</footer>`,
      cssCode: `footer {
  background-color: #111827;
  color: white;
  padding: 64px 0;
}`,
      styles: [
        { property: 'background-color', value: '#111827', source: 'class' },
        { property: 'padding', value: '64px 0', source: 'class' },
      ]
    },
  ],
  
  colors: {
    primary: ['#4f46e5', '#6366f1', '#818cf8'],
    secondary: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    background: ['#ffffff', '#f9fafb', '#f3f4f6'],
    text: ['#111827', '#374151', '#6b7280'],
    accent: ['#10b981', '#f59e0b', '#ef4444'],
  },
  
  fonts: [
    { family: 'Inter', weights: ['400', '500', '600', '700'], usage: 'primary' },
    { family: 'JetBrains Mono', weights: ['400', '500'], usage: 'code' },
  ],
  
  layouts: [
    { type: 'flexbox', properties: { flexDirection: 'row', justifyContent: 'space-between', gap: '32px' } },
    { type: 'grid', properties: { gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' } },
  ],
  
  animations: [
    {
      name: 'fadeInUp',
      type: 'css',
      duration: '0.6s',
      timing: 'ease-out',
      code: `@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`
    },
    {
      name: 'scaleOnHover',
      type: 'css',
      duration: '0.2s',
      timing: 'ease-in-out',
      code: `.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}`
    },
  ],
  
  htmlStructure: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern SaaS Landing Page</title>
</head>
<body class="min-h-screen bg-white">
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
    <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img src="/logo.svg" class="w-8 h-8" alt="Logo" />
        <span class="font-bold text-xl text-gray-900">SaaSify</span>
      </div>
      <ul class="hidden md:flex items-center gap-8">
        <li><a href="#features" class="text-gray-600 hover:text-gray-900 transition-colors">Features</a></li>
        <li><a href="#pricing" class="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a></li>
        <li><a href="#testimonials" class="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a></li>
        <li><a href="/about" class="text-gray-600 hover:text-gray-900 transition-colors">About</a></li>
      </ul>
      <div class="flex items-center gap-4">
        <a href="/login" class="text-gray-600 hover:text-gray-900 font-medium">Log in</a>
        <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/25">
          Get Started
        </button>
      </div>
    </nav>
  </header>

  <main>
    <section id="hero" class="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div class="max-w-4xl mx-auto text-center px-6">
        <span class="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
          🚀 Now with AI-powered features
        </span>
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Build faster,<br/>ship smarter
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The modern platform for teams who want to move fast without breaking things. 
          Streamline your workflow with our intelligent tools.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30">
            Start Free Trial
          </button>
          <button class="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 bg-white px-8 py-4 rounded-xl font-semibold text-lg text-gray-700 transition-all hover:bg-gray-50">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
            Watch Demo
          </button>
        </div>
        <p class="mt-6 text-sm text-gray-500">No credit card required • 14-day free trial</p>
      </div>
    </section>

    <section id="features" class="py-24 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features to help your team collaborate and deliver faster than ever.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div class="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
            <p class="text-gray-600 leading-relaxed">Optimized for speed with edge computing and smart caching strategies.</p>
          </div>
          <div class="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Enterprise Security</h3>
            <p class="text-gray-600 leading-relaxed">Bank-level encryption and SOC 2 compliance to keep your data safe.</p>
          </div>
          <div class="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow group">
            <div class="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
            <p class="text-gray-600 leading-relaxed">Real-time insights with customizable dashboards and export options.</p>
          </div>
        </div>
      </div>
    </section>

    <section id="testimonials" class="py-24 bg-gray-50">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-16">Loved by teams worldwide</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="flex items-center gap-1 mb-4">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <blockquote class="text-gray-700 mb-6">"This tool has transformed how our team works. We've cut our development time in half."</blockquote>
            <div class="flex items-center gap-3">
              <img src="/avatar-1.jpg" class="w-12 h-12 rounded-full" alt="Sarah Chen" />
              <div>
                <p class="font-semibold text-gray-900">Sarah Chen</p>
                <p class="text-sm text-gray-500">CTO at TechCorp</p>
              </div>
            </div>
          </article>
          <article class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="flex items-center gap-1 mb-4">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <blockquote class="text-gray-700 mb-6">"The best investment we've made this year. ROI was visible within the first month."</blockquote>
            <div class="flex items-center gap-3">
              <img src="/avatar-2.jpg" class="w-12 h-12 rounded-full" alt="Marcus Johnson" />
              <div>
                <p class="font-semibold text-gray-900">Marcus Johnson</p>
                <p class="text-sm text-gray-500">Founder at StartupXYZ</p>
              </div>
            </div>
          </article>
          <article class="bg-white p-8 rounded-2xl shadow-lg">
            <div class="flex items-center gap-1 mb-4">
              <span class="text-yellow-400">★★★★★</span>
            </div>
            <blockquote class="text-gray-700 mb-6">"Finally, a platform that understands what developers need. Clean, fast, reliable."</blockquote>
            <div class="flex items-center gap-3">
              <img src="/avatar-3.jpg" class="w-12 h-12 rounded-full" alt="Emily Rodriguez" />
              <div>
                <p class="font-semibold text-gray-900">Emily Rodriguez</p>
                <p class="text-sm text-gray-500">Lead Dev at Agency42</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="pricing" class="py-24 bg-white">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p class="text-xl text-gray-600">No hidden fees. Cancel anytime.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white border-2 border-gray-100 p-8 rounded-2xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Starter</h3>
            <p class="text-4xl font-bold text-gray-900 mb-1">$19<span class="text-lg font-normal text-gray-500">/mo</span></p>
            <p class="text-gray-500 mb-6">For individuals and small teams</p>
            <ul class="space-y-3 mb-8 text-gray-600">
              <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> Up to 5 projects</li>
              <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> Basic analytics</li>
              <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> Email support</li>
            </ul>
            <button class="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Get Started</button>
          </div>
          <div class="bg-indigo-600 p-8 rounded-2xl shadow-xl shadow-indigo-500/25 relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
            <h3 class="text-lg font-semibold text-white mb-2">Pro</h3>
            <p class="text-4xl font-bold text-white mb-1">$49<span class="text-lg font-normal text-indigo-200">/mo</span></p>
            <p class="text-indigo-200 mb-6">For growing teams</p>
            <ul class="space-y-3 mb-8 text-indigo-100">
              <li class="flex items-center gap-2"><span class="text-emerald-300">✓</span> Unlimited projects</li>
              <li class="flex items-center gap-2"><span class="text-emerald-300">✓</span> Advanced analytics</li>
              <li class="flex items-center gap-2"><span class="text-emerald-300">✓</span> Priority support</li>
              <li class="flex items-center gap-2"><span class="text-emerald-300">✓</span> API access</li>
            </ul>
            <button class="w-full py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">Get Started</button>
          </div>
          <div class="bg-white border-2 border-gray-100 p-8 rounded-2xl">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Enterprise</h3>
            <p class="text-4xl font-bold text-gray-900 mb-1">Custom</p>
            <p class="text-gray-500 mb-6">For large organizations</p>
            <ul class="space-y-3 mb-8 text-gray-600">
              <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> Everything in Pro</li>
              <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> Dedicated support</li>
              <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> Custom integrations</li>
              <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span> SLA guarantee</li>
            </ul>
            <button class="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>

    <section id="cta" class="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div class="max-w-4xl mx-auto text-center px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Ready to get started?</h2>
        <p class="text-xl text-indigo-100 mb-8">Join thousands of teams already using our platform.</p>
        <button class="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg">
          Start Your Free Trial
        </button>
      </div>
    </section>
  </main>

  <footer class="bg-gray-900 text-white py-16">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 class="font-semibold mb-4">Product</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="/features" class="hover:text-white transition-colors">Features</a></li>
            <li><a href="/pricing" class="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="/integrations" class="hover:text-white transition-colors">Integrations</a></li>
            <li><a href="/changelog" class="hover:text-white transition-colors">Changelog</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Company</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="/about" class="hover:text-white transition-colors">About</a></li>
            <li><a href="/blog" class="hover:text-white transition-colors">Blog</a></li>
            <li><a href="/careers" class="hover:text-white transition-colors">Careers</a></li>
            <li><a href="/press" class="hover:text-white transition-colors">Press</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Resources</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="/docs" class="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="/help" class="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="/community" class="hover:text-white transition-colors">Community</a></li>
            <li><a href="/status" class="hover:text-white transition-colors">Status</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Legal</h4>
          <ul class="space-y-2 text-gray-400">
            <li><a href="/privacy" class="hover:text-white transition-colors">Privacy</a></li>
            <li><a href="/terms" class="hover:text-white transition-colors">Terms</a></li>
            <li><a href="/security" class="hover:text-white transition-colors">Security</a></li>
            <li><a href="/cookies" class="hover:text-white transition-colors">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <img src="/logo-white.svg" class="w-8 h-8" alt="Logo" />
          <span class="font-bold text-xl">SaaSify</span>
        </div>
        <p class="text-gray-400 text-sm">© 2024 SaaSify. All rights reserved.</p>
        <div class="flex items-center gap-4">
          <a href="https://twitter.com/saasify" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href="https://github.com/saasify" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://linkedin.com/company/saasify" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`,
  
  cssCode: `/* Complete extracted CSS */
:root {
  --color-primary: #4f46e5;
  --color-secondary: #8b5cf6;
  --font-sans: 'Inter', sans-serif;
}`,
  
  jsLibraries: ['React', 'Next.js', 'Framer Motion'],
  
  metaTags: {
    'viewport': 'width=device-width, initial-scale=1',
    'description': 'Modern SaaS landing page',
    'og:title': 'Modern SaaS',
  },
  
  performance: {
    domElements: 847,
    stylesheets: 3,
    scripts: 8,
    images: 12,
  },
  
  // NEW ENHANCED FIELDS
  designSystem: {
    colors: [
      { value: '#4f46e5', name: 'Indigo 600', usage: 'primary', contrastRatio: 4.5 },
      { value: '#6366f1', name: 'Indigo 500', usage: 'primary', contrastRatio: 3.8 },
      { value: '#111827', name: 'Gray 900', usage: 'text', contrastRatio: 15.2 },
      { value: '#6b7280', name: 'Gray 500', usage: 'text', contrastRatio: 4.6 },
      { value: '#f9fafb', name: 'Gray 50', usage: 'background', contrastRatio: 1.0 },
      { value: '#10b981', name: 'Emerald 500', usage: 'accent', contrastRatio: 4.2 },
    ],
    typography: {
      scale: ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'],
      lineHeights: ['1.2', '1.4', '1.5', '1.6', '1.75'],
      fontWeights: ['400', '500', '600', '700'],
    },
    spacing: {
      scale: ['4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px', '80px', '96px'],
      pattern: '4px base unit (multiples of 4)',
    },
    borderRadius: ['4px', '6px', '8px', '12px', '16px', '24px', '9999px'],
    shadows: [
      '0 1px 2px rgba(0,0,0,0.05)',
      '0 4px 6px -1px rgba(0,0,0,0.1)',
      '0 10px 25px -5px rgba(0,0,0,0.1)',
      '0 20px 40px -10px rgba(0,0,0,0.15)',
    ],
  },
  
  accessibilityIssues: [
    {
      type: 'contrast',
      severity: 'serious',
      element: '.text-gray-400 on white background',
      description: 'Text contrast ratio is 2.7:1, below the WCAG AA minimum of 4.5:1',
      recommendation: 'Use .text-gray-600 (#4B5563) for better contrast',
      wcagLevel: 'AA',
    },
    {
      type: 'alt-text',
      severity: 'critical',
      element: 'img.hero-image',
      description: 'Image missing alt attribute',
      recommendation: 'Add descriptive alt text: alt="Hero illustration showing..."',
      wcagLevel: 'A',
    },
    {
      type: 'tap-target',
      severity: 'moderate',
      element: '.nav-link (mobile)',
      description: 'Touch target size is 32x32px, below recommended 44x44px',
      recommendation: 'Increase padding or add min-height: 44px; min-width: 44px;',
      wcagLevel: 'AAA',
    },
    {
      type: 'heading-order',
      severity: 'moderate',
      element: 'section.features',
      description: 'Heading level skips from H1 to H3',
      recommendation: 'Use H2 for section headings after the main H1',
      wcagLevel: 'A',
    },
    {
      type: 'focus',
      severity: 'serious',
      element: 'button.cta',
      description: 'Focus indicator removed with outline: none',
      recommendation: 'Add visible focus styles: focus:ring-2 focus:ring-indigo-500',
      wcagLevel: 'AA',
    },
  ],
  
  performanceInsights: [
    {
      type: 'cls',
      severity: 'medium',
      element: '.hero-image',
      description: 'Potential Cumulative Layout Shift detected',
      impact: 'Image without explicit dimensions may cause layout shift',
      recommendation: 'Add width and height attributes to prevent CLS',
      value: 0.15,
    },
    {
      type: 'heavy-component',
      severity: 'high',
      element: 'section.testimonials',
      description: 'Heavy component with 120+ DOM nodes',
      impact: 'May slow down initial render and interaction',
      recommendation: 'Consider lazy loading or virtualization for this section',
      value: 127,
    },
    {
      type: 'render-blocking',
      severity: 'medium',
      element: '<link rel="stylesheet" href="fonts.css">',
      description: 'External stylesheet blocks rendering',
      impact: 'Delays First Contentful Paint by ~200ms',
      recommendation: 'Use font-display: swap or preload critical fonts',
    },
    {
      type: 'image',
      severity: 'low',
      element: 'img.feature-icon',
      description: '6 images could use modern formats',
      impact: 'Could save ~45KB with WebP/AVIF',
      recommendation: 'Convert to WebP with fallback for older browsers',
    },
  ],
  
  pageRelationships: {
    links: [
      { url: '/', text: 'Home', type: 'internal', depth: 0 },
      { url: '/features', text: 'Features', type: 'internal', depth: 1 },
      { url: '/pricing', text: 'Pricing', type: 'internal', depth: 1 },
      { url: '/about', text: 'About', type: 'internal', depth: 1 },
      { url: '/blog', text: 'Blog', type: 'internal', depth: 1 },
      { url: '#features', text: 'Features Section', type: 'anchor', depth: 0 },
      { url: 'https://twitter.com/brand', text: 'Twitter', type: 'external', depth: 1 },
      { url: 'https://github.com/brand', text: 'GitHub', type: 'external', depth: 1 },
    ],
    hierarchy: {
      '/': ['/features', '/pricing', '/about', '/blog'],
      '/features': ['/features/analytics', '/features/automation'],
      '/blog': ['/blog/post-1', '/blog/post-2'],
    },
    orphanPages: [],
  },
  
  rebuildSuggestions: [
    {
      category: 'component',
      title: 'Extract Button Component',
      description: 'Found 12 similar button patterns that could be unified into a single reusable Button component',
      priority: 'high',
      code: `// Suggested Button component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ variant, size, children, onClick }: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all';
  // ... variant and size styles
  return <button className={styles}>{children}</button>;
};`,
    },
    {
      category: 'layout',
      title: 'Implement CSS Grid for Features',
      description: 'Current flexbox layout could be simplified with CSS Grid for better responsiveness',
      priority: 'medium',
      code: `.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}`,
    },
    {
      category: 'accessibility',
      title: 'Add Skip Navigation Link',
      description: 'No skip link found for keyboard users to bypass navigation',
      priority: 'high',
      code: `<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg z-50">
  Skip to main content
</a>`,
    },
    {
      category: 'performance',
      title: 'Lazy Load Below-Fold Images',
      description: '8 images below the fold could be lazy loaded',
      priority: 'medium',
      code: `<img src="image.jpg" loading="lazy" alt="..." />`,
    },
    {
      category: 'seo',
      title: 'Add Structured Data',
      description: 'Missing JSON-LD structured data for better search results',
      priority: 'low',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Your SaaS Product",
  "applicationCategory": "BusinessApplication"
}
</script>`,
    },
  ],
  
  dryAnalysis: {
    score: 72,
    duplicatedPatterns: [
      {
        pattern: 'Button styles (bg-indigo-600 text-white px-4 py-2 rounded-lg)',
        count: 12,
        suggestion: 'Create a reusable Button component with variants',
      },
      {
        pattern: 'Card container (bg-white p-6 rounded-2xl shadow-lg)',
        count: 8,
        suggestion: 'Extract Card component with customizable props',
      },
      {
        pattern: 'Section padding (py-16 md:py-24)',
        count: 6,
        suggestion: 'Create Section wrapper component or utility class',
      },
    ],
    reusableComponents: [
      {
        name: 'Button',
        instances: 12,
        code: 'const Button = ({ variant, children }) => ...',
      },
      {
        name: 'Card',
        instances: 8,
        code: 'const Card = ({ children, className }) => ...',
      },
      {
        name: 'SectionWrapper',
        instances: 6,
        code: 'const Section = ({ children, id }) => ...',
      },
    ],
  },
  
  visualOverlays: [
    { id: '1', type: 'navigation', bounds: { x: 0, y: 0, width: 100, height: 5 }, label: 'Navigation', details: ['Sticky header', 'Blur backdrop', 'Z-index: 50'], color: '#10b981' },
    { id: '2', type: 'header', bounds: { x: 0, y: 5, width: 100, height: 40 }, label: 'Hero Section', details: ['Gradient background', 'Centered content', 'CTA buttons'], color: '#6366f1' },
    { id: '3', type: 'grid', bounds: { x: 5, y: 48, width: 90, height: 25 }, label: 'Features Grid', details: ['3-column grid', 'Gap: 24px', 'Auto-responsive'], color: '#f59e0b' },
    { id: '4', type: 'section', bounds: { x: 0, y: 75, width: 100, height: 15 }, label: 'Testimonials', details: ['Carousel', 'User reviews'], color: '#8b5cf6' },
    { id: '5', type: 'footer', bounds: { x: 0, y: 92, width: 100, height: 8 }, label: 'Footer', details: ['4-column grid', 'Dark theme'], color: '#64748b' },
  ],
};
