import { FontInfo } from '@/types/analysis';
import { Type } from 'lucide-react';

interface FontPanelProps {
  fonts: FontInfo[];
}

export function FontPanel({ fonts }: FontPanelProps) {
  if (fonts.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No custom fonts detected
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fonts.map((font, i) => (
        <div 
          key={i} 
          className="bg-white rounded-xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">{font.family}</h4>
              <span className="text-xs text-slate-500 capitalize">{font.usage}</span>
            </div>
          </div>
          
          <div 
            className="text-3xl mb-4 text-slate-700"
            style={{ fontFamily: font.family }}
          >
            The quick brown fox
          </div>
          
          <div className="flex flex-wrap gap-2">
            {font.weights.map((weight, wi) => (
              <span 
                key={wi}
                className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-mono"
              >
                {weight}
              </span>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <code className="text-xs text-purple-600 font-mono">
              font-family: '{font.family}', sans-serif;
            </code>
          </div>
        </div>
      ))}
    </div>
  );
}
