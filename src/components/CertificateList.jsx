import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  CheckSquare, 
  Square,
  FileText,
  User
} from 'lucide-react';
import axios from 'axios';
import EditParticipantModal from './EditParticipantModal';
import useModalScroll from './ui/useModalScroll';

const CertificateList = () => {
  const [certificates, setCertificates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCertificates, setSelectedCertificates] = useState([]);
  const [filters, setFilters] = useState({
    activity: '',
    participantName: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [generateModal, setGenerateModal] = useState({ open: false, cert: null });
  const [generateForm, setGenerateForm] = useState({ dateIssued: '', examinerName: '', examinerPosition: '', signature: null });
  const [generateResult, setGenerateResult] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [bulkGenerateResult, setBulkGenerateResult] = useState([]);
  const [bulkGenerateModal, setBulkGenerateModal] = useState(false);
  const [bulkGenerateForm, setBulkGenerateForm] = useState({ dateIssued: '', examinerName: '', examinerPosition: '', signature: null });
  const [bulkGenerateLoading, setBulkGenerateLoading] = useState(false);
  const [bulkGenerateError, setBulkGenerateError] = useState("");

  // Use modal scroll hook for delete confirmation modal
  useModalScroll(!!deleteConfirmId);

  // Use modal scroll hook for both delete confirmation and bulk generate modals
  useModalScroll(!!deleteConfirmId || bulkGenerateModal);

  // Debounce filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters]);

  // Fetch certificates and activities
  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedFilters.activity) params.append('activity', debouncedFilters.activity);
      if (debouncedFilters.participantName) params.append('participantName', debouncedFilters.participantName);
      const response = await axios.get(`http://localhost:3000/api/excel/certificates?${params}`);
      if (response.data.success) {
        setCertificates(response.data.data);
      }
    } catch {
      setError('Gagal mengambil data sertifikat');
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    fetchCertificates();
    fetchActivities();
  }, [debouncedFilters, fetchCertificates]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/excel/activities');
      if (response.data.success) {
        setActivities(response.data.data);
      }
    } catch (err) {
      console.error('Fetch activities error:', err);
    }
  };

  // Handle certificate selection
  const toggleCertificateSelection = (id) => {
    setSelectedCertificates(prev => 
      prev.includes(id) 
        ? prev.filter(certId => certId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCertificates.length === certificates.length) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates(certificates.map(cert => cert.id));
    }
  };

  // Delete certificate
  const deleteCertificate = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/excel/certificates/${id}`);
      if (response.data.success) {
        setCertificates(prev => prev.filter(cert => cert.id !== id));
        setSelectedCertificates(prev => prev.filter(certId => certId !== id));
        setSuccessMessage('Data berhasil dihapus');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Delete certificate error:', err);
      setSuccessMessage('Gagal menghapus sertifikat');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setDeleteConfirmId(null);
  };

  // Handler untuk buka modal edit
  const handleEdit = (certificate) => {
    setEditData(certificate);
    setEditModalOpen(true);
  };

  // Handler untuk close modal edit
  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setEditData(null);
  };

  const closeGenerateModal = () => {
    setGenerateModal({ open: false, cert: null });
    setGenerateResult(null);
  };

  const handleGenerateFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'signature') {
      setGenerateForm(f => ({ ...f, signature: files[0] }));
    } else {
      setGenerateForm(f => ({ ...f, [name]: value }));
    }
  };

  // Validasi form generate
  const validateGenerateForm = () => {
    if (!generateForm.dateIssued || !generateForm.examinerName || !generateForm.examinerPosition) {
      setGenerateError('Semua field wajib diisi.');
      return false;
    }
    if (!generateForm.signature) {
      setGenerateError('File tanda tangan wajib diupload.');
      return false;
    }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(generateForm.signature.type)) {
      setGenerateError('File tanda tangan harus PNG atau JPG.');
      return false;
    }
    if (generateForm.signature.size > 2 * 1024 * 1024) {
      setGenerateError('Ukuran file tanda tangan maksimal 2MB.');
      return false;
    }
    setGenerateError("");
    return true;
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!validateGenerateForm()) return;
    setGenerateLoading(true);
    try {
      const formData = new FormData();
      formData.append('dateIssued', generateForm.dateIssued);
      formData.append('examinerName', generateForm.examinerName);
      formData.append('examinerPosition', generateForm.examinerPosition);
      if (generateForm.signature) formData.append('signature', generateForm.signature);
      const response = await axios.post(`http://localhost:3000/api/excel/generate/${generateModal.cert.id}`, formData, { responseType: 'json' });
      if (response.data.success) {
        setGenerateResult(response.data);
      } else {
        setGenerateResult({ error: response.data.message || 'Gagal generate sertifikat' });
      }
    } catch {
      setGenerateResult({ error: 'Gagal generate sertifikat' });
    }
    setGenerateLoading(false);
  };

  // Download file as blob
  const handleDownloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Gagal download file');
      const contentType = response.headers.get('content-type');
      if (!contentType || (!contentType.includes('pdf') && !contentType.includes('image'))) {
        // Coba baca error message dari response
        let errorMsg = 'Gagal download file';
        try {
          const errorJson = await response.json();
          errorMsg = errorJson.message || errorMsg;
        } catch {
          // ignore
        }
        alert(errorMsg);
        return;
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      alert('Gagal download file');
    }
  };

  // Print PDF
  const handlePrintPDF = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Gagal download PDF');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const printWindow = window.open(blobUrl, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      }
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch {
      alert('Gagal print PDF');
    }
  };

  // Handler untuk buka modal bulk generate
  const openBulkGenerateModal = () => {
    setBulkGenerateForm({ dateIssued: '', examinerName: '', examinerPosition: '', signature: null });
    setBulkGenerateError("");
    setBulkGenerateModal(true);
  };
  const closeBulkGenerateModal = () => {
    setBulkGenerateModal(false);
    setBulkGenerateError("");
  };
  const handleBulkGenerateFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'signature') {
      setBulkGenerateForm(f => ({ ...f, signature: files[0] }));
    } else {
      setBulkGenerateForm(f => ({ ...f, [name]: value }));
    }
  };
  const validateBulkGenerateForm = () => {
    if (!bulkGenerateForm.dateIssued || !bulkGenerateForm.examinerName || !bulkGenerateForm.examinerPosition) {
      setBulkGenerateError('Semua field wajib diisi.');
      return false;
    }
    if (!bulkGenerateForm.signature) {
      setBulkGenerateError('File tanda tangan wajib diupload.');
      return false;
    }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(bulkGenerateForm.signature.type)) {
      setBulkGenerateError('File tanda tangan harus PNG atau JPG.');
      return false;
    }
    if (bulkGenerateForm.signature.size > 2 * 1024 * 1024) {
      setBulkGenerateError('Ukuran file tanda tangan maksimal 2MB.');
      return false;
    }
    setBulkGenerateError("");
    return true;
  };
  const handleBulkGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!validateBulkGenerateForm()) return;
    setBulkGenerateLoading(true);
    try {
      const formData = new FormData();
      formData.append('ids', JSON.stringify(selectedCertificates));
      formData.append('dateIssued', bulkGenerateForm.dateIssued);
      formData.append('examinerName', bulkGenerateForm.examinerName);
      formData.append('examinerPosition', bulkGenerateForm.examinerPosition);
      if (bulkGenerateForm.signature) formData.append('signature', bulkGenerateForm.signature);
      const response = await axios.post('http://localhost:3000/api/excel/generate-multiple-with-data', formData, { responseType: 'json' });
      if (response.data.success) {
        setBulkGenerateResult(response.data.data.files || []);
        setSelectedCertificates([]);
        fetchCertificates();
        closeBulkGenerateModal();
      } else {
        setBulkGenerateError(response.data.message || 'Gagal generate sertifikat massal');
      }
    } catch {
      setBulkGenerateError('Gagal generate sertifikat massal');
    }
    setBulkGenerateLoading(false);
  };

  // Tambahkan handler download zip
  const handleDownloadZip = async (type) => {
    if (!bulkGenerateResult || bulkGenerateResult.length === 0) return;
    const filenames = type === 'pdf'
      ? bulkGenerateResult.map(f => f.pdfFileName)
      : bulkGenerateResult.map(f => f.fileName);
    try {
      const response = await fetch('http://localhost:3000/api/certificates/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames, type })
      });
      if (!response.ok) throw new Error('Gagal download ZIP');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `Zip_${type.toUpperCase()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
    } catch {
      alert('Gagal download ZIP');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Daftar Sertifikat</h2>
          <p className="text-gray-600">Kelola dan generate sertifikat peserta</p>
        </div>
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={16} />
            Filter
          </button>
          
          {selectedCertificates.length > 0 && (
            <button
              onClick={openBulkGenerateModal}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              {selectedCertificates.length} Sertifikat
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kegiatan</label>
              <select
                value={filters.activity}
                onChange={(e) => setFilters(prev => ({ ...prev, activity: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 font-medium shadow-sm hover:border-gray-300"
              >
                <option value="">Semua Kegiatan</option>
                {activities.map((activity, index) => (
                  <option key={index} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Peserta</label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.participantName}
                  onChange={(e) => setFilters(prev => ({ ...prev, participantName: e.target.value }))}
                  placeholder="Cari nama peserta..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 font-medium shadow-sm hover:border-gray-300 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ activity: '', participantName: '' })}
                className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset Filter
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className={`mb-4 p-4 rounded-lg 
          ${successMessage === 'Data berhasil diupdate' ? 'bg-green-50 border border-green-200 text-green-800' : ''}
          ${successMessage === 'Data berhasil dihapus' ? 'bg-red-50 border border-red-200 text-red-800' : ''}
          ${successMessage.startsWith('Gagal') ? 'bg-red-50 border border-red-200 text-red-800' : ''}
        `}>{successMessage}</div>
      )}

      {/* Bulk Generate Result */}
      {bulkGenerateResult && bulkGenerateResult.length > 0 && (
        <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-green-800">Hasil Generate Massal</h4>
            <div className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {bulkGenerateResult.length} sertifikat
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white rounded-lg border border-green-100">
            <button
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => handleDownloadZip('png')}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Semua (ZIP PNG)
            </button>
            <button
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => handleDownloadZip('pdf')}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download Semua (ZIP PDF)
            </button>
          </div>

          <div className="bg-white rounded-lg border border-green-100 max-h-80 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 text-sm">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">Nama Peserta</div>
                <div className="col-span-7 text-center">Aksi</div>
              </div>
            </div>
            <ul className="divide-y divide-gray-100">
              {bulkGenerateResult.map((file, index) => (
                <li key={file.id} className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <span className="font-medium text-gray-900 truncate">{file.participantName}</span>
                      </div>
                    </div>
                    <div className="col-span-7">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
                          onClick={() => handleDownloadFile(`http://localhost:3000${file.pdfUrl}`, `${file.fileName.replace('.png', '.pdf')}`)}
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          PDF
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
                          onClick={() => handleDownloadFile(`http://localhost:3000${file.pngUrl}`, file.fileName)}
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          PNG
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
                          onClick={() => handlePrintPDF(`http://localhost:3000${file.pdfUrl}`)}
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zM5 14H4v-2h1v2zm1 0v2h8v-2H6zm0-1h8V9H6v4z" clipRule="evenodd" />
                          </svg>
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Certificate List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={toggleSelectAll}
                    className="flex items-center"
                  >
                    {selectedCertificates.length === certificates.length ? (
                      <CheckSquare size={16} className="text-blue-600" />
                    ) : (
                      <Square size={16} className="text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((certificate) => (
                <tr key={certificate.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleCertificateSelection(certificate.id)}
                      className="flex items-center"
                    >
                      {selectedCertificates.includes(certificate.id) ? (
                        <CheckSquare size={16} className="text-blue-600" />
                      ) : (
                        <Square size={16} className="text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-gray-900">
                      {certificate.serialNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {certificate.participantName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <FileText size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {certificate.activity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-900">
                      {certificate.companyCode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(certificate)}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Edit Data Peserta"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(certificate.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Hapus Sertifikat"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {certificates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada sertifikat ditemukan</p>
          </div>
        )}
      </div>

      {/* Summary */}
      {certificates.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Total: {certificates.length} sertifikat
          {selectedCertificates.length > 0 && (
            <span className="ml-4 text-blue-600">
              {selectedCertificates.length} dipilih
            </span>
          )}
        </div>
      )}

      {/* Modal Edit Participant */}
      {editModalOpen && (
        <EditParticipantModal
          open={editModalOpen}
          onClose={handleCloseEdit}
          participant={editData}
          onSave={async (form) => {
            try {
              const response = await axios.put(`http://localhost:3000/api/excel/certificates/${editData.id}`, {
                serialNumber: form.serialNumber,
                participantName: form.participantName,
                activity: form.activity,
                companyCode: form.companyCode
              });
              if (response.data.success) {
                setEditModalOpen(false);
                setEditData(null);
                fetchCertificates();
                setSuccessMessage('Data berhasil diupdate');
                setTimeout(() => setSuccessMessage(''), 3000);
              }
            } catch {
              setSuccessMessage('Gagal update data');
              setTimeout(() => setSuccessMessage(''), 3000);
            }
          }}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-40 bg-opacity-40">
            <div className="bg-white rounded-xl shadow-xl border-1 p-6 w-full max-w-sm animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Konfirmasi Hapus</h2>
              <p className="mb-6 text-gray-700">Apakah Anda yakin ingin menghapus data sertifikat ini?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => deleteCertificate(deleteConfirmId)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Modal Generate Sertifikat */}
{generateModal.open && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Generate Sertifikat</h2>

      {/* Form */}
      {!generateResult && (
        <form onSubmit={handleGenerateSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Certificate ID</label>
              <input
                type="text"
                value={generateModal.cert?.serialNumber || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
              <input
                type="date"
                name="dateIssued"
                value={generateForm.dateIssued}
                onChange={handleGenerateFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Examiner Name</label>
              <input
                type="text"
                name="examinerName"
                value={generateForm.examinerName}
                onChange={handleGenerateFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Examiner Position</label>
              <input
                type="text"
                name="examinerPosition"
                value={generateForm.examinerPosition}
                onChange={handleGenerateFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Signature (PNG/JPG, max 2MB)</label>
              <input
                type="file"
                name="signature"
                accept="image/png,image/jpeg"
                onChange={handleGenerateFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                required
              />
            </div>
          </div>

          {generateError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-center">
              {generateError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeGenerateModal}
              className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={generateLoading}
              className={`px-4 py-2 rounded-lg text-white transition ${
                generateLoading
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {generateLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      )}

      {/* Success result */}
      {generateResult && !generateResult.error && (() => {
        const filename = generateResult.data?.filename || 'certificate.jpg';
        const pdfUrl = `/api/certificates/download/${filename}?format=pdf`;
        const pngUrl = `/api/certificates/download/${filename}`;
        return (
          <div className="space-y-6 text-center">
            <div className="text-green-700 font-semibold text-lg">Sertifikat berhasil digenerate!</div>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <button
                onClick={() => handleDownloadFile(pdfUrl, filename.replace(/\.[^.]+$/, '.pdf'))}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Download PDF
              </button>
              <button
                onClick={() => handleDownloadFile(pngUrl, filename.replace(/\.[^.]+$/, '.jpg'))}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Download PNG
              </button>
              <button
                onClick={() => handlePrintPDF(pdfUrl)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-900 transition"
              >
                Print
              </button>
            </div>
            <button
              onClick={closeGenerateModal}
              className="w-full px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
            >
              Tutup
            </button>
          </div>
        );
      })()}

      {/* Error */}
      {generateResult && generateResult.error && (
        <div className="text-red-00 font-semibold mb-4 text-center">{generateResult.error}</div>
      )}
    </div>
  </div>
)}


{/* Modal Bulk Generate Sertifikat */}
{bulkGenerateModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Generate Sertifikat</h2>
            <p className="text-blue-100 mt-1">Buat sertifikat untuk beberapa peserta sekaligus</p>
          </div>
          <button 
            onClick={closeBulkGenerateModal}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleBulkGenerateSubmit} className="space-y-6">
          {/* Certificate Count Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">
                  Total Sertifikat Terpilih
                </label>
                <div className="text-3xl font-bold text-green-700">
                  {selectedCertificates.length}
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Issued */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Issued
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  name="dateIssued" 
                  value={bulkGenerateForm.dateIssued} 
                  onChange={handleBulkGenerateFormChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none" 
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                </div>
              </div>
            </div>

            {/* Examiner Name */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Examiner Name
              </label>
              <input 
                type="text" 
                name="examinerName" 
                value={bulkGenerateForm.examinerName} 
                onChange={handleBulkGenerateFormChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none" 
                placeholder="Masukkan nama penguji"
                required 
              />
            </div>

            {/* Examiner Position */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Examiner Position
              </label>
              <input 
                type="text" 
                name="examinerPosition" 
                value={bulkGenerateForm.examinerPosition} 
                onChange={handleBulkGenerateFormChange} 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none" 
                placeholder="Masukkan jabatan penguji"
                required 
              />
            </div>

            {/* Signature Upload */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Signature
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  name="signature" 
                  accept="image/png,image/jpeg" 
                  onChange={handleBulkGenerateFormChange} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  required 
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: PNG/JPG, maksimal 2MB
              </p>
            </div>
          </div>

          {/* Error Message */}
          {bulkGenerateError && (
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{bulkGenerateError}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={closeBulkGenerateModal} 
              className="flex-1 px-6 py-3 border-2 bg-gradient-to-r from-red-500 to-red-600 text-white border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-black-50 hover:to-red-300 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Batal
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
              disabled={bulkGenerateLoading}
            >
              {bulkGenerateLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Sertifikat
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
</div>
  );
};

export default CertificateList; 