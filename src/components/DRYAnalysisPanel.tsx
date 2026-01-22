import { useState } from 'react';
import { DRYAnalysis } from '@/types/analysis';
import { Copy, Check, Code, Layers, Repeat, TrendingUp, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

interface DRYAnalysisPanelProps {
  analysis: DRYAnalysis;
}

export function DRYAnalysisPanel({ analysis }: DRYAnalysisPanelProps) {
  const [expandedComponent, setExpandedComponent] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', desc: 'Code is well-organized and reusable' };
    if (score >= 60) return { label: 'Good', desc: 'Some opportunities for improvement' };
    if (score >= 40) return { label: 'Fair', desc: 'Consider extracting common patterns' };
    return { label: 'Needs Work', desc: 'Significant duplication detected' };
  };

  const scoreInfo = getScoreLabel(analysis.score);

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        <div className={`bg-gradient-to-r ${getScoreColor(analysis.score)} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Repeat className="w-6 h-6" />
                <h3 className="text-lg font-semibold">DRY Score Analysis</h3>
              </div>
              <p className="text-white/80 text-sm">Don't Repeat Yourself - Component Reusability Assessment</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{analysis.score}%</div>
              <div className="text-white/80 text-sm">{scoreInfo.label}</div>
            </div>
          </div>
          <p className="mt-4 text-white/90 text-sm">{scoreInfo.desc}</p>
        </div>

        {/* Score Breakdown */}
        <div className="p-4 grid grid-cols-3 gap-4 bg-slate-50 border-t border-slate-100">
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">{analysis.duplicatedPatterns.length}</div>
            <div className="text-xs text-slate-500">Duplicated Patterns</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">{analysis.reusableComponents.length}</div>
            <div className="text-xs text-slate-500">Extractable Components</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
            <div className="text-2xl font-bold text-slate-800">
              {analysis.reusableComponents.reduce((sum, c) => sum + c.instances, 0)}
            </div>
            <div className="text-xs text-slate-500">Total Instances</div>
          </div>
        </div>
      </div>

      {/* Duplicated Patterns */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Repeat className="w-5 h-5 text-orange-500" />
          Duplicated Patterns Detected
        </h4>
        <div className="space-y-3">
          {analysis.duplicatedPatterns.map((pattern, i) => (
            <div key={i} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-orange-200 text-orange-800 rounded text-xs font-medium">
                      {pattern.count}x repeated
                    </span>
                  </div>
                  <p className="text-sm font-mono text-orange-800 bg-orange-100 px-2 py-1 rounded">
                    {pattern.pattern}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700">{pattern.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Reusable Components */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          Suggested Reusable Components
        </h4>
        <div className="space-y-3">
          {analysis.reusableComponents.map((component, i) => {
            const isExpanded = expandedComponent === i;
            return (
              <div key={i} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                <div 
                  className="p-4 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedComponent(isExpanded ? null : i)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-medium text-slate-800">{component.name}</h5>
                      <p className="text-xs text-slate-500">{component.instances} instances found</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        -{Math.round((component.instances - 1) * 50)}% code
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-slate-200 p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Suggested Component Code</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyCode(component.code, i); }}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
                      >
                        {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedIndex === i ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="bg-slate-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      <code>{component.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
        <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Benefits of Extracting Components
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-700">~40%</div>
            <div className="text-sm text-green-600">Less code to maintain</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-700">Faster</div>
            <div className="text-sm text-green-600">Update once, apply everywhere</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-700">Consistent</div>
            <div className="text-sm text-green-600">Unified UI/UX patterns</div>
          </div>
        </div>
      </div>
    </div>
  );
}
