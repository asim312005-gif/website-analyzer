import { ColorPalette } from '@/types/analysis';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ColorPalettePanelProps {
  colors: ColorPalette;
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copyColor = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div 
      className="group cursor-pointer"
      onClick={copyColor}
    >
      <div 
        className="w-full aspect-square rounded-xl shadow-md group-hover:scale-105 transition-transform relative overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          {copied ? (
            <Check className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          ) : (
            <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
      <p className="text-xs text-slate-600 mt-2 font-mono text-center truncate">{color}</p>
      <p className="text-xs text-slate-400 text-center">{label}</p>
    </div>
  );
}

export function ColorPalettePanel({ colors }: ColorPalettePanelProps) {
  const allColors = [
    ...colors.primary.map((c, i) => ({ color: c, label: `Primary ${i + 1}` })),
    ...colors.secondary.map((c, i) => ({ color: c, label: `Secondary ${i + 1}` })),
    ...colors.accent.map((c, i) => ({ color: c, label: `Accent ${i + 1}` })),
    ...colors.background.map((c, i) => ({ color: c, label: `Background ${i + 1}` })),
    ...colors.text.map((c, i) => ({ color: c, label: `Text ${i + 1}` })),
  ].filter((c, i, arr) => arr.findIndex(x => x.color === c.color) === i);

  if (allColors.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No colors detected in the stylesheet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {allColors.map((item, i) => (
        <ColorSwatch key={i} color={item.color} label={item.label} />
      ))}
    </div>
  );
}
