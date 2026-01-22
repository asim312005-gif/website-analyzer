import { AnimationInfo } from '@/types/analysis';
import { Zap, Copy, Check, Play, Info } from 'lucide-react';
import { useState } from 'react';

interface AnimationPanelProps {
  animations: AnimationInfo[];
}

export function AnimationPanel({ animations }: AnimationPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [previewingIndex, setPreviewingIndex] = useState<number | null>(null);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (animations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-4">
          <Zap className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Animations Detected</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          This website might use JavaScript-based animations or minimal CSS transitions that weren't captured.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Animation Guide */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">How to Use These Animations</h4>
            <p className="text-sm text-yellow-700">
              Copy the CSS code below and add it to your stylesheet. Apply the animation class to any element you want to animate.
              For JavaScript animations, use libraries like GSAP or Framer Motion.
            </p>
          </div>
        </div>
      </div>

      {animations.map((animation, i) => (
        <div 
          key={i}
          className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden"
        >
          <div className="p-4 flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{animation.name}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${animation.type === 'css' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {animation.type.toUpperCase()}
                  </span>
                  {animation.duration !== 'varies' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      ⏱ {animation.duration}
                    </span>
                  )}
                  {animation.timing !== 'varies' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                      🎯 {animation.timing}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewingIndex(previewingIndex === i ? null : i)}
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-100"
              >
                <Play className="w-4 h-4" />
                {previewingIndex === i ? 'Stop' : 'Preview'}
              </button>
              <button
                onClick={() => copyCode(animation.code, i)}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-purple-50"
              >
                {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedIndex === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          {/* Animation Preview */}
          {previewingIndex === i && (
            <div className="p-6 bg-slate-100 border-b border-slate-200 flex items-center justify-center">
              <div 
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg"
                style={{
                  animation: animation.name === 'fadeInUp' ? 'fadeInUp 0.6s ease-out forwards' :
                             animation.name === 'hover-scale' ? 'pulse 1s ease-in-out infinite' :
                             animation.name === 'gradient-animation' ? 'gradient 3s ease infinite' :
                             animation.name === 'pulse-glow' ? 'pulse-glow 2s ease-in-out infinite' :
                             'bounce 1s infinite',
                  backgroundSize: animation.name === 'gradient-animation' ? '400% 400%' : undefined,
                  background: animation.name === 'gradient-animation' 
                    ? 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)'
                    : undefined,
                }}
              />
              <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                }
                @keyframes gradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes pulse-glow {
                  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
                  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.8); }
                }
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                }
              `}</style>
            </div>
          )}
          
          <div className="p-4">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
              <code className="text-cyan-300">{animation.code}</code>
            </pre>

            {/* Usage Example */}
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h5 className="text-sm font-medium text-slate-700 mb-2">📖 How to Apply This Animation:</h5>
              <pre className="bg-white p-3 rounded border border-slate-200 text-xs font-mono overflow-x-auto">
                <code className="text-slate-700">
{`<!-- HTML -->
<div class="animate-${animation.name}">
  Your animated content here
</div>

/* CSS - Add to your stylesheet */
${animation.code}

/* Apply animation on scroll (with JS) */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-${animation.name}');
    }
  });
});

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
