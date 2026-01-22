import { Search, Code2, Palette, Eye, Shield, Sparkles } from 'lucide-react';

interface HeaderProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export function Header({ url, setUrl, onAnalyze, isLoading }: HeaderProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 rounded-full"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl">
              <Eye className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
            WebScope
          </h1>
          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-xs font-bold rounded-full">
            VISUAL
          </span>
        </div>
        
        <p className="text-center text-indigo-200 mb-8 max-w-2xl mx-auto">
          Visual-first website analysis with interactive overlays, design system detection, 
          accessibility audits, DRY scores, and rebuild suggestions.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Visual Inspector</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <Palette className="w-4 h-4 text-pink-400" />
            <span>Design System</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Accessibility</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>DRY Score</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Rebuild Mode</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste website URL (e.g., https://example.com)"
              className="w-full px-6 py-4 pr-36 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg backdrop-blur-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
