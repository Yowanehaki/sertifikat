import React from 'react';
import { Download, Printer, RotateCcw, FileText, Image } from 'lucide-react';

const ExportCertif = ({ 
  onDownloadPDF, 
  onDownloadPNG, 
  onDownload, 
  isGenerated, 
  previewUrl,
  onBackToForm 
}) => {
  if (!isGenerated) return null;

  // Print handler: print the certificate image from previewUrl
  const handlePrint = async () => {
    try {
      if (!previewUrl) throw new Error('No previewUrl');
      const filename = previewUrl.split('/').pop();
      const apiUrl = `http://localhost:3000/api/certificates/download/${filename}?format=pdf`;
      
      // Show loading indicator with modern styling
      const loading = document.createElement('div');
      loading.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <div style="width: 3rem; height: 3rem; border: 3px solid #e5e7eb; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <span style="font-size: 1.25rem; font-weight: 600; color: #374151;">Loading PDF...</span>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      loading.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.9);backdrop-filter:blur(8px);z-index:9999;';
      document.body.appendChild(loading);
      
      const response = await fetch(apiUrl, { mode: 'cors', cache: 'reload' });
      if (!response.ok) throw new Error('PDF not found');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
      // Revoke after 10s so the blob can be used for multiple prints
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      document.body.removeChild(loading);
    } catch {
      const loading = document.querySelector('div[style*="z-index:9999"]');
      if (loading) document.body.removeChild(loading);
      alert('Failed to load PDF for printing.');
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Download PDF Button */}
      <button
        onClick={onDownloadPDF || onDownload}
        className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:from-red-600 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-3"
      >
        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        <FileText className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        <span className="relative z-10 font-medium hidden sm:inline">PDF</span>
      </button>
      
      {/* Download PNG Button */}
      <button
        onClick={onDownloadPNG || onDownload}
        className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-cyan-700 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-3"
      >
        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        <Image className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        <span className="relative z-10 font-medium hidden sm:inline">PNG</span>
      </button>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="group bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 hover:bg-purple-50/50 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        <Printer className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 duration-300" />
        <span className="font-medium hidden sm:inline">Print</span>
      </button>

      {/* Back to Form Button */}
      <button
        onClick={onBackToForm}
        className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800 hover:bg-gray-50/50 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        <RotateCcw className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
        <span className="font-medium hidden sm:inline">New</span>
      </button>
    </div>
  );
};

export default ExportCertif;