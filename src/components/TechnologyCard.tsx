import { useState } from 'react';
import { TechnologyInfo } from '@/types/analysis';
import { Code2, Palette, Zap, Package, Globe, BarChart2, Wrench, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react';

interface TechnologyCardProps {
  technology: TechnologyInfo;
}

const categoryIcons: Record<TechnologyInfo['category'], React.ReactNode> = {
  framework: <Code2 className="w-5 h-5" />,
  library: <Package className="w-5 h-5" />,
  styling: <Palette className="w-5 h-5" />,
  animation: <Zap className="w-5 h-5" />,
  build: <Wrench className="w-5 h-5" />,
  language: <Code2 className="w-5 h-5" />,
  cms: <Globe className="w-5 h-5" />,
  analytics: <BarChart2 className="w-5 h-5" />,
  other: <Package className="w-5 h-5" />,
};

const categoryColors: Record<TechnologyInfo['category'], string> = {
  framework: 'from-blue-500 to-cyan-500',
  library: 'from-purple-500 to-pink-500',
  styling: 'from-pink-500 to-rose-500',
  animation: 'from-yellow-500 to-orange-500',
  build: 'from-green-500 to-emerald-500',
  language: 'from-indigo-500 to-purple-500',
  cms: 'from-orange-500 to-red-500',
  analytics: 'from-teal-500 to-cyan-500',
  other: 'from-slate-500 to-gray-500',
};

export function TechnologyCard({ technology }: TechnologyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (technology.usageGuide) {
      navigator.clipboard.writeText(technology.usageGuide);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasDetails = technology.description || technology.usageGuide;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100 group overflow-hidden">
      <div 
        className={`p-4 ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg bg-gradient-to-br ${categoryColors[technology.category]} text-white`}>
            {categoryIcons[technology.category]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors truncate">
                {technology.name}
              </h4>
              {hasDetails && (
                expanded 
                  ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> 
                  : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">
                {technology.category}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${categoryColors[technology.category]} rounded-full transition-all`}
                    style={{ width: `${technology.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{technology.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && hasDetails && (
        <div className="border-t border-slate-100 bg-slate-50 p-4">
          {technology.description && (
            <p className="text-sm text-slate-600 mb-3">{technology.description}</p>
          )}
          
          {technology.website && (
            <a 
              href={technology.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 mb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
              Official Documentation
            </a>
          )}

          {technology.usageGuide && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-slate-700">📖 How to Use</h5>
                <button
                  onClick={(e) => { e.stopPropagation(); copyCode(); }}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="bg-slate-900 text-green-300 p-3 rounded-lg overflow-x-auto text-xs font-mono max-h-48">
                <code>{technology.usageGuide}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
