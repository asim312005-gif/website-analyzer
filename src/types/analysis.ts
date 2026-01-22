export interface TechnologyInfo {
  name: string;
  category: 'framework' | 'library' | 'styling' | 'animation' | 'build' | 'language' | 'cms' | 'analytics' | 'other';
  version?: string;
  icon?: string;
  confidence: number;
  description?: string;
  website?: string;
  usageGuide?: string;
  predicted?: boolean;
}

export interface ComponentInfo {
  name: string;
  type: 'layout' | 'navigation' | 'hero' | 'content' | 'form' | 'media' | 'footer' | 'sidebar' | 'card' | 'button' | 'modal' | 'other';
  selector: string;
  code: string;
  styles: StyleInfo[];
  cssCode: string;
  framework?: string;
  frameworkUsage?: string;
  children?: ComponentInfo[];
  bounds?: { x: number; y: number; width: number; height: number };
  reusabilityScore?: number;
}

export interface StyleInfo {
  property: string;
  value: string;
  source: 'inline' | 'class' | 'stylesheet';
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  background: string[];
  text: string[];
  accent: string[];
}

export interface FontInfo {
  family: string;
  weights: string[];
  usage: string;
}

export interface LayoutInfo {
  type: 'flexbox' | 'grid' | 'float' | 'block' | 'inline';
  properties: Record<string, string>;
}

export interface AnimationInfo {
  name: string;
  type: 'css' | 'javascript';
  duration: string;
  timing: string;
  code: string;
}

// New Types for Enhanced Features
export interface DesignSystem {
  colors: {
    value: string;
    name: string;
    usage: 'primary' | 'secondary' | 'background' | 'text' | 'accent' | 'border';
    contrastRatio?: number;
  }[];
  typography: {
    scale: string[];
    lineHeights: string[];
    fontWeights: string[];
  };
  spacing: {
    scale: string[];
    pattern: string;
  };
  borderRadius: string[];
  shadows: string[];
}

export interface AccessibilityIssue {
  type: 'contrast' | 'alt-text' | 'tap-target' | 'heading-order' | 'aria' | 'focus' | 'semantic';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  element: string;
  description: string;
  recommendation: string;
  wcagLevel?: 'A' | 'AA' | 'AAA';
}

export interface PerformanceInsight {
  type: 'cls' | 'heavy-component' | 'render-blocking' | 'image' | 'script' | 'css';
  severity: 'high' | 'medium' | 'low';
  element?: string;
  description: string;
  impact: string;
  recommendation: string;
  value?: number;
}

export interface PageLink {
  url: string;
  text: string;
  type: 'internal' | 'external' | 'anchor';
  depth: number;
}

export interface PageRelationship {
  links: PageLink[];
  hierarchy: { [key: string]: string[] };
  orphanPages: string[];
}

export interface RebuildSuggestion {
  category: 'component' | 'layout' | 'performance' | 'accessibility' | 'seo';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  code?: string;
  wireframe?: string;
}

export interface DRYAnalysis {
  score: number;
  duplicatedPatterns: {
    pattern: string;
    count: number;
    suggestion: string;
  }[];
  reusableComponents: {
    name: string;
    instances: number;
    code: string;
  }[];
}

export interface VisualOverlay {
  id: string;
  type: 'section' | 'grid' | 'component' | 'header' | 'footer' | 'navigation';
  bounds: { x: number; y: number; width: number; height: number };
  label: string;
  details: string[];
  color: string;
}

export interface AnalysisResult {
  url: string;
  title: string;
  description: string;
  doctype: string;
  technologies: TechnologyInfo[];
  components: ComponentInfo[];
  colors: ColorPalette;
  fonts: FontInfo[];
  layouts: LayoutInfo[];
  animations: AnimationInfo[];
  htmlStructure: string;
  cssCode: string;
  jsLibraries: string[];
  metaTags: Record<string, string>;
  performance: {
    domElements: number;
    stylesheets: number;
    scripts: number;
    images: number;
  };
  // New Enhanced Fields
  designSystem: DesignSystem;
  accessibilityIssues: AccessibilityIssue[];
  performanceInsights: PerformanceInsight[];
  pageRelationships: PageRelationship;
  rebuildSuggestions: RebuildSuggestion[];
  dryAnalysis: DRYAnalysis;
  visualOverlays: VisualOverlay[];
  screenshotUrl?: string;
}
