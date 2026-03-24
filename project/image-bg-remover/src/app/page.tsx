'use client';

import { useState, useCallback } from 'react';
import { Upload, Download, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

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

    // Show original preview
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
        headers: {
          'X-Api-Key': apiKey,
        },
        body: formData,
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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImage(files[0]);
    }
  }, [apiKey]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">🎨 Background Remover</h1>
          <p className="text-slate-300 text-lg">Remove image backgrounds instantly with AI</p>
        </div>

        {/* API Key Input */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <label className="block text-white text-sm font-medium mb-2">
            Remove.bg API Key
            <a
              href="https://www.remove.bg/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs ml-2"
            >
              (Get API Key →)
            </a>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your remove.bg API key"
            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Upload Zone - Only show when no result */}
        {!originalImage && !isProcessing && (
          <div
            onClick={() => document.getElementById('fileInput')?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              rounded-2xl p-12 text-center cursor-pointer bg-white/5 backdrop-blur-sm
              border-3 border-dashed transition-all duration-300
              ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-400 hover:border-slate-300'}
            `}
            style={{ borderWidth: '3px' }}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-white text-xl font-medium mb-2">Drop your image here</p>
            <p className="text-slate-400">or click to browse (JPG, PNG, WebP)</p>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center py-12">
            <RefreshCw className="w-16 h-16 mx-auto mb-4 text-white animate-spin" />
            <p className="text-white text-xl">Removing background...</p>
            <p className="text-slate-400 mt-2">Powered by remove.bg</p>
          </div>
        )}

        {/* Result */}
        {originalImage && !isProcessing && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-xl font-semibold">Result</h3>
              <div className="flex gap-2">
                {resultImage && (
                  <button
                    onClick={handleDownload}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                )}
              </div>
            </div>

            {/* Image Comparison */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-black/30 rounded-xl p-4">
                <p className="text-slate-400 text-sm mb-2">Original</p>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full rounded-lg object-contain max-h-96"
                />
              </div>
              <div
                className="bg-black/30 rounded-xl p-4"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                <p className="text-slate-400 text-sm mb-2">No Background</p>
                {resultImage ? (
                  <img
                    src={resultImage}
                    alt="Result"
                    className="w-full rounded-lg object-contain max-h-96"
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-6 py-3 border-2 border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Process Another Image
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
