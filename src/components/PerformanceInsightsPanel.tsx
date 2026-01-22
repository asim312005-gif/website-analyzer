import { PerformanceInsight, AnalysisResult } from '@/types/analysis';
import { AlertTriangle, Image, FileCode, Gauge, Layers, Activity, Zap, TrendingDown } from 'lucide-react';

interface PerformanceInsightsPanelProps {
  insights: PerformanceInsight[];
  performance: AnalysisResult['performance'];
}

const typeConfig: Record<PerformanceInsight['type'], { icon: React.ReactNode; color: string; label: string }> = {
  cls: { icon: <Activity className="w-4 h-4" />, color: 'text-purple-600 bg-purple-100', label: 'Layout Shift (CLS)' },
  'heavy-component': { icon: <Layers className="w-4 h-4" />, color: 'text-orange-600 bg-orange-100', label: 'Heavy Component' },
  'render-blocking': { icon: <Zap className="w-4 h-4" />, color: 'text-red-600 bg-red-100', label: 'Render Blocking' },
  image: { icon: <Image className="w-4 h-4" />, color: 'text-blue-600 bg-blue-100', label: 'Image Optimization' },
  script: { icon: <FileCode className="w-4 h-4" />, color: 'text-amber-600 bg-amber-100', label: 'Script' },
  css: { icon: <Gauge className="w-4 h-4" />, color: 'text-cyan-600 bg-cyan-100', label: 'CSS' },
};

const severityConfig: Record<PerformanceInsight['severity'], { color: string; bg: string }> = {
  high: { color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  medium: { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  low: { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
};

export function PerformanceInsightsPanel({ insights, performance }: PerformanceInsightsPanelProps) {
  const highIssues = insights.filter(i => i.severity === 'high').length;
  const mediumIssues = insights.filter(i => i.severity === 'medium').length;
  
  // Calculate estimated performance score
  const perfScore = Math.max(0, 100 - (highIssues * 20 + mediumIssues * 10));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <Gauge className="w-6 h-6" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">Estimated</span>
          </div>
          <div className="text-4xl font-bold">{perfScore}</div>
          <div className="text-indigo-200 text-sm">Performance Score</div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <FileCode className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-slate-800">{performance.domElements}</div>
          <div className="text-slate-500 text-sm">DOM Elements</div>
          <div className={`text-xs mt-1 ${performance.domElements > 1500 ? 'text-orange-600' : 'text-green-600'}`}>
            {performance.domElements > 1500 ? '⚠️ Consider reducing' : '✓ Within optimal range'}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <FileCode className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-slate-800">{performance.scripts}</div>
          <div className="text-slate-500 text-sm">Scripts</div>
          <div className={`text-xs mt-1 ${performance.scripts > 10 ? 'text-orange-600' : 'text-green-600'}`}>
            {performance.scripts > 10 ? '⚠️ Consider bundling' : '✓ Good'}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <Image className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-slate-800">{performance.images}</div>
          <div className="text-slate-500 text-sm">Images</div>
          <div className="text-xs mt-1 text-slate-500">Consider lazy loading</div>
        </div>
      </div>

      {/* CLS Visualization */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          Cumulative Layout Shift (CLS) Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CLS Score Meter */}
          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="12"
                  strokeDasharray={`${(1 - 0.15) * 352} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">0.15</span>
                <span className="text-xs text-slate-500">CLS Score</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-sm text-slate-600">Good: 0 - 0.1</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-sm text-slate-600">Needs Work: 0.1 - 0.25</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-sm text-slate-600">Poor: &gt; 0.25</span>
              </div>
            </div>
          </div>
          
          {/* CLS Elements */}
          <div>
            <h5 className="text-sm font-medium text-slate-700 mb-3">Elements Contributing to CLS</h5>
            <div className="space-y-2">
              {insights.filter(i => i.type === 'cls').map((insight, i) => (
                <div key={i} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-purple-700">{insight.element}</span>
                    <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800 rounded">
                      +{insight.value?.toFixed(2) || '0.15'} CLS
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Insights */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-orange-500" />
          Performance Insights
        </h4>
        <div className="space-y-3">
          {insights.map((insight, i) => {
            const type = typeConfig[insight.type];
            const sev = severityConfig[insight.severity];
            
            return (
              <div key={i} className={`rounded-lg border p-4 ${sev.bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${type.color}`}>
                    {type.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${sev.color} bg-white/50`}>
                        {insight.severity}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                        {type.label}
                      </span>
                    </div>
                    <p className={`font-medium ${sev.color}`}>{insight.description}</p>
                    {insight.element && (
                      <p className="text-xs text-slate-500 font-mono mt-1">{insight.element}</p>
                    )}
                    <div className="mt-2 flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600"><strong>Impact:</strong> {insight.impact}</p>
                    </div>
                    <div className="mt-2 p-2 bg-white/50 rounded-lg">
                      <p className="text-xs text-slate-700"><strong>💡 Fix:</strong> {insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
