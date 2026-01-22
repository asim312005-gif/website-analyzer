import { useState } from 'react';
import { DesignSystem } from '@/types/analysis';
import { Copy, Check, Palette, Type, Box, Layers, Download } from 'lucide-react';

interface DesignSystemPanelProps {
  designSystem: DesignSystem;
}

export function DesignSystemPanel({ designSystem }: DesignSystemPanelProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(designSystem, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSS = () => {
    let css = ':root {\n';
    css += '  /* Colors */\n';
    designSystem.colors.forEach((color, i) => {
      css += `  --color-${color.usage}-${i}: ${color.value};\n`;
    });
    css += '\n  /* Typography Scale */\n';
    designSystem.typography.scale.forEach((size, i) => {
      css += `  --font-size-${i + 1}: ${size};\n`;
    });
    css += '\n  /* Spacing Scale */\n';
    designSystem.spacing.scale.forEach((space, i) => {
      css += `  --spacing-${i + 1}: ${space};\n`;
    });
    css += '\n  /* Border Radius */\n';
    designSystem.borderRadius.forEach((radius, i) => {
      css += `  --radius-${i + 1}: ${radius};\n`;
    });
    css += '\n  /* Shadows */\n';
    designSystem.shadows.forEach((shadow, i) => {
      css += `  --shadow-${i + 1}: ${shadow};\n`;
    });
    css += '}\n';
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design-tokens.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getContrastLabel = (ratio: number | undefined) => {
    if (!ratio) return null;
    if (ratio >= 7) return { label: 'AAA', color: 'bg-green-100 text-green-700' };
    if (ratio >= 4.5) return { label: 'AA', color: 'bg-emerald-100 text-emerald-700' };
    if (ratio >= 3) return { label: 'AA Large', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Fail', color: 'bg-red-100 text-red-700' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Design System Detected</h3>
            <p className="text-sm text-slate-500">Colors, typography, spacing, and tokens extracted</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportAsJSON}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
          <button
            onClick={exportAsCSS}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            CSS Variables
          </button>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-500" />
          Color Palette
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {designSystem.colors.map((color, i) => {
            const contrast = getContrastLabel(color.contrastRatio);
            return (
              <div key={i} className="group">
                <div
                  className="w-full aspect-square rounded-xl shadow-md group-hover:scale-105 transition-transform cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: color.value }}
                  onClick={() => copyToClipboard(color.value, `color-${i}`)}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                    {copied === `color-${i}` ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Copy className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  {contrast && (
                    <span className={`absolute bottom-2 right-2 text-xs px-1.5 py-0.5 rounded font-medium ${contrast.color}`}>
                      {contrast.label}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-mono text-slate-600">{color.value}</p>
                  <p className="text-xs text-slate-400">{color.name}</p>
                  <p className="text-xs capitalize text-slate-500 mt-0.5">{color.usage}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Type className="w-4 h-4 text-blue-500" />
          Typography Scale
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Font Sizes</p>
              <div className="space-y-2">
                {designSystem.typography.scale.map((size, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600" style={{ fontSize: size }}>Aa</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">{size}</span>
                      <button
                        onClick={() => copyToClipboard(size, `size-${i}`)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {copied === `size-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Font Weights</p>
              <div className="flex flex-wrap gap-2">
                {designSystem.typography.fontWeights.map((weight, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-slate-100 rounded-lg text-sm text-slate-700"
                    style={{ fontWeight: parseInt(weight) }}
                  >
                    {weight}
                  </span>
                ))}
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 mt-4">Line Heights</p>
              <div className="flex flex-wrap gap-2">
                {designSystem.typography.lineHeights.map((lh, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-mono text-slate-600">
                    {lh}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Box className="w-4 h-4 text-purple-500" />
          Spacing Scale
        </h4>
        <p className="text-sm text-slate-500 mb-4">{designSystem.spacing.pattern}</p>
        <div className="flex flex-wrap gap-3">
          {designSystem.spacing.scale.map((space, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 cursor-pointer group"
              onClick={() => copyToClipboard(space, `space-${i}`)}
            >
              <div
                className="bg-indigo-500 rounded group-hover:bg-indigo-600 transition-colors"
                style={{ width: space, height: space, minWidth: '8px', minHeight: '8px' }}
              />
              <span className="text-xs font-mono text-slate-500">{space}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius & Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            Border Radius
          </h4>
          <div className="flex flex-wrap gap-3">
            {designSystem.borderRadius.map((radius, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 cursor-pointer group"
                onClick={() => copyToClipboard(radius, `radius-${i}`)}
              >
                <div
                  className="w-12 h-12 bg-indigo-100 border-2 border-indigo-300 group-hover:border-indigo-500 transition-colors"
                  style={{ borderRadius: radius }}
                />
                <span className="text-xs font-mono text-slate-500">{radius}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            Shadows
          </h4>
          <div className="space-y-3">
            {designSystem.shadows.map((shadow, i) => (
              <div
                key={i}
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => copyToClipboard(shadow, `shadow-${i}`)}
              >
                <div
                  className="w-16 h-12 bg-white rounded-lg"
                  style={{ boxShadow: shadow }}
                />
                <span className="text-xs font-mono text-slate-500 flex-1 truncate">{shadow}</span>
                <button className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                  {copied === `shadow-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
