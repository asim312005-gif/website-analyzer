import { AnalysisResult, TechnologyInfo, ComponentInfo, ColorPalette, FontInfo, AnimationInfo, DesignSystem, AccessibilityIssue, PerformanceInsight, PageRelationship, RebuildSuggestion, DRYAnalysis, VisualOverlay } from '@/types/analysis';

const technologyPatterns: Record<string, { pattern: RegExp | string[]; category: TechnologyInfo['category'] }> = {
  'React': { pattern: ['react', 'react-dom', '__REACT', '_reactRootContainer'], category: 'framework' },
  'Next.js': { pattern: ['__NEXT_DATA__', '_next', 'next/router'], category: 'framework' },
  'Vue.js': { pattern: ['__VUE__', 'Vue.', 'vue-router'], category: 'framework' },
  'Angular': { pattern: ['ng-version', 'ng-app', 'angular'], category: 'framework' },
  'Svelte': { pattern: ['svelte', '__svelte'], category: 'framework' },
  'jQuery': { pattern: ['jquery', 'jQuery'], category: 'library' },
  'Tailwind CSS': { pattern: /class="[^"]*(?:flex|grid|p-\d|m-\d|text-|bg-|border-)[^"]*"/i, category: 'styling' },
  'Bootstrap': { pattern: ['bootstrap', 'btn-primary', 'container-fluid'], category: 'styling' },
  'Material UI': { pattern: ['MuiButton', '@mui', 'material-ui'], category: 'styling' },
  'GSAP': { pattern: ['gsap', 'TweenMax', 'TweenLite', 'ScrollTrigger'], category: 'animation' },
  'Framer Motion': { pattern: ['framer-motion', 'motion.div'], category: 'animation' },
  'Three.js': { pattern: ['three.js', 'THREE.', 'WebGLRenderer'], category: 'library' },
  'D3.js': { pattern: ['d3.js', 'd3.select'], category: 'library' },
  'Webpack': { pattern: ['webpackJsonp', '__webpack'], category: 'build' },
  'Vite': { pattern: ['@vite', 'vite'], category: 'build' },
  'TypeScript': { pattern: ['.ts', 'typescript'], category: 'language' },
  'WordPress': { pattern: ['wp-content', 'wp-includes', 'wordpress'], category: 'cms' },
  'Shopify': { pattern: ['shopify', 'cdn.shopify.com'], category: 'cms' },
  'Google Analytics': { pattern: ['google-analytics', 'gtag', '_ga'], category: 'analytics' },
  'Hotjar': { pattern: ['hotjar', '_hj'], category: 'analytics' },
};

export function detectTechnologies(html: string): TechnologyInfo[] {
  const detected: TechnologyInfo[] = [];
  
  for (const [name, config] of Object.entries(technologyPatterns)) {
    let found = false;
    let confidence = 0;
    
    if (config.pattern instanceof RegExp) {
      found = config.pattern.test(html);
      confidence = found ? 85 : 0;
    } else {
      const matches = config.pattern.filter(p => html.toLowerCase().includes(p.toLowerCase()));
      found = matches.length > 0;
      confidence = Math.min(100, matches.length * 30);
    }
    
    if (found) {
      detected.push({
        name,
        category: config.category,
        confidence,
        predicted: true,
      });
    }
  }
  
  return detected.sort((a, b) => b.confidence - a.confidence);
}

export function extractColors(html: string): ColorPalette {
  const colorPatterns = {
    hex: /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g,
    rgb: /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,
    rgba: /rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g,
  };
  
  const allColors: string[] = [];
  
  for (const pattern of Object.values(colorPatterns)) {
    const matches = html.match(pattern) || [];
    allColors.push(...matches);
  }
  
  const uniqueColors = [...new Set(allColors)];
  
  return {
    primary: uniqueColors.slice(0, 3),
    secondary: uniqueColors.slice(3, 6),
    background: uniqueColors.filter(c => c.toLowerCase().includes('fff') || c.includes('255, 255, 255')).slice(0, 3),
    text: uniqueColors.filter(c => c.toLowerCase().includes('000') || c.includes('0, 0, 0')).slice(0, 3),
    accent: uniqueColors.slice(6, 10),
  };
}

export function extractFonts(html: string): FontInfo[] {
  const fontFamilyPattern = /font-family:\s*([^;}"']+)/gi;
  const googleFontsPattern = /fonts\.googleapis\.com\/css[^"']*/g;
  
  const fonts: FontInfo[] = [];
  const seen = new Set<string>();
  
  let match;
  while ((match = fontFamilyPattern.exec(html)) !== null) {
    const family = match[1].split(',')[0].trim().replace(/['"]/g, '');
    if (!seen.has(family)) {
      seen.add(family);
      fonts.push({ family, weights: ['400'], usage: 'body' });
    }
  }
  
  const googleMatches = html.match(googleFontsPattern) || [];
  for (const url of googleMatches) {
    const familyMatch = url.match(/family=([^&:]+)/);
    if (familyMatch) {
      const family = decodeURIComponent(familyMatch[1]).replace(/\+/g, ' ');
      if (!seen.has(family)) {
        seen.add(family);
        fonts.push({ family, weights: ['400', '500', '600', '700'], usage: 'google-fonts' });
      }
    }
  }
  
  return fonts;
}

export function extractComponents(doc: Document): ComponentInfo[] {
  const components: ComponentInfo[] = [];
  
  const nav = doc.querySelector('nav, header, [role="navigation"]');
  if (nav) components.push(createComponentInfo(nav, 'navigation', 'Navbar'));
  
  const hero = doc.querySelector('[class*="hero"], section:first-of-type, .banner');
  if (hero) components.push(createComponentInfo(hero, 'hero', 'Hero Section'));
  
  const buttons = doc.querySelectorAll('button, [role="button"], .btn');
  buttons.forEach((btn, i) => {
    if (i < 3) components.push(createComponentInfo(btn, 'button', `Button ${i + 1}`));
  });
  
  const cards = doc.querySelectorAll('[class*="card"], .card, article');
  cards.forEach((card, i) => {
    if (i < 3) components.push(createComponentInfo(card, 'card', `Card ${i + 1}`));
  });
  
  const forms = doc.querySelectorAll('form');
  forms.forEach((form, i) => {
    components.push(createComponentInfo(form, 'form', `Form ${i + 1}`));
  });
  
  const footer = doc.querySelector('footer, [role="contentinfo"]');
  if (footer) components.push(createComponentInfo(footer, 'footer', 'Footer'));
  
  return components;
}

function createComponentInfo(element: Element, type: ComponentInfo['type'], name: string): ComponentInfo {
  const styles: ComponentInfo['styles'] = [];
  const className = element.className || '';
  
  let framework = 'HTML/CSS';
  if (typeof className === 'string') {
    if (/flex|grid|p-\d|m-\d|text-|bg-|rounded|shadow/.test(className)) {
      framework = 'Tailwind CSS';
    } else if (/btn-|container|row|col-/.test(className)) {
      framework = 'Bootstrap';
    }
  }
  
  return {
    name,
    type,
    selector: getSelector(element),
    code: element.outerHTML.substring(0, 500),
    styles,
    cssCode: '',
    framework,
    frameworkUsage: '',
    reusabilityScore: Math.floor(Math.random() * 30) + 70,
  };
}

function getSelector(element: Element): string {
  if (element.id) return `#${element.id}`;
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(' ').filter(c => c).slice(0, 2).join('.');
    return `${element.tagName.toLowerCase()}.${classes}`;
  }
  return element.tagName.toLowerCase();
}

export function extractAnimations(html: string): AnimationInfo[] {
  const animations: AnimationInfo[] = [];
  
  const keyframePattern = /@keyframes\s+(\w+)\s*\{([^}]+\{[^}]+\})+\s*\}/g;
  let match;
  while ((match = keyframePattern.exec(html)) !== null) {
    animations.push({
      name: match[1],
      type: 'css',
      duration: 'varies',
      timing: 'varies',
      code: match[0],
    });
  }
  
  return animations;
}

function createDefaultDesignSystem(): DesignSystem {
  return {
    colors: [],
    typography: { scale: [], lineHeights: [], fontWeights: [] },
    spacing: { scale: [], pattern: '' },
    borderRadius: [],
    shadows: [],
  };
}

function createDefaultAccessibilityIssues(): AccessibilityIssue[] {
  return [];
}

function createDefaultPerformanceInsights(): PerformanceInsight[] {
  return [];
}

function createDefaultPageRelationships(): PageRelationship {
  return { links: [], hierarchy: {}, orphanPages: [] };
}

function createDefaultRebuildSuggestions(): RebuildSuggestion[] {
  return [];
}

function createDefaultDRYAnalysis(): DRYAnalysis {
  return { score: 0, duplicatedPatterns: [], reusableComponents: [] };
}

function createDefaultVisualOverlays(): VisualOverlay[] {
  return [];
}

export function analyzeHTML(html: string): AnalysisResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const doctypeMatch = html.match(/<!DOCTYPE[^>]*>/i);
  const doctype = doctypeMatch ? doctypeMatch[0] : 'HTML5';
  const title = doc.querySelector('title')?.textContent || 'Untitled';
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  const metaTags: Record<string, string> = {};
  doc.querySelectorAll('meta').forEach(meta => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) metaTags[name] = content;
  });
  
  let cssCode = '';
  doc.querySelectorAll('style').forEach(style => {
    cssCode += style.textContent + '\n';
  });
  
  const performance = {
    domElements: doc.querySelectorAll('*').length,
    stylesheets: doc.querySelectorAll('link[rel="stylesheet"]').length,
    scripts: doc.querySelectorAll('script').length,
    images: doc.querySelectorAll('img').length,
  };
  
  const jsLibraries: string[] = [];
  doc.querySelectorAll('script[src]').forEach(script => {
    const src = script.getAttribute('src') || '';
    if (src.includes('jquery')) jsLibraries.push('jQuery');
    if (src.includes('react')) jsLibraries.push('React');
    if (src.includes('vue')) jsLibraries.push('Vue.js');
  });
  
  return {
    url: '',
    title,
    description,
    doctype,
    technologies: detectTechnologies(html),
    components: extractComponents(doc),
    colors: extractColors(html),
    fonts: extractFonts(html),
    layouts: [],
    animations: extractAnimations(html),
    htmlStructure: formatHTMLStructure(doc),
    cssCode,
    jsLibraries: [...new Set(jsLibraries)],
    metaTags,
    performance,
    designSystem: createDefaultDesignSystem(),
    accessibilityIssues: createDefaultAccessibilityIssues(),
    performanceInsights: createDefaultPerformanceInsights(),
    pageRelationships: createDefaultPageRelationships(),
    rebuildSuggestions: createDefaultRebuildSuggestions(),
    dryAnalysis: createDefaultDRYAnalysis(),
    visualOverlays: createDefaultVisualOverlays(),
  };
}

function formatHTMLStructure(doc: Document): string {
  const body = doc.body;
  if (!body) return '';
  
  function traverse(element: Element, depth: number): string {
    const indent = '  '.repeat(depth);
    const tag = element.tagName.toLowerCase();
    const id = element.id ? `#${element.id}` : '';
    const classes = element.className && typeof element.className === 'string' 
      ? `.${element.className.split(' ').filter(c => c).slice(0, 2).join('.')}` 
      : '';
    
    let result = `${indent}<${tag}${id}${classes}>\n`;
    
    if (depth < 4) {
      Array.from(element.children).slice(0, 10).forEach(child => {
        result += traverse(child, depth + 1);
      });
    }
    
    return result;
  }
  
  return traverse(body, 0);
}

const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

async function fetchWithProxy(url: string, proxyFn: (url: string) => string): Promise<string> {
  const proxyUrl = proxyFn(url);
  const response = await fetch(proxyUrl);
  
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  if (proxyUrl.includes('allorigins.win')) {
    const data = await response.json();
    if (data.contents) return data.contents;
    throw new Error('No content');
  }
  
  return await response.text();
}

export async function fetchAndAnalyze(url: string): Promise<AnalysisResult> {
  let lastError: Error | null = null;
  
  for (const proxyFn of CORS_PROXIES) {
    try {
      const html = await fetchWithProxy(url, proxyFn);
      if (html && html.includes('<')) {
        const result = analyzeHTML(html);
        result.url = url;
        return result;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      continue;
    }
  }
  
  throw new Error(
    `Unable to fetch website.\n\nTry using the Demo Analysis to see all features.\n\nError: ${lastError?.message || 'Unknown'}`
  );
}
