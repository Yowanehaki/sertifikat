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
  Calendar,
  User,
  Building
} from 'lucide-react';
import axios from 'axios';
import EditParticipantModal from './EditParticipantModal';

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
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan</label>
              <select
                value={filters.activity}
                onChange={(e) => setFilters(prev => ({ ...prev, activity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Semua Kegiatan</option>
                {activities.map((activity, index) => (
                  <option key={index} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Peserta</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.participantName}
                  onChange={(e) => setFilters(prev => ({ ...prev, participantName: e.target.value }))}
                  placeholder="Cari nama peserta..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ activity: '', participantName: '' })}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset Filter
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
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold mb-2">Hasil Generate Massal:</h4>
          <div className="flex gap-2 mb-2">
            <button
              className="px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              onClick={() => handleDownloadZip('png')}
            >Download Semua (ZIP PNG)</button>
            <button
              className="px-3 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              onClick={() => handleDownloadZip('pdf')}
            >Download Semua (ZIP PDF)</button>
          </div>
          <ul className="space-y-2">
            {bulkGenerateResult.map(file => (
              <li key={file.id} className="flex items-center gap-2">
                <span className="flex-1">{file.participantName}</span>
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => handleDownloadFile(`http://localhost:3000${file.pdfUrl}`, `${file.fileName.replace('.png', '.pdf')}`)}
                >Download PDF</button>
                <button
                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => handleDownloadFile(`http://localhost:3000${file.pngUrl}`, file.fileName)}
                >Download PNG</button>
                <button
                  className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={() => handlePrintPDF(`http://localhost:3000${file.pdfUrl}`)}
                >Print</button>
              </li>
            ))}
          </ul>
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
                  Nama Peserta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kegiatan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Konfirmasi Hapus</h2>
            <p className="mb-6 text-gray-700">Apakah Anda yakin ingin menghapus data sertifikat ini?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={() => deleteCertificate(deleteConfirmId)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Generate Sertifikat */}
      {generateModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Generate Sertifikat</h2>
            {!generateResult && (
              <form onSubmit={handleGenerateSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Certificate ID</label>
                    <input
                      type="text"
                      value={generateModal.cert?.serialNumber || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date Issued</label>
                    <input type="date" name="dateIssued" value={generateForm.dateIssued} onChange={handleGenerateFormChange} className="w-full border rounded px-3 py-2" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Examiner Name</label>
                    <input type="text" name="examinerName" value={generateForm.examinerName} onChange={handleGenerateFormChange} className="w-full border rounded px-3 py-2" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Examiner Position</label>
                    <input type="text" name="examinerPosition" value={generateForm.examinerPosition} onChange={handleGenerateFormChange} className="w-full border rounded px-3 py-2" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Signature (PNG/JPG, max 2MB)</label>
                    <input type="file" name="signature" accept="image/png,image/jpeg" onChange={handleGenerateFormChange} className="w-full" required />
                  </div>
                </div>
                {generateError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-center">{generateError}</div>}
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={closeGenerateModal} className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300">Batal</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={generateLoading}>{generateLoading ? 'Generating...' : 'Generate'}</button>
                </div>
              </form>
            )}
            {generateResult && !generateResult.error && (
              (() => {
                const filename = generateResult.data?.filename || 'certificate.jpg';
                const pdfUrl = `/api/certificates/download/${filename}?format=pdf`;
                const pngUrl = `/api/certificates/download/${filename}`;
                return (
                  <div className="space-y-4 text-center">
                    <div className="text-green-700 font-semibold text-lg">Sertifikat berhasil digenerate!</div>
                    <div className="flex flex-col md:flex-row gap-3 justify-center mt-4">
                      <button
                        onClick={() => handleDownloadFile(pdfUrl, filename.replace(/\.[^.]+$/, '.pdf'))}
                        className="flex-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-center"
                      >Download PDF</button>
                      <button
                        onClick={() => handleDownloadFile(pngUrl, filename.replace(/\.[^.]+$/, '.jpg'))}
                        className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-center"
                      >Download PNG</button>
                      <button
                        onClick={() => handlePrintPDF(pdfUrl)}
                        className="flex-1 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-900"
                      >Print</button>
                    </div>
                    <button onClick={closeGenerateModal} className="mt-4 px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300 w-full">Tutup</button>
                  </div>
                );
              })()
            )}
            {generateResult && generateResult.error && (
              <div className="text-red-700 font-semibold mb-4 text-center">{generateResult.error}</div>
            )}
          </div>
        </div>
      )}

      {/* Modal Bulk Generate Sertifikat */}
      {bulkGenerateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Generate Sertifikat Massal</h2>
            <form onSubmit={handleBulkGenerateSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Sertifikat</label>
                  <input type="text" value={selectedCertificates.length} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date Issued</label>
                  <input type="date" name="dateIssued" value={bulkGenerateForm.dateIssued} onChange={handleBulkGenerateFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Examiner Name</label>
                  <input type="text" name="examinerName" value={bulkGenerateForm.examinerName} onChange={handleBulkGenerateFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Examiner Position</label>
                  <input type="text" name="examinerPosition" value={bulkGenerateForm.examinerPosition} onChange={handleBulkGenerateFormChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Signature (PNG/JPG, max 2MB)</label>
                  <input type="file" name="signature" accept="image/png,image/jpeg" onChange={handleBulkGenerateFormChange} className="w-full" required />
                </div>
              </div>
              {bulkGenerateError && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-center">{bulkGenerateError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeBulkGenerateModal} className="px-4 py-2 rounded border bg-gray-200 hover:bg-gray-300">Batal</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={bulkGenerateLoading}>{bulkGenerateLoading ? 'Generating...' : 'Generate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateList; 