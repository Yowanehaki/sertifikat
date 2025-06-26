import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ExcelUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axios.post('http://localhost:3000/api/excel/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadStatus({
          type: 'success',
          message: response.data.message,
          data: response.data.data
        });
        if (onUploadSuccess) {
          onUploadSuccess(response.data.data);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat upload file');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const downloadTemplate = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/excel/template', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template-peserta.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download template error:', err);
      setError('Gagal mengunduh template');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Data Peserta</h2>
        <p className="text-gray-600">Upload file Excel berisi data peserta untuk generate sertifikat massal</p>
      </div>

      {/* Download Template */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">Template Excel</h3>
            <p className="text-sm text-blue-600">Download template untuk format data yang benar</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Download Template
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Mengupload file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FileSpreadsheet size={48} className="text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'Drop file Excel di sini' : 'Drag & drop file Excel atau klik untuk memilih'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Format yang didukung: .xlsx, .xls
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Upload size={16} />
              Pilih File
            </button>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-lg ${
          uploadStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {uploadStatus.type === 'success' ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <AlertCircle size={20} className="text-red-600" />
            )}
            <span className={`font-medium ${
              uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {uploadStatus.message}
            </span>
          </div>
          {uploadStatus.data && (
            <div className="mt-2 text-sm text-green-700">
              <p>Total peserta yang diupload: {uploadStatus.data.totalUploaded}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <span className="font-medium text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Petunjuk Upload:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• File harus berformat Excel (.xlsx atau .xls)</li>
          <li>• Baris pertama harus berisi header kolom</li>
          <li>• Kolom wajib: ID Sertifikat, Nama Peserta, Activity, Company Code</li>
          <li>• Data kosong akan menggunakan nilai default</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelUpload; 