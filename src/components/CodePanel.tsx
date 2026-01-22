import { useState } from 'react';
import { Copy, Check, FileCode, FileType, Braces, Info } from 'lucide-react';

interface CodePanelProps {
  htmlStructure: string;
  cssCode: string;
}

type TabType = 'structure' | 'css' | 'variables' | 'guide';

export function CodePanel({ htmlStructure, cssCode }: CodePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('structure');
  const [copied, setCopied] = useState(false);

  const cssVariablesGuide = `/* ============================================
   CSS VARIABLES TEMPLATE
   Copy this to your project for consistent theming
   ============================================ */

:root {
  /* ----------------
     Color Palette
     ---------------- */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-primary-light: #dbeafe;
  
  --color-secondary: #6366f1;
  --color-secondary-hover: #4f46e5;
  
  --color-accent: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-success: #22c55e;

  /* ----------------
     Neutral Colors
     ---------------- */
  --color-white: #ffffff;
  --color-black: #000000;
  
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* ----------------
     Typography
     ---------------- */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'JetBrains Mono', Consolas, monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */

  /* ----------------
     Spacing
     ---------------- */
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */

  /* ----------------
     Border Radius
     ---------------- */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;

  /* ----------------
     Shadows
     ---------------- */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  /* ----------------
     Transitions
     ---------------- */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
  
  /* ----------------
     Z-Index Scale
     ---------------- */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
}

/* Dark Mode Variables */
@media (prefers-color-scheme: dark) {
  :root {
    --color-gray-50: #111827;
    --color-gray-100: #1f2937;
    --color-gray-900: #f9fafb;
    /* ... override other colors for dark mode */
  }
}`;

  const frameworkGuide = `/* ============================================
   FRAMEWORK INTEGRATION GUIDE
   ============================================ */

/* ----------------
   1. REACT + TAILWIND CSS
   ---------------- */

// Installation:
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p

// tailwind.config.js:
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#6366f1',
      },
    },
  },
  plugins: [],
};

// Component Example:
function Button({ children, variant = 'primary' }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    outline: 'border border-gray-300 hover:border-gray-400',
  };
  
  return (
    <button className={\`px-4 py-2 rounded-lg font-medium transition-colors \${variants[variant]}\`}>
      {children}
    </button>
  );
}

/* ----------------
   2. NEXT.JS APP ROUTER
   ---------------- */

// app/layout.tsx:
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

// app/page.tsx:
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">Welcome</h1>
    </main>
  );
}

/* ----------------
   3. ANIMATIONS WITH FRAMER MOTION
   ---------------- */

// npm install framer-motion

import { motion } from 'framer-motion';

function FadeInSection({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------
   4. ANIMATIONS WITH GSAP
   ---------------- */

// npm install gsap

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function AnimatedElement() {
  const ref = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
      }
    );
  }, []);
  
  return <div ref={ref}>Animated content</div>;
}

/* ----------------
   5. CSS-IN-JS (Styled Components)
   ---------------- */

// npm install styled-components

import styled from 'styled-components';

const Button = styled.button\`
  background-color: \${props => props.primary ? '#2563eb' : '#f3f4f6'};
  color: \${props => props.primary ? 'white' : '#111827'};
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
\`;`;

  const getActiveCode = () => {
    switch (activeTab) {
      case 'structure':
        return htmlStructure || '<!-- No HTML structure extracted -->';
      case 'css':
        return cssCode || '/* No CSS code extracted */';
      case 'variables':
        return cssVariablesGuide;
      case 'guide':
        return frameworkGuide;
      default:
        return '';
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'structure', label: 'HTML Structure', icon: <FileCode className="w-4 h-4" />, color: 'text-orange-500' },
    { id: 'css', label: 'CSS Code', icon: <FileType className="w-4 h-4" />, color: 'text-cyan-500' },
    { id: 'variables', label: 'CSS Variables', icon: <Braces className="w-4 h-4" />, color: 'text-purple-500' },
    { id: 'guide', label: 'Framework Guide', icon: <Info className="w-4 h-4" />, color: 'text-green-500' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? `${tab.color} bg-white border-b-2 border-current` 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-2 mr-4 text-sm text-purple-600 hover:text-purple-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy All'}
        </button>
      </div>
      
      {/* Description for special tabs */}
      {(activeTab === 'variables' || activeTab === 'guide') && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
          <p className="text-sm text-purple-700">
            {activeTab === 'variables' && (
              <>💡 <strong>CSS Variables Template:</strong> Copy these CSS custom properties to maintain consistent theming across your project.</>
            )}
            {activeTab === 'guide' && (
              <>📚 <strong>Framework Integration Guide:</strong> Learn how to implement the detected technologies in your own project.</>
            )}
          </p>
        </div>
      )}
      
      <div className="p-4 bg-slate-900 max-h-[600px] overflow-auto">
        <pre className="text-sm font-mono">
          <code className={
            activeTab === 'structure' ? 'text-orange-300' :
            activeTab === 'css' ? 'text-cyan-300' :
            activeTab === 'variables' ? 'text-purple-300' :
            'text-green-300'
          }>
            {getActiveCode()}
          </code>
        </pre>
      </div>
    </div>
  );
}
