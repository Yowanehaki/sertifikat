import { useState } from 'react';
import FormGenerator from './components/FormGenerator';
import Validation from './components/Validation';
import PreviewCertif from './components/PreviewCertif';
import ExportCertif from './components/ExportCertif';

export default function App() {
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

  const handleConfirmGenerate = () => {
    setCertificateData({
      ...formData,
      certificateId: formData.id || 'DUMMY-CERT-123',
      validationId: 'VALID-456789',
    });
    setShowValidation(false);
    setShowPreview(true);
  };

  const handleReset = () => {
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

  const handleDownloadPDF = () => {
    alert('Download certificate PDF (simulasi, backend nanti)');
  };

  const handleDownloadPNG = () => {
    alert('Download certificate PNG (simulasi, backend nanti)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Certificate Generator</h1>
          <p className="text-gray-600 text-lg">Create professional certificates with ease</p>
        </div>
        {!showPreview && (
          <FormGenerator
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleShowValidation}
            isGenerating={false}
            error={error}
            onReset={handleReset}
          />
        )}
        {showValidation && (
          <Validation
            formData={formData}
            onConfirm={handleConfirmGenerate}
            onCancel={handleCancelValidation}
            error={error}
          />
        )}
        {showPreview && (
          <>
            <PreviewCertif certificateData={certificateData} isGenerated={!!certificateData} />
            <ExportCertif
              onDownloadPDF={handleDownloadPDF}
              onDownloadPNG={handleDownloadPNG}
              isGenerated={!!certificateData}
            />
          </>
        )}
      </div>
    </div>
  );
}
