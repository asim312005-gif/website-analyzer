import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DOMNode, PageStructure } from '../types/dom';
import { parseHTMLStructure, flattenDOMTree, getAncestors } from '../utils/domParser';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Grid,
  Box,
  Eye,
  ChevronRight,
  ChevronDown,
  Code,
  Layout,
  Copy,
  Check,
  Search,
  X,
  RotateCcw,
  Download,
  MousePointer,
  Square,
  Type,
  Image,
  Link2,
  List,
  FileText,
  Menu,
  Columns,
  Rows,
} from 'lucide-react';

interface Props {
  html: string;
}

// Color mapping for different element types
const getElementColor = (tagName: string, className: string): string => {
  // Semantic elements
  if (tagName === 'header') return '#3b82f6'; // Blue
  if (tagName === 'nav') return '#8b5cf6'; // Purple
  if (tagName === 'main') return '#10b981'; // Green
  if (tagName === 'footer') return '#f59e0b'; // Amber
  if (tagName === 'section') return '#06b6d4'; // Cyan
  if (tagName === 'article') return '#ec4899'; // Pink
  if (tagName === 'aside') return '#f97316'; // Orange
  
  // Common components by class
  if (className.includes('hero')) return '#7c3aed';
  if (className.includes('card')) return '#0891b2';
  if (className.includes('button') || className.includes('btn')) return '#dc2626';
  if (className.includes('nav')) return '#8b5cf6';
  if (className.includes('container')) return '#059669';
  if (className.includes('grid')) return '#2563eb';
  if (className.includes('flex')) return '#7c3aed';
  
  // Form elements
  if (['input', 'textarea', 'select', 'button', 'form'].includes(tagName)) return '#dc2626';
  
  // Typography
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) return '#7c3aed';
  if (tagName === 'p') return '#6b7280';
  if (tagName === 'a') return '#2563eb';
  if (tagName === 'span') return '#9ca3af';
  
  // Media
  if (['img', 'video', 'picture', 'figure'].includes(tagName)) return '#059669';
  
  // Lists
  if (['ul', 'ol', 'li'].includes(tagName)) return '#0891b2';
  
  // Default
  return '#6366f1';
};

const getElementIcon = (tagName: string): React.ReactNode => {
  if (tagName === 'header' || tagName === 'footer') return <Layout size={12} />;
  if (tagName === 'nav') return <Menu size={12} />;
  if (tagName === 'section' || tagName === 'article') return <FileText size={12} />;
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(tagName)) return <Type size={12} />;
  if (tagName === 'img' || tagName === 'picture') return <Image size={12} />;
  if (tagName === 'a') return <Link2 size={12} />;
  if (['ul', 'ol', 'li'].includes(tagName)) return <List size={12} />;
  if (tagName === 'button' || tagName === 'input') return <Square size={12} />;
  if (tagName === 'div') return <Box size={12} />;
  return <Code size={12} />;
};

// DOM Tree Node Component
const TreeNode: React.FC<{
  node: DOMNode;
  selectedId: string | null;
  hoveredId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  onToggle: (id: string) => void;
  depth: number;
}> = ({ node, selectedId, hoveredId, expandedIds, onSelect, onHover, onToggle, depth }) => {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const isHovered = hoveredId === node.id;
  const hasChildren = node.children.length > 0;
  const color = getElementColor(node.tagName, node.className);

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer rounded text-xs font-mono transition-colors ${
          isSelected ? 'bg-indigo-500/30 text-white' : isHovered ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="hover:bg-white/20 rounded p-0.5"
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        
        <span style={{ color }} className="flex items-center gap-1">
          {getElementIcon(node.tagName)}
          <span>&lt;{node.tagName}</span>
        </span>
        
        {node.id_attr && (
          <span className="text-yellow-400">#{node.id_attr}</span>
        )}
        
        {node.className && (
          <span className="text-green-400 truncate max-w-[120px]">
            .{node.className.split(' ')[0]}
          </span>
        )}
        
        <span style={{ color }}>&gt;</span>
        
        {node.textContent && (
          <span className="text-gray-500 truncate max-w-[80px] ml-1">
            "{node.textContent.substring(0, 20)}..."
          </span>
        )}
      </div>
      
      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              hoveredId={hoveredId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onHover={onHover}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Visual Element Box Component
const ElementBox: React.FC<{
  node: DOMNode;
  scale: number;
  offset: { x: number; y: number };
  isSelected: boolean;
  isHovered: boolean;
  showLabels: boolean;
  showGrid: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  visibleDepth: number;
}> = ({ node, scale, offset, isSelected, isHovered, showLabels, showGrid, onSelect, onHover, visibleDepth }) => {
  if (node.depth > visibleDepth) return null;
  
  const color = getElementColor(node.tagName, node.className);
  const box = node.boundingBox;
  
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${box.x * scale + offset.x}px`,
    top: `${box.y * scale + offset.y}px`,
    width: `${box.width * scale}px`,
    height: `${box.height * scale}px`,
    border: `${isSelected ? 3 : isHovered ? 2 : 1}px solid ${color}`,
    backgroundColor: isSelected ? `${color}20` : isHovered ? `${color}10` : 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    zIndex: isSelected ? 100 : isHovered ? 50 : node.depth,
  };

  const labelVisible = showLabels && (isSelected || isHovered || node.depth <= 2);

  return (
    <>
      <div
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Element Label */}
        {labelVisible && (
          <div
            className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-medium text-white whitespace-nowrap flex items-center gap-1"
            style={{ backgroundColor: color }}
          >
            {getElementIcon(node.tagName)}
            <span>{node.tagName}</span>
            {node.id_attr && <span className="opacity-75">#{node.id_attr}</span>}
            {node.className && <span className="opacity-75">.{node.className.split(' ')[0]}</span>}
          </div>
        )}

        {/* Dimensions */}
        {(isSelected || isHovered) && (
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-gray-900 rounded text-[9px] text-gray-300 whitespace-nowrap">
            {Math.round(box.width)} × {Math.round(box.height)}
          </div>
        )}

        {/* Grid Overlay for Grid Containers */}
        {showGrid && node.layoutInfo.isGridContainer && node.layoutInfo.gridProperties && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border border-dashed border-blue-400/50 grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="border border-dashed border-blue-400/30 rounded" />
              ))}
            </div>
          </div>
        )}

        {/* Flex Overlay for Flex Containers */}
        {showGrid && node.layoutInfo.isFlexContainer && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-purple-400/50">
              {node.layoutInfo.flexProperties?.direction === 'column' ? (
                <Rows size={20} />
              ) : (
                <Columns size={20} />
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Render children */}
      {node.children.map((child) => (
        <ElementBox
          key={child.id}
          node={child}
          scale={scale}
          offset={offset}
          isSelected={false}
          isHovered={false}
          showLabels={showLabels}
          showGrid={showGrid}
          onSelect={onSelect}
          onHover={onHover}
          visibleDepth={visibleDepth}
        />
      ))}
    </>
  );
};

// Properties Panel Component
const PropertiesPanel: React.FC<{
  node: DOMNode;
  ancestors: DOMNode[];
  onCopy: (text: string) => void;
  copied: string | null;
}> = ({ node, ancestors, onCopy, copied }) => {
  const [activeTab, setActiveTab] = useState<'styles' | 'layout' | 'code'>('styles');
  const color = getElementColor(node.tagName, node.className);

  const generateElementCode = (): string => {
    const attrs = Object.entries(node.attributes)
      .filter(([key]) => key !== 'class' && key !== 'style')
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    
    const classAttr = node.className ? ` class="${node.className}"` : '';
    const otherAttrs = attrs ? ` ${attrs}` : '';
    
    return `<${node.tagName}${classAttr}${otherAttrs}>${node.textContent ? `\n  ${node.textContent}\n` : ''}</${node.tagName}>`;
  };

  const generateCSSCode = (): string => {
    const styles = node.computedStyles;
    const lines: string[] = [];
    
    if (styles.display && styles.display !== 'block') lines.push(`display: ${styles.display};`);
    if (styles.position && styles.position !== 'static') lines.push(`position: ${styles.position};`);
    if (styles.width) lines.push(`width: ${styles.width};`);
    if (styles.height) lines.push(`height: ${styles.height};`);
    if (styles.padding) lines.push(`padding: ${styles.padding};`);
    if (styles.margin) lines.push(`margin: ${styles.margin};`);
    if (styles.backgroundColor) lines.push(`background-color: ${styles.backgroundColor};`);
    if (styles.color) lines.push(`color: ${styles.color};`);
    if (styles.fontSize) lines.push(`font-size: ${styles.fontSize};`);
    if (styles.fontWeight) lines.push(`font-weight: ${styles.fontWeight};`);
    if (styles.borderRadius) lines.push(`border-radius: ${styles.borderRadius};`);
    if (styles.boxShadow) lines.push(`box-shadow: ${styles.boxShadow};`);
    if (styles.gap) lines.push(`gap: ${styles.gap};`);
    if (styles.flexDirection) lines.push(`flex-direction: ${styles.flexDirection};`);
    if (styles.justifyContent) lines.push(`justify-content: ${styles.justifyContent};`);
    if (styles.alignItems) lines.push(`align-items: ${styles.alignItems};`);
    
    const selector = node.id_attr ? `#${node.id_attr}` : node.className ? `.${node.className.split(' ')[0]}` : node.tagName;
    return `${selector} {\n  ${lines.join('\n  ')}\n}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Element Header */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-sm" style={{ color }}>
            &lt;{node.tagName}&gt;
          </span>
        </div>
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-gray-400 overflow-x-auto">
          {ancestors.map((a) => (
            <React.Fragment key={a.id}>
              <span className="hover:text-white cursor-pointer">{a.tagName}</span>
              <ChevronRight size={10} />
            </React.Fragment>
          ))}
          <span className="text-white font-medium">{node.tagName}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(['styles', 'layout', 'code'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'styles' && (
          <div className="space-y-3">
            {/* Box Model */}
            <div>
              <h4 className="text-xs font-medium text-gray-400 mb-2">Box Model</h4>
              <div className="bg-orange-500/20 border-2 border-orange-500/50 rounded p-2 text-center text-[10px]">
                <div className="text-orange-400 mb-1">margin: {node.computedStyles.margin || '0'}</div>
                <div className="bg-green-500/20 border-2 border-green-500/50 rounded p-2">
                  <div className="text-green-400 mb-1">padding: {node.computedStyles.padding || '0'}</div>
                  <div className="bg-blue-500/20 border-2 border-blue-500/50 rounded p-2">
                    <div className="text-blue-400">
                      {Math.round(node.boundingBox.width)} × {Math.round(node.boundingBox.height)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Styles */}
            <div>
              <h4 className="text-xs font-medium text-gray-400 mb-2">Computed Styles</h4>
              <div className="space-y-1">
                {Object.entries(node.computedStyles)
                  .filter(([, value]) => value && value !== 'static' && value !== '1')
                  .slice(0, 12)
                  .map(([key, value]) => (
                    <div 
                      key={key}
                      className="flex justify-between items-center text-xs bg-white/5 rounded px-2 py-1 group cursor-pointer hover:bg-white/10"
                      onClick={() => onCopy(`${key}: ${value}`)}
                    >
                      <span className="text-purple-400">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 font-mono text-[10px]">{value}</span>
                        {copied === `${key}: ${value}` ? (
                          <Check size={10} className="text-green-400" />
                        ) : (
                          <Copy size={10} className="opacity-0 group-hover:opacity-100 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-3">
            {/* Display Type */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">Display</span>
                <span className="text-xs font-mono text-indigo-400">{node.computedStyles.display}</span>
              </div>
              
              {node.layoutInfo.isFlexContainer && (
                <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs font-medium text-purple-400 flex items-center gap-2">
                    <Columns size={14} />
                    Flexbox Container
                  </div>
                  {node.layoutInfo.flexProperties && (
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-purple-500/10 rounded px-2 py-1">
                        <span className="text-gray-400">direction:</span>
                        <span className="text-purple-300 ml-1">{node.layoutInfo.flexProperties.direction}</span>
                      </div>
                      <div className="bg-purple-500/10 rounded px-2 py-1">
                        <span className="text-gray-400">justify:</span>
                        <span className="text-purple-300 ml-1">{node.layoutInfo.flexProperties.justify}</span>
                      </div>
                      <div className="bg-purple-500/10 rounded px-2 py-1">
                        <span className="text-gray-400">align:</span>
                        <span className="text-purple-300 ml-1">{node.layoutInfo.flexProperties.align}</span>
                      </div>
                      <div className="bg-purple-500/10 rounded px-2 py-1">
                        <span className="text-gray-400">gap:</span>
                        <span className="text-purple-300 ml-1">{node.layoutInfo.flexProperties.gap}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {node.layoutInfo.isGridContainer && (
                <div className="space-y-2 mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs font-medium text-blue-400 flex items-center gap-2">
                    <Grid size={14} />
                    Grid Container
                  </div>
                  {node.layoutInfo.gridProperties && (
                    <div className="space-y-1 text-[10px]">
                      <div className="bg-blue-500/10 rounded px-2 py-1">
                        <span className="text-gray-400">columns:</span>
                        <span className="text-blue-300 ml-1">{node.layoutInfo.gridProperties.columns}</span>
                      </div>
                      <div className="bg-blue-500/10 rounded px-2 py-1">
                        <span className="text-gray-400">gap:</span>
                        <span className="text-blue-300 ml-1">{node.layoutInfo.gridProperties.gap}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Position */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">Position</span>
                <span className="text-xs font-mono text-indigo-400">{node.computedStyles.position}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-gray-500/10 rounded px-2 py-1">
                  <span className="text-gray-400">x:</span>
                  <span className="text-gray-300 ml-1">{Math.round(node.boundingBox.x)}px</span>
                </div>
                <div className="bg-gray-500/10 rounded px-2 py-1">
                  <span className="text-gray-400">y:</span>
                  <span className="text-gray-300 ml-1">{Math.round(node.boundingBox.y)}px</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-3">
            {/* HTML */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-400">HTML</h4>
                <button
                  onClick={() => onCopy(generateElementCode())}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  {copied === generateElementCode() ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <pre className="bg-gray-900 rounded-lg p-3 text-[10px] font-mono overflow-x-auto text-green-400">
                {generateElementCode()}
              </pre>
            </div>

            {/* CSS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-gray-400">CSS</h4>
                <button
                  onClick={() => onCopy(generateCSSCode())}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                >
                  {copied === generateCSSCode() ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
              <pre className="bg-gray-900 rounded-lg p-3 text-[10px] font-mono overflow-x-auto text-blue-400">
                {generateCSSCode()}
              </pre>
            </div>

            {/* Tailwind Suggestion */}
            {node.className.includes('flex') || node.className.includes('grid') ? (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                <h4 className="text-xs font-medium text-cyan-400 mb-2">Tailwind Classes Detected</h4>
                <div className="flex flex-wrap gap-1">
                  {node.className.split(' ').filter(c => c).map((cls, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 bg-cyan-500/20 rounded text-[10px] text-cyan-300 font-mono cursor-pointer hover:bg-cyan-500/30"
                      onClick={() => onCopy(cls)}
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Enhanced Visual Inspector Component
const EnhancedVisualInspector: React.FC<Props> = ({ html }) => {
  const [structure, setStructure] = useState<PageStructure | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [scale, setScale] = useState(0.5);
  const [offset, setOffset] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showTree, setShowTree] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleDepth, setVisibleDepth] = useState(6);
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'visual' | 'tree' | 'split'>('split');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse HTML on mount or change
  useEffect(() => {
    if (html) {
      const parsed = parseHTMLStructure(html);
      setStructure(parsed);
      
      // Auto-expand first two levels
      const allNodes = flattenDOMTree(parsed.rootNode);
      const initialExpanded = new Set(
        allNodes.filter(n => n.depth <= 2).map(n => n.id)
      );
      setExpandedIds(initialExpanded);
    }
  }, [html]);

  // Get selected node and ancestors
  const selectedNode = structure && selectedId 
    ? flattenDOMTree(structure.rootNode).find(n => n.id === selectedId)
    : null;
  const ancestors = structure && selectedId
    ? getAncestors(structure.rootNode, selectedId)
    : [];

  // Handlers
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  }, [offset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoom = useCallback((delta: number) => {
    setScale(prev => Math.max(0.1, Math.min(2, prev + delta)));
  }, []);

  const handleReset = useCallback(() => {
    setScale(0.5);
    setOffset({ x: 50, y: 50 });
  }, []);

  const handleExport = useCallback(() => {
    if (!structure) return;
    
    const exportData = {
      url: 'analyzed-page',
      structure: {
        totalElements: structure.totalElements,
        maxDepth: structure.maxDepth,
        layoutPattern: structure.layoutSummary.layoutPattern,
        elements: structure.elementCounts,
      },
      layoutSummary: structure.layoutSummary,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [structure]);

  // Filter nodes by search
  const filteredNodes = structure && searchQuery
    ? flattenDOMTree(structure.rootNode).filter(n => 
        n.tagName.includes(searchQuery.toLowerCase()) ||
        n.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.id_attr.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  if (!structure) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <div className="text-center">
          <Layers size={48} className="mx-auto mb-4 opacity-50" />
          <p>No HTML structure to analyze</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`bg-gray-900 rounded-xl overflow-hidden border border-white/10 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers size={16} className="text-indigo-400" />
            Visual Layout Inspector
          </h3>
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-700/50 rounded-lg p-0.5 ml-4">
            {(['visual', 'tree', 'split'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 pl-8 pr-3 py-1.5 bg-gray-700/50 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Depth Slider */}
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs text-gray-400">Depth:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={visibleDepth}
              onChange={(e) => setVisibleDepth(parseInt(e.target.value))}
              className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-white w-4">{visibleDepth}</span>
          </div>

          {/* Toggle Buttons */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-1.5 rounded-lg transition-colors ${showLabels ? 'bg-indigo-500/30 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
            title="Toggle Labels"
          >
            <Type size={14} />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg transition-colors ${showGrid ? 'bg-indigo-500/30 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
            title="Toggle Grid Overlay"
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setShowTree(!showTree)}
            className={`p-1.5 rounded-lg transition-colors ${showTree ? 'bg-indigo-500/30 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
            title="Toggle DOM Tree"
          >
            <Layers size={14} />
          </button>
          <button
            onClick={() => setShowProperties(!showProperties)}
            className={`p-1.5 rounded-lg transition-colors ${showProperties ? 'bg-indigo-500/30 text-indigo-400' : 'text-gray-400 hover:text-white'}`}
            title="Toggle Properties"
          >
            <Box size={14} />
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Zoom Controls */}
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-gray-400 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => handleZoom(0.1)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Reset View"
          >
            <RotateCcw size={14} />
          </button>

          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Export & Fullscreen */}
          <button
            onClick={handleExport}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title="Export Analysis"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Layout Summary Bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-800/30 border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Elements:</span>
          <span className="text-white font-medium">{structure.totalElements}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Max Depth:</span>
          <span className="text-white font-medium">{structure.maxDepth}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Layout:</span>
          <span className="text-indigo-400 font-medium capitalize">{structure.layoutSummary.layoutPattern.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Flex:</span>
          <span className="text-purple-400 font-medium">{structure.layoutSummary.flexContainers}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Grid:</span>
          <span className="text-blue-400 font-medium">{structure.layoutSummary.gridContainers}</span>
        </div>
        {structure.layoutSummary.hasHeader && <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">Header</span>}
        {structure.layoutSummary.hasNav && <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded">Nav</span>}
        {structure.layoutSummary.hasMain && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Main</span>}
        {structure.layoutSummary.hasFooter && <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Footer</span>}
      </div>

      {/* Main Content */}
      <div className="flex" style={{ height: isFullscreen ? 'calc(100vh - 88px)' : '600px' }}>
        {/* DOM Tree Panel */}
        {(viewMode === 'tree' || viewMode === 'split') && showTree && (
          <div className={`${viewMode === 'split' ? 'w-72' : 'flex-1'} bg-gray-900/50 border-r border-white/10 flex flex-col`}>
            <div className="p-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">DOM Tree</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const allNodes = flattenDOMTree(structure.rootNode);
                    setExpandedIds(new Set(allNodes.map(n => n.id)));
                  }}
                  className="text-xs text-gray-400 hover:text-white px-2 py-0.5"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setExpandedIds(new Set())}
                  className="text-xs text-gray-400 hover:text-white px-2 py-0.5"
                >
                  Collapse
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {filteredNodes ? (
                <div className="space-y-1 px-2">
                  <div className="text-xs text-gray-400 mb-2 px-2">
                    Found {filteredNodes.length} elements
                  </div>
                  {filteredNodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedId(node.id)}
                      className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-xs ${
                        selectedId === node.id ? 'bg-indigo-500/30' : 'hover:bg-white/5'
                      }`}
                    >
                      <span style={{ color: getElementColor(node.tagName, node.className) }}>
                        {node.tagName}
                      </span>
                      {node.className && (
                        <span className="text-green-400 truncate">.{node.className.split(' ')[0]}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <TreeNode
                  node={structure.rootNode}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  expandedIds={expandedIds}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                  onToggle={handleToggle}
                  depth={0}
                />
              )}
            </div>
          </div>
        )}

        {/* Visual Canvas */}
        {(viewMode === 'visual' || viewMode === 'split') && (
          <div 
            ref={canvasRef}
            className="flex-1 overflow-hidden relative bg-gray-950"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Canvas Background Grid */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                `,
                backgroundSize: `${20 * scale}px ${20 * scale}px`,
                backgroundPosition: `${offset.x}px ${offset.y}px`,
              }}
            />

            {/* Element Boxes */}
            <ElementBox
              node={structure.rootNode}
              scale={scale}
              offset={offset}
              isSelected={selectedId === structure.rootNode.id}
              isHovered={hoveredId === structure.rootNode.id}
              showLabels={showLabels}
              showGrid={showGrid}
              onSelect={setSelectedId}
              onHover={setHoveredId}
              visibleDepth={visibleDepth}
            />

            {/* Pointer indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-gray-400 bg-gray-800/80 rounded-lg px-3 py-2">
              <MousePointer size={14} />
              <span>Drag to pan • Click to select</span>
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-gray-800/80 rounded-lg px-3 py-2">
              {Math.round(scale * 100)}%
            </div>

            {/* Element Legend */}
            <div className="absolute top-4 left-4 bg-gray-800/90 rounded-lg p-3 text-xs">
              <div className="text-gray-400 mb-2 font-medium">Element Types</div>
              <div className="space-y-1">
                {[
                  { tag: 'header', color: '#3b82f6' },
                  { tag: 'nav', color: '#8b5cf6' },
                  { tag: 'main', color: '#10b981' },
                  { tag: 'section', color: '#06b6d4' },
                  { tag: 'footer', color: '#f59e0b' },
                  { tag: 'div', color: '#6366f1' },
                ].map(({ tag, color }) => (
                  <div key={tag} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                    <span className="text-gray-300">&lt;{tag}&gt;</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Properties Panel */}
        {showProperties && selectedNode && (
          <div className="w-80 bg-gray-900/50 border-l border-white/10">
            <PropertiesPanel
              node={selectedNode}
              ancestors={ancestors}
              onCopy={handleCopy}
              copied={copied}
            />
          </div>
        )}

        {/* No Selection Message */}
        {showProperties && !selectedNode && (
          <div className="w-80 bg-gray-900/50 border-l border-white/10 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Eye size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select an element</p>
              <p className="text-xs mt-1">Click on any element to inspect</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedVisualInspector;
