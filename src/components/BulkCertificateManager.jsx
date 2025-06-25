import React, { useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'; // DIHAPUS
import ExcelUpload from './ExcelUpload';
import CertificateList from './CertificateList';
import { FileSpreadsheet, List, Settings } from 'lucide-react';

const BulkCertificateManager = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Switch to list tab and refresh
    setActiveTab('list');
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistem Sertifikat Massal
          </h1>
          <p className="text-lg text-gray-600">
            Upload data peserta dan generate sertifikat secara massal
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileSpreadsheet size={16} />
                Upload Excel
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <List size={16} />
                Daftar Sertifikat
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'upload' && (
              <ExcelUpload onUploadSuccess={handleUploadSuccess} />
            )}
            
            {activeTab === 'list' && (
              <CertificateList key={refreshTrigger} />
            )}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileSpreadsheet size={24} className="text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Upload Massal</h3>
            </div>
            <p className="text-gray-600">
              Upload file Excel berisi data peserta untuk generate sertifikat secara massal dengan mudah.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <List size={24} className="text-green-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Kelola Data</h3>
            </div>
            <p className="text-gray-600">
              Lihat, filter, dan kelola semua data sertifikat dengan fitur pencarian dan filter yang lengkap.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings size={24} className="text-purple-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Generate Fleksibel</h3>
            </div>
            <p className="text-gray-600">
              Generate sertifikat satu per satu, massal, atau berdasarkan kegiatan tertentu.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Cara Penggunaan:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">1. Upload Data</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Download template Excel terlebih dahulu</li>
                <li>• Isi data peserta sesuai format template</li>
                <li>• Upload file Excel yang sudah diisi</li>
                <li>• Data akan otomatis tersimpan ke database</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">2. Generate Sertifikat</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Pilih sertifikat yang akan di-generate</li>
                <li>• Gunakan filter untuk mencari data tertentu</li>
                <li>• Generate satu per satu atau massal</li>
                <li>• Sertifikat akan otomatis terdownload</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkCertificateManager; 