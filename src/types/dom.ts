// Enhanced DOM types for real structure visualization

export interface DOMNode {
  id: string;
  tagName: string;
  className: string;
  id_attr: string;
  attributes: Record<string, string>;
  computedStyles: ComputedStyleInfo;
  boundingBox: BoundingBox;
  children: DOMNode[];
  textContent: string;
  depth: number;
  path: string;
  isVisible: boolean;
  displayType: 'block' | 'inline' | 'flex' | 'grid' | 'inline-block' | 'none' | 'other';
  layoutInfo: LayoutInfo;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface ComputedStyleInfo {
  display: string;
  position: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gap?: string;
  padding: string;
  margin: string;
  backgroundColor: string;
  color: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  borderRadius: string;
  border: string;
  boxShadow: string;
  zIndex: string;
  overflow: string;
  opacity: string;
  transform: string;
  transition: string;
  width: string;
  height: string;
  maxWidth: string;
  minHeight: string;
}

export interface LayoutInfo {
  isFlexContainer: boolean;
  isGridContainer: boolean;
  isFlexItem: boolean;
  isGridItem: boolean;
  flexProperties?: {
    direction: string;
    wrap: string;
    justify: string;
    align: string;
    gap: string;
  };
  gridProperties?: {
    columns: string;
    rows: string;
    gap: string;
    areas: string;
  };
}

export interface PageStructure {
  doctype: string;
  htmlVersion: string;
  language: string;
  charset: string;
  viewport: string;
  title: string;
  metaTags: MetaTag[];
  rootNode: DOMNode;
  totalElements: number;
  maxDepth: number;
  elementCounts: Record<string, number>;
  layoutSummary: LayoutSummary;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface LayoutSummary {
  hasHeader: boolean;
  hasNav: boolean;
  hasMain: boolean;
  hasFooter: boolean;
  hasAside: boolean;
  hasSections: number;
  hasArticles: number;
  layoutPattern: 'single-column' | 'sidebar-left' | 'sidebar-right' | 'dual-sidebar' | 'grid-layout' | 'complex';
  containerCount: number;
  flexContainers: number;
  gridContainers: number;
}

export interface ElementSelection {
  node: DOMNode;
  ancestors: DOMNode[];
  siblings: DOMNode[];
}
