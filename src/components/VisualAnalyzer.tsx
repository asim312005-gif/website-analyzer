import { useState } from 'react';
import { VisualOverlay, ComponentInfo } from '@/types/analysis';
import { Eye, EyeOff, Layers, Grid3X3, Navigation, Box, LayoutGrid, Info, ChevronRight, Maximize2 } from 'lucide-react';

interface VisualAnalyzerProps {
  overlays: VisualOverlay[];
  components: ComponentInfo[];
  screenshotUrl?: string;
}

const overlayColors: Record<string, { bg: string; border: string; text: string }> = {
  navigation: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-700' },
  header: { bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-700' },
  hero: { bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-700' },
  section: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-700' },
  grid: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-700' },
  component: { bg: 'bg-cyan-500/20', border: 'border-cyan-500', text: 'text-cyan-700' },
  footer: { bg: 'bg-slate-500/20', border: 'border-slate-500', text: 'text-slate-700' },
};

const typeIcons: Record<string, React.ReactNode> = {
  navigation: <Navigation className="w-3 h-3" />,
  header: <Layers className="w-3 h-3" />,
  hero: <Layers className="w-3 h-3" />,
  section: <LayoutGrid className="w-3 h-3" />,
  grid: <Grid3X3 className="w-3 h-3" />,
  component: <Box className="w-3 h-3" />,
  footer: <Layers className="w-3 h-3" />,
};

export function VisualAnalyzer({ overlays, components, screenshotUrl }: VisualAnalyzerProps) {
  const [showOverlays, setShowOverlays] = useState(true);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [hoveredOverlay, setHoveredOverlay] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeOverlay = overlays.find(o => o.id === (hoveredOverlay || selectedOverlay));
  const relatedComponent = activeOverlay ? components.find(c => 
    c.name.toLowerCase().includes(activeOverlay.label.toLowerCase().split(' ')[0])
  ) : null;

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Visual Layout Inspector</h3>
            <p className="text-xs text-slate-500">Interactive overlay showing page structure</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showOverlays 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {showOverlays ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showOverlays ? 'Overlays On' : 'Overlays Off'}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Visual Preview */}
        <div className="flex-1 relative bg-slate-100 min-h-[500px]">
          {/* Screenshot Background */}
          {screenshotUrl && (
            <img 
              src={screenshotUrl} 
              alt="Website screenshot"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-30"
            />
          )}
          
          {/* Overlays Container */}
          <div className="absolute inset-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden">
            {/* Mock Website Layout */}
            <div className="relative w-full h-full">
              {showOverlays && overlays.map((overlay) => {
                const colors = overlayColors[overlay.type] || overlayColors.component;
                const isActive = hoveredOverlay === overlay.id || selectedOverlay === overlay.id;
                
                return (
                  <div
                    key={overlay.id}
                    className={`absolute border-2 rounded-lg transition-all cursor-pointer ${colors.bg} ${colors.border} ${
                      isActive ? 'ring-4 ring-offset-2 z-20' : 'hover:z-10'
                    }`}
                    style={{
                      left: `${overlay.bounds.x}%`,
                      top: `${overlay.bounds.y}%`,
                      width: `${overlay.bounds.width}%`,
                      height: `${overlay.bounds.height}%`,
                    }}
                    onMouseEnter={() => setHoveredOverlay(overlay.id)}
                    onMouseLeave={() => setHoveredOverlay(null)}
                    onClick={() => setSelectedOverlay(overlay.id === selectedOverlay ? null : overlay.id)}
                  >
                    {/* Label */}
                    <div className={`absolute -top-6 left-2 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colors.text} bg-white shadow-sm border ${colors.border}`}>
                      {typeIcons[overlay.type]}
                      {overlay.label}
                    </div>
                    
                    {/* Details on hover */}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-[200px]">
                          <p className={`font-semibold text-sm ${colors.text} mb-1`}>{overlay.label}</p>
                          <ul className="text-xs text-slate-600 space-y-0.5">
                            {overlay.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <ChevronRight className="w-3 h-3 text-slate-400" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">Layout Elements</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(overlayColors).slice(0, 5).map(([type, colors]) => (
                <div key={type} className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {typeIcons[type]}
                  <span className="capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="w-80 border-l border-slate-100 bg-slate-50 p-4 overflow-y-auto max-h-[500px]">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            Component Details
          </h4>
          
          {activeOverlay ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium mb-2 ${overlayColors[activeOverlay.type]?.bg} ${overlayColors[activeOverlay.type]?.text} border ${overlayColors[activeOverlay.type]?.border}`}>
                  {typeIcons[activeOverlay.type]}
                  {activeOverlay.type}
                </div>
                <h5 className="font-semibold text-slate-800">{activeOverlay.label}</h5>
                <ul className="mt-2 space-y-1">
                  {activeOverlay.details.map((detail, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              
              {relatedComponent && (
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs font-medium text-indigo-600 mb-2">Related Component</p>
                  <p className="font-semibold text-slate-800 text-sm">{relatedComponent.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">{relatedComponent.selector}</p>
                  {relatedComponent.framework && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {relatedComponent.framework}
                    </span>
                  )}
                  {relatedComponent.reusabilityScore && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Reusability Score</span>
                        <span className="font-semibold text-slate-700">{relatedComponent.reusabilityScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                          style={{ width: `${relatedComponent.reusabilityScore}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Layers className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">
                Hover over or click an overlay to see details
              </p>
            </div>
          )}

          {/* All Overlays List */}
          <div className="mt-6">
            <h4 className="font-semibold text-slate-800 mb-3 text-sm">All Sections</h4>
            <div className="space-y-2">
              {overlays.map((overlay) => {
                const colors = overlayColors[overlay.type] || overlayColors.component;
                return (
                  <button
                    key={overlay.id}
                    onClick={() => setSelectedOverlay(overlay.id === selectedOverlay ? null : overlay.id)}
                    className={`w-full text-left p-2 rounded-lg border transition-all ${
                      selectedOverlay === overlay.id 
                        ? `${colors.bg} ${colors.border}` 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={colors.text}>{typeIcons[overlay.type]}</span>
                      <span className="text-sm font-medium text-slate-700">{overlay.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
