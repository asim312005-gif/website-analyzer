import { useState } from 'react';
import { PageRelationship } from '@/types/analysis';
import { Globe, ExternalLink, Hash, Link2, AlertTriangle, Home, ChevronRight } from 'lucide-react';

interface PageRelationshipMapProps {
  relationships: PageRelationship;
}

export function PageRelationshipMap({ relationships }: PageRelationshipMapProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const internalLinks = relationships.links.filter(l => l.type === 'internal');
  const externalLinks = relationships.links.filter(l => l.type === 'external');
  const anchorLinks = relationships.links.filter(l => l.type === 'anchor');

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'internal': return <Link2 className="w-4 h-4" />;
      case 'external': return <ExternalLink className="w-4 h-4" />;
      case 'anchor': return <Hash className="w-4 h-4" />;
      default: return <Link2 className="w-4 h-4" />;
    }
  };

  const getLinkColor = (type: string) => {
    switch (type) {
      case 'internal': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'external': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'anchor': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Link2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600">Internal Links</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{internalLinks.length}</div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <ExternalLink className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600">External Links</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{externalLinks.length}</div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Hash className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600">Anchor Links</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{anchorLinks.length}</div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-600">Orphan Pages</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">{relationships.orphanPages.length}</div>
        </div>
      </div>

      {/* Visual Site Map */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          Site Structure Map
        </h4>
        
        <div className="bg-slate-50 rounded-xl p-6 overflow-x-auto">
          {/* Root Node */}
          <div className="flex flex-col items-center">
            <div 
              className={`px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedNode === '/' 
                  ? 'bg-indigo-100 border-indigo-500 shadow-lg' 
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
              onClick={() => setSelectedNode(selectedNode === '/' ? null : '/')}
            >
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-slate-800">Home (/)</span>
              </div>
            </div>
            
            {/* Connection Line */}
            <div className="w-0.5 h-8 bg-slate-300"></div>
            
            {/* First Level Children */}
            <div className="flex gap-6 flex-wrap justify-center">
              {Object.entries(relationships.hierarchy).map(([parent, children]) => {
                if (parent !== '/') return null;
                return children.map((child, i) => (
                  <div key={child} className="flex flex-col items-center">
                    {/* Horizontal connection */}
                    {i > 0 && <div className="absolute h-0.5 bg-slate-300" style={{ width: '50px' }}></div>}
                    
                    <div 
                      className={`px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                        selectedNode === child 
                          ? 'bg-blue-100 border-blue-500 shadow-md' 
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedNode(selectedNode === child ? null : child)}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{child}</span>
                      </div>
                    </div>
                    
                    {/* Sub-children */}
                    {relationships.hierarchy[child] && (
                      <>
                        <div className="w-0.5 h-4 bg-slate-200"></div>
                        <div className="flex gap-2">
                          {relationships.hierarchy[child].map((subChild) => (
                            <div 
                              key={subChild}
                              className="px-2 py-1 rounded border bg-slate-50 border-slate-200 text-xs text-slate-600"
                            >
                              {subChild.split('/').pop()}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ));
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Internal Links */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-blue-500" />
            Internal Navigation
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {internalLinks.map((link, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${getLinkColor('internal')} border`}>
                {getLinkIcon('internal')}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.text || link.url}</p>
                  <p className="text-xs opacity-70 truncate">{link.url}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-white/50 rounded">
                  Depth: {link.depth}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* External Links */}
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-purple-500" />
            External Links
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {externalLinks.map((link, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${getLinkColor('external')} border`}>
                {getLinkIcon('external')}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.text || link.url}</p>
                  <p className="text-xs opacity-70 truncate">{link.url}</p>
                </div>
              </div>
            ))}
            {externalLinks.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No external links found</p>
            )}
          </div>
        </div>
      </div>

      {/* Anchor Links */}
      {anchorLinks.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-green-500" />
            Page Sections (Anchor Links)
          </h4>
          <div className="flex flex-wrap gap-2">
            {anchorLinks.map((link, i) => (
              <span key={i} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${getLinkColor('anchor')} border`}>
                {getLinkIcon('anchor')}
                <span className="text-sm font-medium">{link.text || link.url}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Orphan Pages Warning */}
      {relationships.orphanPages.length > 0 && (
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Orphan Pages Detected
          </h4>
          <p className="text-sm text-orange-700 mb-3">
            These pages have no incoming links and may be hard to discover:
          </p>
          <div className="flex flex-wrap gap-2">
            {relationships.orphanPages.map((page, i) => (
              <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm">
                {page}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
