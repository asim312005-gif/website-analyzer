// Real DOM Structure Parser

import { DOMNode, PageStructure, LayoutSummary, ComputedStyleInfo, BoundingBox, LayoutInfo, MetaTag } from '../types/dom';

let nodeIdCounter = 0;

const generateNodeId = (): string => {
  return `node-${++nodeIdCounter}`;
};

const getDisplayType = (display: string): DOMNode['displayType'] => {
  if (display.includes('flex')) return 'flex';
  if (display.includes('grid')) return 'grid';
  if (display === 'block') return 'block';
  if (display === 'inline-block') return 'inline-block';
  if (display === 'inline') return 'inline';
  if (display === 'none') return 'none';
  return 'other';
};

const parseComputedStyles = (element: Element): ComputedStyleInfo => {
  // For parsed HTML, we extract inline styles and common attributes
  const style = element.getAttribute('style') || '';
  const styleMap: Record<string, string> = {};
  
  style.split(';').forEach(prop => {
    const [key, value] = prop.split(':').map(s => s?.trim());
    if (key && value) {
      styleMap[key] = value;
    }
  });

  // Check for common class-based styling hints
  const className = element.className || '';
  
  // Detect Tailwind classes
  const hasFlex = className.includes('flex');
  const hasGrid = className.includes('grid');
  const hasBlock = className.includes('block');
  
  let display = styleMap['display'] || 'block';
  if (hasFlex) display = 'flex';
  if (hasGrid) display = 'grid';
  if (hasBlock) display = 'block';

  return {
    display,
    position: styleMap['position'] || 'static',
    flexDirection: styleMap['flex-direction'] || (className.includes('flex-col') ? 'column' : 'row'),
    justifyContent: styleMap['justify-content'] || extractTailwindJustify(className),
    alignItems: styleMap['align-items'] || extractTailwindAlign(className),
    gridTemplateColumns: styleMap['grid-template-columns'] || extractTailwindGridCols(className),
    gridTemplateRows: styleMap['grid-template-rows'],
    gap: styleMap['gap'] || extractTailwindGap(className),
    padding: styleMap['padding'] || extractTailwindPadding(className),
    margin: styleMap['margin'] || extractTailwindMargin(className),
    backgroundColor: styleMap['background-color'] || extractTailwindBg(className),
    color: styleMap['color'] || '',
    fontSize: styleMap['font-size'] || extractTailwindFontSize(className),
    fontFamily: styleMap['font-family'] || '',
    fontWeight: styleMap['font-weight'] || extractTailwindFontWeight(className),
    borderRadius: styleMap['border-radius'] || extractTailwindRounded(className),
    border: styleMap['border'] || '',
    boxShadow: styleMap['box-shadow'] || extractTailwindShadow(className),
    zIndex: styleMap['z-index'] || '',
    overflow: styleMap['overflow'] || '',
    opacity: styleMap['opacity'] || '1',
    transform: styleMap['transform'] || '',
    transition: styleMap['transition'] || '',
    width: styleMap['width'] || extractTailwindWidth(className),
    height: styleMap['height'] || extractTailwindHeight(className),
    maxWidth: styleMap['max-width'] || extractTailwindMaxWidth(className),
    minHeight: styleMap['min-height'] || '',
  };
};

// Tailwind class extractors
const extractTailwindJustify = (className: string): string => {
  if (className.includes('justify-center')) return 'center';
  if (className.includes('justify-between')) return 'space-between';
  if (className.includes('justify-around')) return 'space-around';
  if (className.includes('justify-evenly')) return 'space-evenly';
  if (className.includes('justify-end')) return 'flex-end';
  if (className.includes('justify-start')) return 'flex-start';
  return '';
};

const extractTailwindAlign = (className: string): string => {
  if (className.includes('items-center')) return 'center';
  if (className.includes('items-start')) return 'flex-start';
  if (className.includes('items-end')) return 'flex-end';
  if (className.includes('items-stretch')) return 'stretch';
  if (className.includes('items-baseline')) return 'baseline';
  return '';
};

const extractTailwindGridCols = (className: string): string => {
  const match = className.match(/grid-cols-(\d+)/);
  if (match) return `repeat(${match[1]}, minmax(0, 1fr))`;
  return '';
};

const extractTailwindGap = (className: string): string => {
  const match = className.match(/gap-(\d+)/);
  if (match) return `${parseInt(match[1]) * 4}px`;
  return '';
};

const extractTailwindPadding = (className: string): string => {
  const match = className.match(/p-(\d+)/);
  if (match) return `${parseInt(match[1]) * 4}px`;
  const px = className.match(/px-(\d+)/);
  const py = className.match(/py-(\d+)/);
  if (px || py) {
    return `${py ? parseInt(py[1]) * 4 : 0}px ${px ? parseInt(px[1]) * 4 : 0}px`;
  }
  return '';
};

const extractTailwindMargin = (className: string): string => {
  const match = className.match(/m-(\d+)/);
  if (match) return `${parseInt(match[1]) * 4}px`;
  if (className.includes('mx-auto')) return '0 auto';
  return '';
};

const extractTailwindBg = (className: string): string => {
  if (className.includes('bg-white')) return '#ffffff';
  if (className.includes('bg-black')) return '#000000';
  if (className.includes('bg-gray-')) return '#6b7280';
  if (className.includes('bg-blue-')) return '#3b82f6';
  if (className.includes('bg-indigo-')) return '#6366f1';
  if (className.includes('bg-purple-')) return '#8b5cf6';
  if (className.includes('bg-gradient')) return 'linear-gradient(...)';
  return '';
};

const extractTailwindFontSize = (className: string): string => {
  if (className.includes('text-xs')) return '12px';
  if (className.includes('text-sm')) return '14px';
  if (className.includes('text-base')) return '16px';
  if (className.includes('text-lg')) return '18px';
  if (className.includes('text-xl')) return '20px';
  if (className.includes('text-2xl')) return '24px';
  if (className.includes('text-3xl')) return '30px';
  if (className.includes('text-4xl')) return '36px';
  if (className.includes('text-5xl')) return '48px';
  if (className.includes('text-6xl')) return '60px';
  return '';
};

const extractTailwindFontWeight = (className: string): string => {
  if (className.includes('font-thin')) return '100';
  if (className.includes('font-light')) return '300';
  if (className.includes('font-normal')) return '400';
  if (className.includes('font-medium')) return '500';
  if (className.includes('font-semibold')) return '600';
  if (className.includes('font-bold')) return '700';
  if (className.includes('font-extrabold')) return '800';
  return '';
};

const extractTailwindRounded = (className: string): string => {
  if (className.includes('rounded-full')) return '9999px';
  if (className.includes('rounded-3xl')) return '24px';
  if (className.includes('rounded-2xl')) return '16px';
  if (className.includes('rounded-xl')) return '12px';
  if (className.includes('rounded-lg')) return '8px';
  if (className.includes('rounded-md')) return '6px';
  if (className.includes('rounded-sm')) return '2px';
  if (className.includes('rounded')) return '4px';
  return '';
};

const extractTailwindShadow = (className: string): string => {
  if (className.includes('shadow-2xl')) return '0 25px 50px -12px rgba(0,0,0,0.25)';
  if (className.includes('shadow-xl')) return '0 20px 25px -5px rgba(0,0,0,0.1)';
  if (className.includes('shadow-lg')) return '0 10px 15px -3px rgba(0,0,0,0.1)';
  if (className.includes('shadow-md')) return '0 4px 6px -1px rgba(0,0,0,0.1)';
  if (className.includes('shadow-sm')) return '0 1px 2px 0 rgba(0,0,0,0.05)';
  if (className.includes('shadow')) return '0 1px 3px 0 rgba(0,0,0,0.1)';
  return '';
};

const extractTailwindWidth = (className: string): string => {
  if (className.includes('w-full')) return '100%';
  if (className.includes('w-screen')) return '100vw';
  if (className.includes('w-auto')) return 'auto';
  const match = className.match(/w-(\d+)/);
  if (match) return `${parseInt(match[1]) * 4}px`;
  return '';
};

const extractTailwindHeight = (className: string): string => {
  if (className.includes('h-full')) return '100%';
  if (className.includes('h-screen')) return '100vh';
  if (className.includes('h-auto')) return 'auto';
  const match = className.match(/h-(\d+)/);
  if (match) return `${parseInt(match[1]) * 4}px`;
  return '';
};

const extractTailwindMaxWidth = (className: string): string => {
  if (className.includes('max-w-7xl')) return '1280px';
  if (className.includes('max-w-6xl')) return '1152px';
  if (className.includes('max-w-5xl')) return '1024px';
  if (className.includes('max-w-4xl')) return '896px';
  if (className.includes('max-w-3xl')) return '768px';
  if (className.includes('max-w-2xl')) return '672px';
  if (className.includes('max-w-xl')) return '576px';
  if (className.includes('max-w-lg')) return '512px';
  if (className.includes('max-w-md')) return '448px';
  if (className.includes('max-w-sm')) return '384px';
  return '';
};

const parseLayoutInfo = (styles: ComputedStyleInfo, className: string): LayoutInfo => {
  const isFlexContainer = styles.display.includes('flex');
  const isGridContainer = styles.display.includes('grid');

  return {
    isFlexContainer,
    isGridContainer,
    isFlexItem: false, // Determined by parent
    isGridItem: false, // Determined by parent
    flexProperties: isFlexContainer ? {
      direction: styles.flexDirection || 'row',
      wrap: className.includes('flex-wrap') ? 'wrap' : 'nowrap',
      justify: styles.justifyContent || 'flex-start',
      align: styles.alignItems || 'stretch',
      gap: styles.gap || '0',
    } : undefined,
    gridProperties: isGridContainer ? {
      columns: styles.gridTemplateColumns || 'none',
      rows: styles.gridTemplateRows || 'none',
      gap: styles.gap || '0',
      areas: '',
    } : undefined,
  };
};

const estimateBoundingBox = (
  element: Element,
  _depth: number,
  siblingIndex: number,
  parentBox?: BoundingBox
): BoundingBox => {
  const tagName = element.tagName.toLowerCase();
  const className = element.className || '';
  
  // Base dimensions based on element type
  let width = parentBox ? parentBox.width - 40 : 1200;
  let height = 100;
  let x = parentBox ? parentBox.x + 20 : 0;
  let y = parentBox ? parentBox.y + parentBox.height + 10 : 0;

  // Adjust based on semantic elements
  if (tagName === 'header' || tagName === 'nav') {
    height = 80;
    width = parentBox?.width || 1200;
    x = parentBox?.x || 0;
  } else if (tagName === 'footer') {
    height = 200;
    width = parentBox?.width || 1200;
    x = parentBox?.x || 0;
  } else if (tagName === 'main') {
    height = 600;
    width = parentBox?.width || 1200;
  } else if (tagName === 'section') {
    height = 400;
  } else if (tagName === 'article') {
    height = 300;
  } else if (tagName === 'aside') {
    width = 300;
    height = 400;
  } else if (tagName === 'div') {
    // Check for container classes
    if (className.includes('container') || className.includes('max-w-')) {
      width = Math.min(1280, parentBox?.width || 1200);
    }
    if (className.includes('hero') || className.includes('banner')) {
      height = 500;
    }
    if (className.includes('card')) {
      width = 350;
      height = 280;
    }
    if (className.includes('grid')) {
      height = 400;
    }
  } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
    height = tagName === 'h1' ? 60 : tagName === 'h2' ? 48 : 36;
  } else if (tagName === 'p') {
    height = 60;
  } else if (tagName === 'button' || tagName === 'a') {
    height = 44;
    width = 150;
  } else if (tagName === 'img') {
    height = 200;
    width = 300;
  } else if (tagName === 'form') {
    height = 300;
  } else if (tagName === 'input' || tagName === 'textarea') {
    height = 44;
    width = parentBox ? parentBox.width - 40 : 400;
  } else if (tagName === 'ul' || tagName === 'ol') {
    height = 150;
  } else if (tagName === 'li') {
    height = 40;
    width = parentBox?.width || 200;
  }

  // Adjust position based on sibling index
  if (siblingIndex > 0 && parentBox) {
    y = parentBox.y + (siblingIndex * (height + 10));
  }

  return {
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
  };
};

const shouldIncludeElement = (tagName: string): boolean => {
  const excludeTags = ['script', 'style', 'link', 'meta', 'noscript', 'template', 'svg', 'path'];
  return !excludeTags.includes(tagName.toLowerCase());
};

const parseElement = (
  element: Element,
  depth: number = 0,
  path: string = '',
  siblingIndex: number = 0,
  parentBox?: BoundingBox
): DOMNode | null => {
  const tagName = element.tagName.toLowerCase();
  
  if (!shouldIncludeElement(tagName)) {
    return null;
  }

  const className = typeof element.className === 'string' ? element.className : '';
  const idAttr = element.id || '';
  
  // Get all attributes
  const attributes: Record<string, string> = {};
  for (const attr of Array.from(element.attributes)) {
    attributes[attr.name] = attr.value;
  }

  const computedStyles = parseComputedStyles(element);
  const boundingBox = estimateBoundingBox(element, depth, siblingIndex, parentBox);
  const layoutInfo = parseLayoutInfo(computedStyles, className);
  const displayType = getDisplayType(computedStyles.display);

  // Get direct text content (not from children)
  let textContent = '';
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || '';
      if (text) textContent += text + ' ';
    }
  }
  textContent = textContent.trim().substring(0, 100);

  const nodePath = path ? `${path} > ${tagName}` : tagName;

  // Parse children
  const children: DOMNode[] = [];
  let childIndex = 0;
  let currentY = boundingBox.y + 10;
  
  for (const child of Array.from(element.children)) {
    const childBox: BoundingBox = {
      ...boundingBox,
      y: currentY,
      height: 100,
    };
    
    const childNode = parseElement(child, depth + 1, nodePath, childIndex, childBox);
    if (childNode) {
      // Update child's flex/grid item status based on parent
      if (layoutInfo.isFlexContainer) {
        childNode.layoutInfo.isFlexItem = true;
      }
      if (layoutInfo.isGridContainer) {
        childNode.layoutInfo.isGridItem = true;
      }
      children.push(childNode);
      currentY += childNode.boundingBox.height + 10;
      childIndex++;
    }
  }

  // Recalculate height based on children
  if (children.length > 0) {
    const lastChild = children[children.length - 1];
    boundingBox.height = Math.max(
      boundingBox.height,
      (lastChild.boundingBox.y + lastChild.boundingBox.height) - boundingBox.y + 20
    );
    boundingBox.bottom = boundingBox.y + boundingBox.height;
  }

  return {
    id: generateNodeId(),
    tagName,
    className,
    id_attr: idAttr,
    attributes,
    computedStyles,
    boundingBox,
    children,
    textContent,
    depth,
    path: nodePath,
    isVisible: displayType !== 'none',
    displayType,
    layoutInfo,
  };
};

const analyzeLayoutPattern = (rootNode: DOMNode): LayoutSummary['layoutPattern'] => {
  const asideNodes = findNodesByTag(rootNode, 'aside');
  const hasGrid = findNodesWithClass(rootNode, 'grid').length > 0;
  
  if (asideNodes.length >= 2) return 'dual-sidebar';
  if (hasGrid) return 'grid-layout';
  if (asideNodes.length > 0) {
    return 'sidebar-right';
  }
  
  const mainChildren = findNodesByTag(rootNode, 'main');
  if (mainChildren.length > 0 && mainChildren[0].children.length > 3) {
    return 'complex';
  }
  
  return 'single-column';
};

const findNodesByTag = (node: DOMNode, tag: string): DOMNode[] => {
  const results: DOMNode[] = [];
  if (node.tagName === tag) results.push(node);
  for (const child of node.children) {
    results.push(...findNodesByTag(child, tag));
  }
  return results;
};

const findNodesWithClass = (node: DOMNode, className: string): DOMNode[] => {
  const results: DOMNode[] = [];
  if (node.className.includes(className)) results.push(node);
  for (const child of node.children) {
    results.push(...findNodesWithClass(child, className));
  }
  return results;
};

const countElements = (node: DOMNode): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  const count = (n: DOMNode) => {
    counts[n.tagName] = (counts[n.tagName] || 0) + 1;
    for (const child of n.children) {
      count(child);
    }
  };
  
  count(node);
  return counts;
};

const countTotalElements = (node: DOMNode): number => {
  let count = 1;
  for (const child of node.children) {
    count += countTotalElements(child);
  }
  return count;
};

const findMaxDepth = (node: DOMNode): number => {
  if (node.children.length === 0) return node.depth;
  return Math.max(...node.children.map(findMaxDepth));
};

const countContainers = (node: DOMNode, type: 'flex' | 'grid'): number => {
  let count = 0;
  if (type === 'flex' && node.layoutInfo.isFlexContainer) count++;
  if (type === 'grid' && node.layoutInfo.isGridContainer) count++;
  for (const child of node.children) {
    count += countContainers(child, type);
  }
  return count;
};

export const parseHTMLStructure = (html: string): PageStructure => {
  nodeIdCounter = 0;
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Extract meta information
  const doctype = '<!DOCTYPE html>';
  const htmlEl = doc.documentElement;
  const language = htmlEl.getAttribute('lang') || 'en';
  
  const charsetMeta = doc.querySelector('meta[charset]');
  const charset = charsetMeta?.getAttribute('charset') || 'UTF-8';
  
  const viewportMeta = doc.querySelector('meta[name="viewport"]');
  const viewport = viewportMeta?.getAttribute('content') || '';
  
  const titleEl = doc.querySelector('title');
  const title = titleEl?.textContent || 'Untitled';
  
  // Extract all meta tags
  const metaTags: MetaTag[] = [];
  doc.querySelectorAll('meta').forEach(meta => {
    const name = meta.getAttribute('name');
    const property = meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (content && (name || property)) {
      metaTags.push({ name: name || undefined, property: property || undefined, content });
    }
  });
  
  // Parse body structure
  const body = doc.body;
  const rootNode = parseElement(body, 0, '', 0) || {
    id: 'root',
    tagName: 'body',
    className: '',
    id_attr: '',
    attributes: {},
    computedStyles: {} as ComputedStyleInfo,
    boundingBox: { x: 0, y: 0, width: 1200, height: 800, top: 0, left: 0, right: 1200, bottom: 800 },
    children: [],
    textContent: '',
    depth: 0,
    path: 'body',
    isVisible: true,
    displayType: 'block' as const,
    layoutInfo: { isFlexContainer: false, isGridContainer: false, isFlexItem: false, isGridItem: false },
  };

  const elementCounts = countElements(rootNode);
  const totalElements = countTotalElements(rootNode);
  const maxDepth = findMaxDepth(rootNode);

  const layoutSummary: LayoutSummary = {
    hasHeader: findNodesByTag(rootNode, 'header').length > 0,
    hasNav: findNodesByTag(rootNode, 'nav').length > 0,
    hasMain: findNodesByTag(rootNode, 'main').length > 0,
    hasFooter: findNodesByTag(rootNode, 'footer').length > 0,
    hasAside: findNodesByTag(rootNode, 'aside').length > 0,
    hasSections: findNodesByTag(rootNode, 'section').length,
    hasArticles: findNodesByTag(rootNode, 'article').length,
    layoutPattern: analyzeLayoutPattern(rootNode),
    containerCount: findNodesWithClass(rootNode, 'container').length,
    flexContainers: countContainers(rootNode, 'flex'),
    gridContainers: countContainers(rootNode, 'grid'),
  };

  return {
    doctype,
    htmlVersion: 'HTML5',
    language,
    charset,
    viewport,
    title,
    metaTags,
    rootNode,
    totalElements,
    maxDepth,
    elementCounts,
    layoutSummary,
  };
};

export const flattenDOMTree = (node: DOMNode): DOMNode[] => {
  const nodes: DOMNode[] = [node];
  for (const child of node.children) {
    nodes.push(...flattenDOMTree(child));
  }
  return nodes;
};

export const findNodeById = (root: DOMNode, id: string): DOMNode | null => {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
};

export const getAncestors = (root: DOMNode, targetId: string): DOMNode[] => {
  const ancestors: DOMNode[] = [];
  
  const find = (node: DOMNode, path: DOMNode[]): boolean => {
    if (node.id === targetId) {
      ancestors.push(...path);
      return true;
    }
    for (const child of node.children) {
      if (find(child, [...path, node])) return true;
    }
    return false;
  };
  
  find(root, []);
  return ancestors;
};
