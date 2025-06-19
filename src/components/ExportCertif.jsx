import React from 'react';
import { Download } from 'lucide-react';

const ExportCertif = ({ onDownloadPDF, onDownloadPNG, onDownload, isGenerated }) => {
  if (!isGenerated) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
      <button
        onClick={onDownloadPDF || onDownload}
        className="flex-1 bg-white/10 backdrop-blur-sm border border-green-200 hover:border-green-300 text-green-600 hover:text-green-700 hover:bg-green-50/50 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow group"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
        <span className="text-sm sm:text-base">Download PDF</span>
      </button>
      <button
        onClick={onDownloadPNG || onDownload}
        className="flex-1 bg-white/10 backdrop-blur-sm border border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow group"
      >
        <Download className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-y-0.5" />
        <span className="text-sm sm:text-base">Download PNG</span>
      </button>
    </div>
  );
};

export default ExportCertif;
