import React, { useState } from 'react';
import { Award, X } from 'lucide-react';

const PreviewCertif = ({ certificateData, isGenerated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isGenerated ? 'Certificate Generated!' : 'Preview'}
        </h2>
        {isGenerated && certificateData ? (
          <>
            <div className="mb-6 flex justify-center">
              <div className="w-full max-w-2xl relative">
                {certificateData.previewUrl ? (
                  <div className="relative group">
                    <img
                      src={certificateData.previewUrl}
                      alt="Generated Certificate"
                      className="w-full rounded-xl border-4 border-blue-200 shadow-lg cursor-pointer transition-transform group-hover:scale-105 group-hover:brightness-75"
                      onClick={handleImageClick}
                      style={{ transition: 'filter 0.2s, transform 0.2s' }}
                    />
                    {/* Remove the overlay box, only keep the text on hover at the bottom */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded bg-white bg-opacity-90 text-gray-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow">
                      Click to view full size
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Loading preview...</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <table className="min-w-[350px] max-w-lg w-full mx-auto bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
                <tbody>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">ID Sertifikat</td>
                    <td className="py-2 px-4 border-b border-gray-100 font-mono">
                      {certificateData.id}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Nama Peserta</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.participantName}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Aktivitas</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.activity}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Tanggal Terbit</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.dateIssued}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Examiner</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.examinerName}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Jabatan</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.examinerPosition}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">Company Code</td>
                    <td className="py-2 px-4 border-b border-gray-100">{certificateData.companyCode}</td>
                  </tr>
                  {certificateData.signaturePath && (
                    <tr className="even:bg-gray-50">
                      <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100 align-top">Signature</td>
                      <td className="py-2 px-4 border-b border-gray-100">
                        {typeof certificateData.signaturePath === 'string' ? (
                          certificateData.signaturePath
                        ) : (
                          <img
                            src={URL.createObjectURL(certificateData.signaturePath)}
                            alt="Signature"
                            className="h-12 object-contain border rounded bg-white mt-1"
                          />
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to Generate</h3>
            <p className="text-gray-600">
              Fill in the form details and click "Generate Certificate" to create your professional certificate.
            </p>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-6xl max-h-full w-full bg-transparent rounded-none shadow-none border-none p-0 animate-fadeIn flex items-center justify-center"
            onClick={e => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10 flex items-center justify-center w-12 h-12"
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            {/* Certificate Image */}
            <div className="max-h-full overflow-auto p-0 bg-transparent rounded-none border-none shadow-none flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={certificateData.previewUrl}
                  alt="Certificate Full Size"
                  className={`block m-0 border-0 bg-transparent p-0 select-none transition-transform duration-200 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'max-w-full max-h-[calc(100vh-4rem)] cursor-zoom-in'}`}
                  style={{ background: 'transparent', padding: 0, margin: 0, border: 0, boxShadow: 'none' }}
                  onClick={e => {
                    e.stopPropagation();
                    setIsZoomed(prev => !prev);
                  }}
                  draggable={false}
                />
                {/* Zoom controls */}
                <button
                  className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white rounded-full p-2 shadow-lg hover:bg-opacity-80 transition z-20"
                  onClick={e => {
                    e.stopPropagation();
                    setIsZoomed(prev => !prev);
                  }}
                  aria-label="Zoom"
                >
                  {isZoomed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewCertif;