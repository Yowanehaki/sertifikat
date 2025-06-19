import React from 'react';
import { Download } from 'lucide-react';

const ExportCertif = ({ onDownloadPDF, onDownloadPNG, onDownload, isGenerated }) => {
  if (!isGenerated) return null;
  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={onDownloadPDF || onDownload}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        Download PDF
      </button>
      <button
        onClick={onDownloadPNG || onDownload}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Download className="w-5 h-5" />
        Download PNG
      </button>
    </div>
  );
};

export default ExportCertif;
