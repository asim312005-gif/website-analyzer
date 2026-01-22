import { useState } from 'react';
import { AccessibilityIssue } from '@/types/analysis';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Eye, Type, MousePointer, Layers, Focus, Code, ChevronDown, ChevronUp, Copy, Check, Shield } from 'lucide-react';

interface AccessibilityPanelProps {
  issues: AccessibilityIssue[];
}

const severityConfig: Record<AccessibilityIssue['severity'], { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  critical: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: <AlertCircle className="w-4 h-4" />, label: 'Critical' },
  serious: { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: <AlertTriangle className="w-4 h-4" />, label: 'Serious' },
  moderate: { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: <Info className="w-4 h-4" />, label: 'Moderate' },
  minor: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: <Info className="w-4 h-4" />, label: 'Minor' },
};

const typeConfig: Record<AccessibilityIssue['type'], { icon: React.ReactNode; label: string }> = {
  contrast: { icon: <Eye className="w-4 h-4" />, label: 'Color Contrast' },
  'alt-text': { icon: <Type className="w-4 h-4" />, label: 'Alt Text' },
  'tap-target': { icon: <MousePointer className="w-4 h-4" />, label: 'Touch Target' },
  'heading-order': { icon: <Layers className="w-4 h-4" />, label: 'Heading Order' },
  aria: { icon: <Code className="w-4 h-4" />, label: 'ARIA' },
  focus: { icon: <Focus className="w-4 h-4" />, label: 'Focus State' },
  semantic: { icon: <Code className="w-4 h-4" />, label: 'Semantic HTML' },
};

export function AccessibilityPanel({ issues }: AccessibilityPanelProps) {
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | AccessibilityIssue['severity']>('all');

  const filteredIssues = filter === 'all' ? issues : issues.filter(i => i.severity === filter);
  
  const issueCountBySeverity = {
    critical: issues.filter(i => i.severity === 'critical').length,
    serious: issues.filter(i => i.severity === 'serious').length,
    moderate: issues.filter(i => i.severity === 'moderate').length,
    minor: issues.filter(i => i.severity === 'minor').length,
  };

  const score = Math.max(0, 100 - (issueCountBySeverity.critical * 25 + issueCountBySeverity.serious * 15 + issueCountBySeverity.moderate * 5 + issueCountBySeverity.minor * 2));

  const copyRecommendation = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Accessibility Score</h3>
            </div>
            <p className="text-indigo-100 text-sm">Based on WCAG 2.1 guidelines</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{score}</div>
            <div className="text-indigo-200 text-sm">out of 100</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-4 gap-3">
          {Object.entries(issueCountBySeverity).map(([severity, count]) => (
            <div key={severity} className="bg-white/10 rounded-lg p-3 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs capitalize text-indigo-200">{severity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Issues ({issues.length})
        </button>
        {(['critical', 'serious', 'moderate', 'minor'] as const).map((severity) => (
          <button
            key={severity}
            onClick={() => setFilter(severity)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
              filter === severity 
                ? `${severityConfig[severity].bg} ${severityConfig[severity].color} border` 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {severityConfig[severity].icon}
            <span className="capitalize">{severity}</span>
            <span className="text-xs opacity-70">({issueCountBySeverity[severity]})</span>
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 bg-green-50 rounded-xl border border-green-200">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h4 className="font-semibold text-green-700">No Issues Found</h4>
            <p className="text-green-600 text-sm mt-1">Great job! No {filter === 'all' ? '' : filter} accessibility issues detected.</p>
          </div>
        ) : (
          filteredIssues.map((issue, i) => {
            const sev = severityConfig[issue.severity];
            const typ = typeConfig[issue.type];
            const isExpanded = expandedIssue === i;
            
            return (
              <div key={i} className={`rounded-xl border overflow-hidden ${sev.bg}`}>
                <div 
                  className="p-4 cursor-pointer flex items-start gap-3"
                  onClick={() => setExpandedIssue(isExpanded ? null : i)}
                >
                  <div className={`p-2 rounded-lg ${sev.color} bg-white/50`}>
                    {typ.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${sev.color} bg-white/50`}>
                        {sev.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                        {typ.label}
                      </span>
                      {issue.wcagLevel && (
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                          WCAG {issue.wcagLevel}
                        </span>
                      )}
                    </div>
                    <p className={`font-medium ${sev.color}`}>{issue.description}</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">{issue.element}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-200/50">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-slate-800 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Recommendation
                        </h5>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyRecommendation(issue.recommendation, i); }}
                          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedIndex === i ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-sm text-slate-600">{issue.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Ethical Note */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-slate-800 mb-1">Analysis Disclaimer</h4>
            <p className="text-sm text-slate-600">
              This tool performs automated accessibility analysis and may not catch all issues. 
              We recommend manual testing with assistive technologies and consulting WCAG guidelines 
              for comprehensive accessibility compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
