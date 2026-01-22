import { useState } from 'react';
import { Header } from '@/components/Header';
import { VisualAnalyzer } from '@/components/VisualAnalyzer';
import EnhancedVisualInspector from '@/components/EnhancedVisualInspector';
import { TechnologyCard } from '@/components/TechnologyCard';
import { ComponentCard } from '@/components/ComponentCard';
import { DesignSystemPanel } from '@/components/DesignSystemPanel';
import { AccessibilityPanel } from '@/components/AccessibilityPanel';
import { DRYAnalysisPanel } from '@/components/DRYAnalysisPanel';
import { PerformanceInsightsPanel } from '@/components/PerformanceInsightsPanel';
import { RebuildModePanel } from '@/components/RebuildModePanel';
import { PageRelationshipMap } from '@/components/PageRelationshipMap';
import { CodePanel } from '@/components/CodePanel';
import { ExtensionCode } from '@/components/ExtensionCode';
import { AnalysisResult } from '@/types/analysis';
import { fetchAndAnalyze } from '@/utils/analyzer';
import { demoAnalysisResult } from '@/utils/demoData';
import { 
  Code2, 
  Layers, 
  Palette, 
  Zap, 
  FileCode, 
  AlertCircle,
  Globe,
  Hash,
  Eye,
  Shield,
  Repeat,
  Gauge,
  Sparkles,
  Link2,
  Info
} from 'lucide-react';

type TabType = 'visual' | 'technologies' | 'components' | 'design-system' | 'accessibility' | 'dry' | 'performance' | 'rebuild' | 'links' | 'code';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'visual', label: 'Visual Inspector', icon: <Eye className="w-4 h-4" /> },
  { id: 'technologies', label: 'Tech Stack', icon: <Code2 className="w-4 h-4" /> },
  { id: 'components', label: 'Components', icon: <Layers className="w-4 h-4" /> },
  { id: 'design-system', label: 'Design System', icon: <Palette className="w-4 h-4" /> },
  { id: 'accessibility', label: 'Accessibility', icon: <Shield className="w-4 h-4" /> },
  { id: 'dry', label: 'DRY Score', icon: <Repeat className="w-4 h-4" /> },
  { id: 'performance', label: 'Performance', icon: <Gauge className="w-4 h-4" /> },
  { id: 'rebuild', label: 'Rebuild Mode', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'links', label: 'Page Map', icon: <Link2 className="w-4 h-4" /> },
  { id: 'code', label: 'Code', icon: <FileCode className="w-4 h-4" /> },
];

export function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('visual');

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    let analyzedUrl = url.trim();
    if (!analyzedUrl.startsWith('http://') && !analyzedUrl.startsWith('https://')) {
      analyzedUrl = 'https://' + analyzedUrl;
    }

    setIsLoading(true);
    setError(null);

    try {
      const analysisResult = await fetchAndAnalyze(analyzedUrl);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze website');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!result) return null;

    switch (activeTab) {
      case 'visual':
        return (
          <div className="space-y-6">
            {/* Enhanced Visual Inspector with real DOM structure */}
            <EnhancedVisualInspector html={result.htmlStructure} />
            
            {/* Legacy Visual Analyzer for overlay view */}
            <details className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <summary className="px-4 py-3 bg-slate-50 cursor-pointer text-sm font-medium text-slate-700 hover:bg-slate-100">
                📊 Simple Overlay View (Legacy)
              </summary>
              <div className="p-4">
                <VisualAnalyzer 
                  overlays={result.visualOverlays} 
                  components={result.components}
                  screenshotUrl={result.screenshotUrl}
                />
              </div>
            </details>
          </div>
        );

      case 'technologies':
        return (
          <div className="space-y-4">
            {/* Prediction Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 mb-1">Technology Predictions</h4>
                  <p className="text-sm text-amber-700">
                    Technologies are <strong>predicted</strong> based on code patterns, class names, and script references. 
                    Confidence levels indicate detection reliability.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {result.technologies.length > 0 ? (
                result.technologies.map((tech, i) => (
                  <TechnologyCard key={i} technology={tech} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No technologies detected. The website might be using plain HTML/CSS.
                </div>
              )}
            </div>
          </div>
        );

      case 'components':
        return (
          <div className="space-y-4">
            {result.components.length > 0 ? (
              result.components.map((component, i) => (
                <ComponentCard key={i} component={component} />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                No recognizable components detected
              </div>
            )}
          </div>
        );

      case 'design-system':
        return <DesignSystemPanel designSystem={result.designSystem} />;

      case 'accessibility':
        return <AccessibilityPanel issues={result.accessibilityIssues} />;

      case 'dry':
        return <DRYAnalysisPanel analysis={result.dryAnalysis} />;

      case 'performance':
        return (
          <PerformanceInsightsPanel 
            insights={result.performanceInsights} 
            performance={result.performance}
          />
        );

      case 'rebuild':
        return <RebuildModePanel suggestions={result.rebuildSuggestions} />;

      case 'links':
        return <PageRelationshipMap relationships={result.pageRelationships} />;

      case 'code':
        return <CodePanel htmlStructure={result.htmlStructure} cssCode={result.cssCode} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Header url={url} setUrl={setUrl} onAnalyze={handleAnalyze} isLoading={isLoading} />

      <main className="container mx-auto px-4 py-8">
        {/* Extension Code Section */}
        <div className="mb-8">
          <ExtensionCode />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3 text-red-700 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-2">Failed to analyze website</p>
                <p className="text-sm whitespace-pre-line">{error}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-red-200">
              <button
                onClick={() => {
                  setError(null);
                  setResult(demoAnalysisResult);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
              >
                🎯 View Demo Analysis
              </button>
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-white text-red-600 text-sm rounded-lg border border-red-300 hover:bg-red-50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Page Info Header */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-800">{result.title}</h2>
                    <button
                      onClick={() => setResult(null)}
                      className="text-sm text-slate-500 hover:text-red-500 transition-colors"
                    >
                      ✕ Clear
                    </button>
                  </div>
                  <p className="text-slate-500 mb-3">{result.description || 'No description available'}</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <Globe className="w-4 h-4" />
                      {result.url}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <FileCode className="w-4 h-4" />
                      {result.doctype}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      <Hash className="w-4 h-4" />
                      {result.performance.domElements} elements
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.jsLibraries.slice(0, 3).map((lib, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-full"
                    >
                      {lib}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Ethical Notice */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Analysis Only:</strong> This tool analyzes publicly visible HTML/CSS structure for educational purposes. 
                  It does not extract proprietary code or access private data. Respect intellectual property rights.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'text-indigo-600 bg-white border-b-2 border-indigo-600'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-200">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              Visual-First Website Analysis
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Enter any URL to get an interactive visual breakdown of its structure, 
              design system, accessibility, performance, and more.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
              {[
                { icon: <Eye className="w-5 h-5" />, title: 'Visual Inspector', desc: 'Interactive overlays', color: 'bg-indigo-100 text-indigo-600' },
                { icon: <Palette className="w-5 h-5" />, title: 'Design System', desc: 'Colors, fonts, spacing', color: 'bg-pink-100 text-pink-600' },
                { icon: <Shield className="w-5 h-5" />, title: 'Accessibility', desc: 'WCAG compliance', color: 'bg-green-100 text-green-600' },
                { icon: <Repeat className="w-5 h-5" />, title: 'DRY Score', desc: 'Code reusability', color: 'bg-orange-100 text-orange-600' },
                { icon: <Sparkles className="w-5 h-5" />, title: 'Rebuild Mode', desc: 'Improvement suggestions', color: 'bg-purple-100 text-purple-600' },
              ].map((feature, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-md border border-slate-100">
                  <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}>
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo Button */}
        {!result && (
          <div className="text-center">
            <button
              onClick={() => setResult(demoAnalysisResult)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all"
            >
              🎯 View Demo Analysis
            </button>
            <p className="text-sm text-slate-500 mt-2">See all features with sample data</p>
            
            <div className="mt-8">
              <p className="text-sm text-slate-500 mb-4">Or try analyzing these sites:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['github.com', 'stripe.com', 'vercel.com', 'tailwindcss.com'].map((site) => (
                  <button
                    key={site}
                    onClick={() => setUrl('https://' + site)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    {site}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Eye className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-bold">WebScope</span>
          </div>
          <p className="text-slate-400 text-sm mb-2">
            Visual-first website analysis for developers
          </p>
          <p className="text-xs text-slate-500">
            Analysis only • No code extraction • Respect intellectual property
          </p>
        </div>
      </footer>
    </div>
  );
}
