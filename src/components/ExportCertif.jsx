import React from 'react';
import { Download } from 'lucide-react';

const ExportCertif = ({ onDownloadPDF, onDownloadPNG, onDownload, isGenerated, previewUrl }) => {
  if (!isGenerated) return null;

  // Print handler: print the certificate image from previewUrl
  const handlePrint = async () => {
    try {
      if (!previewUrl) throw new Error('No previewUrl');
      const filename = previewUrl.split('/').pop();
      const apiUrl = `http://localhost:3000/api/certificates/download/${filename}?format=pdf`;
      // Show loading indicator
      const loading = document.createElement('div');
      loading.innerText = 'Loading PDF...';
      loading.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.7);z-index:9999;font-size:1.5rem;font-weight:600;color:#333;';
      document.body.appendChild(loading);
      const response = await fetch(apiUrl, { mode: 'cors', cache: 'reload' });
      if (!response.ok) throw new Error('PDF not found');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      document.body.removeChild(loading);
    } catch {
      const loading = document.querySelector('div[style*="z-index:9999"]');
      if (loading) document.body.removeChild(loading);
      alert('Failed to load PDF for printing.');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 w-full">
      <button
        onClick={onDownloadPDF || onDownload}
        className="flex-1 min-w-0 bg-white/10 backdrop-blur-sm border border-green-200 hover:border-green-300 text-green-600 hover:text-green-700 hover:bg-green-50/50 py-2.5 px-3 sm:py-3 sm:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow group text-xs sm:text-base"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
        <span className="truncate">Download PDF</span>
      </button>
      <button
        onClick={onDownloadPNG || onDownload}
        className="flex-1 min-w-0 bg-white/10 backdrop-blur-sm border border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 py-2.5 px-3 sm:py-3 sm:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow group text-xs sm:text-base"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
        <span className="truncate">Download PNG</span>
      </button>
      <button
        onClick={handlePrint}
        className="flex-1 min-w-0 bg-white/10 backdrop-blur-sm border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 hover:bg-gray-50/50 py-2.5 px-3 sm:py-3 sm:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow group mt-1 sm:mt-0 text-xs sm:text-base"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-6 0v4m0 0h4m-4 0H8" /></svg>
        <span className="truncate">Print</span>
      </button>
    </div>
  );
};

export default ExportCertif;
