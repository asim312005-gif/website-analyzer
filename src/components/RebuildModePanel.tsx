import { useState } from 'react';
import { RebuildSuggestion } from '@/types/analysis';
import { Code, Layout, Gauge, Shield, Search, ChevronDown, ChevronUp, Copy, Check, Sparkles, FileJson } from 'lucide-react';

interface RebuildModePanelProps {
  suggestions: RebuildSuggestion[];
}

const categoryConfig: Record<RebuildSuggestion['category'], { icon: React.ReactNode; color: string; bg: string }> = {
  component: { icon: <Code className="w-4 h-4" />, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  layout: { icon: <Layout className="w-4 h-4" />, color: 'text-purple-600', bg: 'bg-purple-100' },
  performance: { icon: <Gauge className="w-4 h-4" />, color: 'text-orange-600', bg: 'bg-orange-100' },
  accessibility: { icon: <Shield className="w-4 h-4" />, color: 'text-green-600', bg: 'bg-green-100' },
  seo: { icon: <Search className="w-4 h-4" />, color: 'text-cyan-600', bg: 'bg-cyan-100' },
};

const priorityConfig: Record<RebuildSuggestion['priority'], { color: string; label: string }> = {
  high: { color: 'bg-red-100 text-red-700 border-red-200', label: '🔴 High Priority' },
  medium: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: '🟡 Medium' },
  low: { color: 'bg-green-100 text-green-700 border-green-200', label: '🟢 Low' },
};

export function RebuildModePanel({ suggestions }: RebuildModePanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | RebuildSuggestion['category']>('all');

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportSuggestions = () => {
    const json = JSON.stringify(suggestions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rebuild-suggestions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSuggestions = categoryFilter === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === categoryFilter);

  const highPriority = suggestions.filter(s => s.priority === 'high').length;
  const mediumPriority = suggestions.filter(s => s.priority === 'medium').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-xl font-bold">Rebuild This Page Mode</h3>
            </div>
            <p className="text-white/80">
              AI-generated suggestions to improve and rebuild this page with modern best practices
            </p>
          </div>
          <button
            onClick={exportSuggestions}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <FileJson className="w-4 h-4" />
            Export Suggestions
          </button>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold">{suggestions.length}</div>
            <div className="text-xs text-white/70">Total Suggestions</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold">{highPriority}</div>
            <div className="text-xs text-white/70">High Priority</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold">{mediumPriority}</div>
            <div className="text-xs text-white/70">Medium Priority</div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            categoryFilter === 'all' 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({suggestions.length})
        </button>
        {(['component', 'layout', 'performance', 'accessibility', 'seo'] as const).map((cat) => {
          const config = categoryConfig[cat];
          const count = suggestions.filter(s => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                categoryFilter === cat 
                  ? `${config.bg} ${config.color}` 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {config.icon}
              <span className="capitalize">{cat}</span>
              <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.map((suggestion, i) => {
          const cat = categoryConfig[suggestion.category];
          const priority = priorityConfig[suggestion.priority];
          const isExpanded = expandedIndex === i;
          
          return (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              <div 
                className="p-5 cursor-pointer flex items-start gap-4"
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
              >
                <div className={`p-3 rounded-xl ${cat.bg} ${cat.color}`}>
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded border ${priority.color}`}>
                      {priority.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${cat.bg} ${cat.color} capitalize`}>
                      {suggestion.category}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-1">{suggestion.title}</h4>
                  <p className="text-sm text-slate-600">{suggestion.description}</p>
                </div>
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
              
              {isExpanded && suggestion.code && (
                <div className="border-t border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-slate-700 flex items-center gap-2">
                      <Code className="w-4 h-4 text-indigo-500" />
                      Suggested Implementation
                    </h5>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyCode(suggestion.code!, i); }}
                      className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
                    >
                      {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedIndex === i ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-green-300 p-4 rounded-xl overflow-x-auto text-sm font-mono">
                    <code>{suggestion.code}</code>
                  </pre>
                  
                  {/* Implementation Steps */}
                  <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <h6 className="font-medium text-indigo-800 mb-2">📋 Implementation Steps:</h6>
                    <ol className="text-sm text-indigo-700 space-y-1 list-decimal list-inside">
                      <li>Review the suggested code above</li>
                      <li>Copy and adapt to your project structure</li>
                      <li>Test thoroughly before deploying</li>
                      <li>Monitor for any regressions</li>
                    </ol>
                  </div>
                </div>
              )}
              
              {isExpanded && suggestion.wireframe && (
                <div className="border-t border-slate-100 bg-slate-50 p-5">
                  <h5 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-purple-500" />
                    Wireframe Suggestion
                  </h5>
                  <pre className="bg-white border border-slate-200 p-4 rounded-xl text-sm font-mono text-slate-600">
                    {suggestion.wireframe}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ethical Notice */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold mb-2">🔒 Ethical Analysis Notice</h4>
            <p className="text-slate-300 text-sm mb-3">
              This tool performs <strong>analysis only</strong> — it does not extract or copy proprietary code. 
              All suggestions are generated based on detected patterns and best practices, not actual source code.
            </p>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• We analyze public HTML/CSS structure only</li>
              <li>• No server-side code, APIs, or databases are accessed</li>
              <li>• Suggestions are educational and for learning purposes</li>
              <li>• Always respect intellectual property and copyrights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
