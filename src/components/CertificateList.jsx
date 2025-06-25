import React, { useState, useEffect } from 'react';
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
    participantName: '',
    examinerName: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Debounce filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters]);

  // Fetch certificates and activities
  useEffect(() => {
    fetchCertificates();
    fetchActivities();
  }, [debouncedFilters]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedFilters.activity) params.append('activity', debouncedFilters.activity);
      if (debouncedFilters.participantName) params.append('participantName', debouncedFilters.participantName);
      if (debouncedFilters.examinerName) params.append('examinerName', debouncedFilters.examinerName);
      const response = await axios.get(`http://localhost:3000/api/excel/certificates?${params}`);
      if (response.data.success) {
        setCertificates(response.data.data);
      }
    } catch {
      setError('Gagal mengambil data sertifikat');
    } finally {
      setLoading(false);
    }
  };

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

  // Generate single certificate
  const generateSingleCertificate = async (id) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/excel/generate/${id}`);
      if (response.data.success) {
        // Download the generated certificate
        window.open(`http://localhost:3000/certificates/${response.data.fileName}`, '_blank');
      }
    } catch (err) {
      console.error('Generate certificate error:', err);
      alert('Gagal generate sertifikat');
    }
  };

  // Generate multiple certificates
  const generateMultipleCertificates = async () => {
    if (selectedCertificates.length === 0) {
      alert('Pilih sertifikat yang akan di-generate');
      return;
    }

    try {
      setGenerating(true);
      const response = await axios.post('http://localhost:3000/api/excel/generate-multiple', {
        ids: selectedCertificates
      });

      if (response.data.success) {
        alert(`Berhasil generate ${response.data.data.totalGenerated} sertifikat`);
        setSelectedCertificates([]);
        fetchCertificates(); // Refresh list
      }
    } catch (err) {
      console.error('Generate multiple certificates error:', err);
      alert('Gagal generate sertifikat massal');
    } finally {
      setGenerating(false);
    }
  };

  // Delete certificate
  const deleteCertificate = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) return;

    try {
      const response = await axios.delete(`http://localhost:3000/api/excel/certificates/${id}`);
      if (response.data.success) {
        setCertificates(prev => prev.filter(cert => cert.id !== id));
        setSelectedCertificates(prev => prev.filter(certId => certId !== id));
      }
    } catch (err) {
      console.error('Delete certificate error:', err);
      alert('Gagal menghapus sertifikat');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  // Handler untuk submit edit
  const handleSubmitEdit = async (updatedData) => {
    try {
      // Kirim ke backend
      const response = await axios.put(`http://localhost:3000/api/excel/certificates/${updatedData.id}`, updatedData);
      if (response.data.success) {
        setEditModalOpen(false);
        setEditData(null);
        fetchCertificates();
      }
    } catch {
      alert('Gagal update data');
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
              onClick={generateMultipleCertificates}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              {generating ? 'Generating...' : `Generate ${selectedCertificates.length} Sertifikat`}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Examiner</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.examinerName}
                  onChange={(e) => setFilters(prev => ({ ...prev, examinerName: e.target.value }))}
                  placeholder="Cari nama examiner..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ activity: '', participantName: '', examinerName: '' })}
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
                  Nama Peserta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kegiatan
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Terbit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Examiner
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
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {formatDate(certificate.dateIssued)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Building size={16} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {certificate.examinerName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {certificate.examinerPosition}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => generateSingleCertificate(certificate.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Generate Sertifikat"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(certificate)}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Edit Data Peserta"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteCertificate(certificate.id)}
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
          data={editData}
          onSubmit={handleSubmitEdit}
        />
      )}
    </div>
  );
};

export default CertificateList; 