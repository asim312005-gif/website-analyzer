import { AnalysisResult } from '@/types/analysis';
import { FileCode, FileText, Image, Gauge } from 'lucide-react';

interface PerformancePanelProps {
  performance: AnalysisResult['performance'];
  metaTags: AnalysisResult['metaTags'];
}

export function PerformancePanel({ performance, metaTags }: PerformancePanelProps) {
  const stats: { label: string; value: number; icon: React.ReactNode; color: string; status: 'good' | 'warning' | 'bad' }[] = [
    { 
      label: 'DOM Elements', 
      value: performance.domElements, 
      icon: <FileCode className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      status: performance.domElements < 1500 ? 'good' : performance.domElements < 3000 ? 'warning' : 'bad'
    },
    { 
      label: 'Stylesheets', 
      value: performance.stylesheets, 
      icon: <FileText className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      status: performance.stylesheets < 5 ? 'good' : performance.stylesheets < 10 ? 'warning' : 'bad'
    },
    { 
      label: 'Scripts', 
      value: performance.scripts, 
      icon: <Gauge className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      status: performance.scripts < 10 ? 'good' : performance.scripts < 20 ? 'warning' : 'bad'
    },
    { 
      label: 'Images', 
      value: performance.images, 
      icon: <Image className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      status: performance.images < 20 ? 'good' : performance.images < 50 ? 'warning' : 'bad'
    },
  ];

  const statusColors = {
    good: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    bad: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className="bg-white rounded-xl p-4 shadow-md border border-slate-100"
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-3`}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">{stat.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[stat.status]}`}>
                {stat.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(metaTags).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Meta Tags</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(metaTags).map(([name, content], i) => (
              <div key={i} className="flex gap-4 py-2 border-b border-slate-100 last:border-0">
                <span className="font-mono text-sm text-purple-600 min-w-[200px]">{name}</span>
                <span className="text-sm text-slate-600 break-all">{content}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
