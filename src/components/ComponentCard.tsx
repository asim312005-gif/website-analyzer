import { useState } from 'react';
import { ComponentInfo } from '@/types/analysis';
import { ChevronDown, ChevronUp, Copy, Check, Layers, Navigation, Image, FileText, FormInput, LayoutGrid, Square, Box, Code, Paintbrush, BookOpen } from 'lucide-react';

interface ComponentCardProps {
  component: ComponentInfo;
}

const typeIcons: Record<ComponentInfo['type'], React.ReactNode> = {
  layout: <LayoutGrid className="w-4 h-4" />,
  navigation: <Navigation className="w-4 h-4" />,
  hero: <Image className="w-4 h-4" />,
  content: <FileText className="w-4 h-4" />,
  form: <FormInput className="w-4 h-4" />,
  media: <Image className="w-4 h-4" />,
  footer: <Layers className="w-4 h-4" />,
  sidebar: <LayoutGrid className="w-4 h-4" />,
  card: <Square className="w-4 h-4" />,
  button: <Box className="w-4 h-4" />,
  modal: <Square className="w-4 h-4" />,
  other: <Layers className="w-4 h-4" />,
};

const typeColors: Record<ComponentInfo['type'], string> = {
  layout: 'bg-blue-100 text-blue-700',
  navigation: 'bg-green-100 text-green-700',
  hero: 'bg-purple-100 text-purple-700',
  content: 'bg-slate-100 text-slate-700',
  form: 'bg-orange-100 text-orange-700',
  media: 'bg-pink-100 text-pink-700',
  footer: 'bg-gray-100 text-gray-700',
  sidebar: 'bg-indigo-100 text-indigo-700',
  card: 'bg-cyan-100 text-cyan-700',
  button: 'bg-rose-100 text-rose-700',
  modal: 'bg-amber-100 text-amber-700',
  other: 'bg-slate-100 text-slate-700',
};

type CodeTab = 'html' | 'css' | 'usage';

export function ComponentCard({ component }: ComponentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CodeTab>('html');

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case 'html':
        return component.code;
      case 'css':
        return component.cssCode || '/* No CSS code extracted */';
      case 'usage':
        return component.frameworkUsage || '// No framework-specific usage available';
      default:
        return component.code;
    }
  };

  const getCodeLanguage = () => {
    switch (activeTab) {
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'usage':
        return 'jsx';
      default:
        return 'html';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-100 overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${typeColors[component.type]}`}>
            {typeIcons[component.type]}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{component.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs text-slate-500 font-mono">{component.selector}</code>
              {component.framework && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 font-medium">
                  {component.framework}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${typeColors[component.type]}`}>
            {component.type}
          </span>
          {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100">
          {/* Computed Styles */}
          {component.styles.length > 0 && (
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h5 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-purple-500" />
                Computed Styles
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {component.styles.map((style, i) => (
                  <div 
                    key={i} 
                    className="flex items-center gap-2 text-xs bg-white p-2 rounded-lg border border-slate-200"
                  >
                    <span className="font-mono text-purple-600 font-medium">{style.property}:</span>
                    <span className="font-mono text-slate-600 truncate flex-1">{style.value}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCode(`${style.property}: ${style.value};`, style.property);
                      }}
                      className="text-slate-400 hover:text-purple-600 transition-colors"
                    >
                      {copied === style.property ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Code Tabs */}
          <div className="border-b border-slate-100 bg-slate-50">
            <div className="flex">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('html'); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === 'html'
                    ? 'text-orange-600 bg-white border-b-2 border-orange-500'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Code className="w-4 h-4" />
                HTML
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('css'); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === 'css'
                    ? 'text-cyan-600 bg-white border-b-2 border-cyan-500'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Paintbrush className="w-4 h-4" />
                CSS
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveTab('usage'); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === 'usage'
                    ? 'text-purple-600 bg-white border-b-2 border-purple-500'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                How to Use
              </button>
            </div>
          </div>

          {/* Code Display */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-medium text-slate-700">
                  {activeTab === 'html' && 'HTML Code'}
                  {activeTab === 'css' && 'CSS Code'}
                  {activeTab === 'usage' && 'Framework Usage Guide'}
                </h5>
                {activeTab === 'usage' && component.framework && (
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                    {component.framework}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); copyCode(getActiveCode(), 'code'); }}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors px-2 py-1 rounded hover:bg-purple-50"
              >
                {copied === 'code' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'code' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-80">
              <code className={
                getCodeLanguage() === 'html' ? 'text-orange-300' :
                getCodeLanguage() === 'css' ? 'text-cyan-300' :
                'text-green-300'
              }>
                {getActiveCode()}
              </code>
            </pre>

            {/* Usage Tips */}
            {activeTab === 'usage' && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                <h6 className="text-sm font-semibold text-purple-800 mb-2">💡 How to use this in your project:</h6>
                <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
                  <li>Copy the code above to your component file</li>
                  <li>Install required dependencies (npm install)</li>
                  <li>Import the component where needed</li>
                  <li>Customize props and styling as needed</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
