import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import FormGenerator from './components/FormGenerator';
import Validation from './components/Validation';
import PreviewCertif from './components/PreviewCertif';
import ExportCertif from './components/ExportCertif';
import BulkCertificateManager from './components/BulkCertificateManager';
import { generateCertificate, downloadCertificate, revokeObjectURL } from './services/api';
import { FileText, Upload, Home, Menu } from 'lucide-react';
import NavigationMenu from './components/ui/NavigationMenu';

function SingleCertificateApp() {
  const [formData, setFormData] = useState({
    id: '',
    participantName: '',
    activity: '',
    dateIssued: '',
    signaturePath: '',
    examinerName: '',
    examinerPosition: '',
    companyCode: ''
  });
  const [showValidation, setShowValidation] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleShowValidation = () => {
    setShowValidation(true);
  };

  const handleCancelValidation = () => {
    setShowValidation(false);
  };

  const handleConfirmGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      setError('');
      const response = await generateCertificate(formData);
      
      if (response.success) {
        setCertificateData({
          ...formData,
          ...response.data,
          previewUrl: `http://localhost:3000/certificates/${response.data.filename}`
        });
        setShowValidation(false);
        setShowPreview(true);
      } else {
        throw new Error(response.error || 'Failed to generate certificate');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message);
    }
    setIsGenerating(false);
  };

  const handleBackToForm = () => {
    setFormData({
      id: '',
      participantName: '',
      activity: '',
      dateIssued: '',
      signaturePath: '',
      examinerName: '',
      examinerPosition: '',
      companyCode: ''
    });
    setError('');
    setShowPreview(false);
    setCertificateData(null);
  };

  const handleDownloadPDF = async () => {
    try {
      if (!certificateData?.filename) return;
      const result = await downloadCertificate(certificateData.filename, 'pdf');
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `certificate_${certificateData.participantName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      revokeObjectURL(result.url);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      if (!certificateData?.filename) return;
      const result = await downloadCertificate(certificateData.filename, 'png');
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `certificate_${certificateData.participantName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      revokeObjectURL(result.url);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-white to-red-900 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center mb-8">
        </div>
        {!showPreview && (
          <FormGenerator
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleShowValidation}
            isGenerating={isGenerating}
            error={error}
            onReset={handleBackToForm}
          />
        )}
        {showValidation && (
          <Validation
            formData={formData}
            onConfirm={handleConfirmGenerate}
            onCancel={handleCancelValidation}
            error={error}
            loading={isGenerating}
          />
        )}
        {showPreview && (
          <>
            <PreviewCertif certificateData={certificateData} isGenerated={!!certificateData} />
            <ExportCertif
              onDownloadPDF={handleDownloadPDF}
              onDownloadPNG={handleDownloadPNG}
              isGenerated={!!certificateData}
              previewUrl={certificateData?.previewUrl}
              onBackToForm={handleBackToForm}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-white to-red-900">
        <NavigationMenu />
        <Routes>
          <Route path="/" element={<SingleCertificateApp />} />
          <Route path="/bulk" element={<BulkCertificateManager />} />
        </Routes>
      </div>
    </Router>
  );
}
