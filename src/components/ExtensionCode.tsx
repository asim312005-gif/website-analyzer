import { useState } from 'react';
import { Download, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const manifestJson = `{
  "manifest_version": 3,
  "name": "WebScope - Website Analyzer",
  "version": "1.0.0",
  "description": "Analyze any website's structure, technologies, components, styling, and more",
  "permissions": ["activeTab", "scripting"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}`;

const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      width: 400px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%);
      color: white;
    }
    .header { padding: 20px; text-align: center; }
    .header h1 { font-size: 24px; margin-bottom: 8px; }
    .header p { font-size: 12px; opacity: 0.8; }
    .content { background: white; color: #1e293b; padding: 20px; min-height: 300px; }
    .btn { 
      width: 100%; 
      padding: 12px; 
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      color: white; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .btn:hover { opacity: 0.9; }
    .section { margin-bottom: 16px; }
    .section-title { font-weight: 600; margin-bottom: 8px; font-size: 14px; color: #6366f1; }
    .tech-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .tech-tag { 
      padding: 4px 10px; 
      background: #f1f5f9; 
      border-radius: 20px; 
      font-size: 12px;
      color: #475569;
    }
    .loader { text-align: center; padding: 40px; }
    .spinner { 
      width: 40px; 
      height: 40px; 
      border: 3px solid #e2e8f0; 
      border-top-color: #8b5cf6; 
      border-radius: 50%; 
      animation: spin 1s linear infinite; 
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .stat { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .stat:last-child { border-bottom: none; }
    .stat-label { color: #64748b; font-size: 13px; }
    .stat-value { font-weight: 600; color: #1e293b; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 WebScope</h1>
    <p>Website Structure Analyzer</p>
  </div>
  <div class="content" id="content">
    <button class="btn" id="analyzeBtn">Analyze This Page</button>
    <div id="results"></div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`;

const popupJs = `document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<div class="loader"><div class="spinner"></div><p style="margin-top:12px;color:#64748b">Analyzing page...</p></div>';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: analyzeCurrentPage
    });
    
    const analysis = results[0].result;
    displayResults(analysis);
  } catch (error) {
    resultsDiv.innerHTML = '<p style="color:red">Error analyzing page: ' + error.message + '</p>';
  }
});

function analyzeCurrentPage() {
  const html = document.documentElement.outerHTML;
  
  // Detect technologies
  const technologies = [];
  if (html.includes('react') || html.includes('_reactRootContainer')) technologies.push('React');
  if (html.includes('__NEXT_DATA__') || html.includes('_next')) technologies.push('Next.js');
  if (html.includes('vue') || html.includes('__VUE__')) technologies.push('Vue.js');
  if (html.includes('angular') || html.includes('ng-version')) technologies.push('Angular');
  if (/class="[^"]*(?:flex|grid|p-\\d|m-\\d|text-|bg-)[^"]*"/.test(html)) technologies.push('Tailwind CSS');
  if (html.includes('bootstrap')) technologies.push('Bootstrap');
  if (html.includes('jquery') || html.includes('jQuery')) technologies.push('jQuery');
  if (html.includes('gsap') || html.includes('TweenMax')) technologies.push('GSAP');
  if (html.includes('three.js') || html.includes('THREE.')) technologies.push('Three.js');
  if (html.includes('wordpress') || html.includes('wp-content')) technologies.push('WordPress');
  
  // Count elements
  const stats = {
    domElements: document.querySelectorAll('*').length,
    scripts: document.querySelectorAll('script').length,
    stylesheets: document.querySelectorAll('link[rel="stylesheet"], style').length,
    images: document.querySelectorAll('img').length,
    links: document.querySelectorAll('a').length,
    forms: document.querySelectorAll('form').length,
    buttons: document.querySelectorAll('button, [role="button"]').length
  };
  
  // Extract components
  const components = [];
  if (document.querySelector('nav, header, [role="navigation"]')) components.push('Navbar');
  if (document.querySelector('[class*="hero"], .banner')) components.push('Hero Section');
  if (document.querySelector('footer, [role="contentinfo"]')) components.push('Footer');
  if (document.querySelector('aside, [class*="sidebar"]')) components.push('Sidebar');
  if (document.querySelectorAll('[class*="card"], article').length > 0) components.push('Cards');
  if (document.querySelector('form')) components.push('Forms');
  if (document.querySelector('[class*="modal"], [role="dialog"]')) components.push('Modal');
  
  // Extract colors
  const colorPattern = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b/g;
  const colors = [...new Set((html.match(colorPattern) || []).slice(0, 10))];
  
  // Extract fonts
  const fonts = [];
  const fontMatch = html.match(/font-family:\\s*([^;}"']+)/gi);
  if (fontMatch) {
    fontMatch.slice(0, 5).forEach(f => {
      const family = f.replace('font-family:', '').split(',')[0].trim().replace(/['"]/g, '');
      if (!fonts.includes(family)) fonts.push(family);
    });
  }
  
  return {
    title: document.title,
    url: window.location.href,
    technologies,
    stats,
    components,
    colors,
    fonts
  };
}

function displayResults(analysis) {
  const resultsDiv = document.getElementById('results');
  
  let html = '<div class="section"><div class="section-title">📊 Page Statistics</div>';
  for (const [key, value] of Object.entries(analysis.stats)) {
    html += '<div class="stat"><span class="stat-label">' + key.replace(/([A-Z])/g, ' $1').trim() + '</span><span class="stat-value">' + value + '</span></div>';
  }
  html += '</div>';
  
  if (analysis.technologies.length > 0) {
    html += '<div class="section"><div class="section-title">🛠️ Technologies Detected</div><div class="tech-list">';
    analysis.technologies.forEach(tech => {
      html += '<span class="tech-tag">' + tech + '</span>';
    });
    html += '</div></div>';
  }
  
  if (analysis.components.length > 0) {
    html += '<div class="section"><div class="section-title">🧩 Components Found</div><div class="tech-list">';
    analysis.components.forEach(comp => {
      html += '<span class="tech-tag">' + comp + '</span>';
    });
    html += '</div></div>';
  }
  
  if (analysis.fonts.length > 0) {
    html += '<div class="section"><div class="section-title">🔤 Fonts Used</div><div class="tech-list">';
    analysis.fonts.forEach(font => {
      html += '<span class="tech-tag">' + font + '</span>';
    });
    html += '</div></div>';
  }
  
  if (analysis.colors.length > 0) {
    html += '<div class="section"><div class="section-title">🎨 Color Palette</div><div style="display:flex;gap:6px;flex-wrap:wrap">';
    analysis.colors.forEach(color => {
      html += '<div style="width:30px;height:30px;background:' + color + ';border-radius:6px;border:1px solid #e2e8f0" title="' + color + '"></div>';
    });
    html += '</div></div>';
  }
  
  resultsDiv.innerHTML = html;
}`;

const contentJs = `// Content script for detailed element inspection
let inspectorActive = false;
let overlay = null;
let tooltip = null;

function createOverlay() {
  overlay = document.createElement('div');
  overlay.id = 'webscope-overlay';
  overlay.style.cssText = 'position:fixed;pointer-events:none;border:2px solid #8b5cf6;background:rgba(139,92,246,0.1);z-index:999999;transition:all 0.1s;';
  document.body.appendChild(overlay);
  
  tooltip = document.createElement('div');
  tooltip.id = 'webscope-tooltip';
  tooltip.style.cssText = 'position:fixed;z-index:999999;background:#1e1b4b;color:white;padding:8px 12px;border-radius:6px;font-size:12px;font-family:monospace;max-width:300px;word-wrap:break-word;';
  document.body.appendChild(tooltip);
}

function removeOverlay() {
  overlay?.remove();
  tooltip?.remove();
  overlay = null;
  tooltip = null;
}

function getElementInfo(el) {
  const styles = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id,
    classes: Array.from(el.classList).join(' '),
    dimensions: Math.round(rect.width) + ' × ' + Math.round(rect.height),
    display: styles.display,
    position: styles.position,
    padding: styles.padding,
    margin: styles.margin,
    background: styles.backgroundColor,
    color: styles.color,
    font: styles.fontFamily.split(',')[0]
  };
}

document.addEventListener('mouseover', (e) => {
  if (!inspectorActive || !overlay) return;
  
  const el = e.target;
  const rect = el.getBoundingClientRect();
  const info = getElementInfo(el);
  
  overlay.style.top = rect.top + 'px';
  overlay.style.left = rect.left + 'px';
  overlay.style.width = rect.width + 'px';
  overlay.style.height = rect.height + 'px';
  
  tooltip.innerHTML = '<strong>&lt;' + info.tag + '&gt;</strong>' + 
    (info.id ? ' #' + info.id : '') + 
    (info.classes ? '<br>.' + info.classes.replace(/ /g, '.') : '') +
    '<br>Size: ' + info.dimensions +
    '<br>Display: ' + info.display;
  
  tooltip.style.top = (rect.bottom + 10) + 'px';
  tooltip.style.left = rect.left + 'px';
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleInspector') {
    inspectorActive = !inspectorActive;
    if (inspectorActive) {
      createOverlay();
    } else {
      removeOverlay();
    }
    sendResponse({ active: inspectorActive });
  }
});`;

export function ExtensionCode() {
  const [expanded, setExpanded] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const files = [
    { name: 'manifest.json', content: manifestJson, lang: 'json' },
    { name: 'popup.html', content: popupHtml, lang: 'html' },
    { name: 'popup.js', content: popupJs, lang: 'javascript' },
    { name: 'content.js', content: contentJs, lang: 'javascript' },
  ];

  const copyFile = (name: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(name);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const downloadAll = () => {
    files.forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl overflow-hidden">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🧩 Chrome Extension Code
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Download the actual Chrome extension to analyze any website in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); downloadAll(); }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
          {expanded ? (
            <ChevronUp className="w-6 h-6 text-slate-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-slate-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-700 p-6 space-y-6">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">📋 Installation Instructions:</h4>
            <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
              <li>Download all files and create a folder named "webscope-extension"</li>
              <li>Create an "icons" folder with icon16.png, icon48.png, icon128.png</li>
              <li>Open Chrome and go to chrome://extensions/</li>
              <li>Enable "Developer mode" in the top right</li>
              <li>Click "Load unpacked" and select your extension folder</li>
              <li>Click the extension icon on any website to analyze it!</li>
            </ol>
          </div>

          {files.map((file) => (
            <div key={file.name} className="bg-slate-700/30 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-700/50">
                <span className="text-white font-mono text-sm">{file.name}</span>
                <button
                  onClick={() => copyFile(file.name, file.content)}
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                >
                  {copiedFile === file.name ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedFile === file.name ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-sm max-h-64">
                <code className="text-green-400">{file.content}</code>
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
