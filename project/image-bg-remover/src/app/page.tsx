'use client';

import { useState, useCallback } from 'react';

// SVG Icons
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-slate-300">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const RefreshIcon = ({ spin = false }: { spin?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={spin ? 'animate-spin' : ''}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
    <path d="M16 16h5v5"/>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processImage = async (file: File) => {
    if (!apiKey.trim()) {
      setError('Please enter your remove.bg API key first');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP)');
      return;
    }

    const originalUrl = URL.createObjectURL(file);
    setOriginalImage(originalUrl);
    setResultImage(null);
    setError(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.errors?.[0]?.title || `API Error: ${response.status}`);
      }

      const blob = await response.blob();
      setResultBlob(blob);
      setResultImage(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err.message || 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processImage(e.dataTransfer.files[0]);
    }
  }, [apiKey]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processImage(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'no-background.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setResultBlob(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🎨 Background Remover</h1>
          <p className="text-slate-300 text-lg">Remove image backgrounds instantly with AI</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <label className="block text-white text-sm font-medium mb-2">
            Remove.bg API Key
            <a href="https://www.remove.bg/api" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs ml-2">(Get API Key →)</a>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your remove.bg API key"
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-2">
            <AlertIcon /> {error}
          </div>
        )}

        {!originalImage && !isProcessing && (
          <div
            onClick={() => document.getElementById('fileInput')?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`rounded-2xl p-12 text-center cursor-pointer bg-white/5 backdrop-blur-sm border-3 border-dashed transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 hover:border-slate-300'}`}
            style={{ borderWidth: '3px' }}
          >
            <UploadIcon />
            <p className="text-white text-xl font-medium mb-2">Drop your image here</p>
            <p className="text-slate-400">or click to browse (JPG, PNG, WebP)</p>
            <input id="fileInput" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-white"><RefreshIcon spin /></div>
            <p className="text-white text-xl">Removing background...</p>
            <p className="text-slate-400 mt-2">Powered by remove.bg</p>
          </div>
        )}

        {originalImage && !isProcessing && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-semibold">Result</h3>
              {resultImage && (
                <button onClick={handleDownload} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition flex items-center gap-2">
                  <DownloadIcon /> Download PNG
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-2">Original</p>
                <img src={originalImage} alt="Original" className="w-full rounded-lg object-contain max-h-96" />
              </div>
              <div className="bg-black/30 rounded-xl p-4" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`}}>
                <p className="text-slate-400 text-sm mb-2">No Background</p>
                {resultImage ? (
                  <img src={resultImage} alt="Result" className="w-full rounded-lg object-contain max-h-96" />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-slate-500">
                    <ImageIcon />
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleReset} className="w-full mt-6 py-3 border-2 border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition flex items-center justify-center gap-2">
              <RefreshIcon /> Process Another Image
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
