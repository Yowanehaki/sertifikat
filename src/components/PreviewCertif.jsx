import React from 'react';
import { Award } from 'lucide-react';

const PreviewCertif = ({ certificateData, isGenerated }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
        {isGenerated ? 'Certificate Generated!' : 'Preview'}
      </h2>
      {isGenerated && certificateData ? (
        <>
          <div className="mb-4 sm:mb-6 flex justify-center">
            <div className="w-full max-w-2xl relative">
              {certificateData.previewUrl ? (
                <img
                  src={certificateData.previewUrl}
                  alt="Generated Certificate"
                  className="w-full rounded-xl border-2 sm:border-4 border-blue-200 shadow-lg"
                />
              ) : (
                <div className="w-full h-48 sm:h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Loading preview...</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full sm:min-w-[350px] sm:max-w-lg mx-auto bg-white border border-gray-200 rounded-lg shadow">
                <tbody className="divide-y divide-gray-200">
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base text-gray-700">ID Sertifikat</td>
                    <td className="py-2 px-3 sm:px-4 text-sm sm:text-base font-mono break-all">
                      {certificateData.id}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base text-gray-700">Nama Peserta</td>
                    <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">{certificateData.participantName}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base text-gray-700">Aktivitas</td>
                    <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">{certificateData.activity}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base text-gray-700">Tanggal Terbit</td>
                    <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">{certificateData.dateIssued}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base text-gray-700">Examiner</td>
                    <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">{certificateData.examinerName}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base text-gray-700">Jabatan</td>
                    <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">{certificateData.examinerPosition}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base text-gray-700">Company Code</td>
                    <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">{certificateData.companyCode}</td>
                  </tr>
                  {certificateData.signaturePath && (
                    <tr className="even:bg-gray-50">
                      <td className="py-2 px-3 sm:px-4 font-semibold text-sm sm:text-base text-gray-700 align-top">Signature</td>
                      <td className="py-2 px-3 sm:px-4 text-sm sm:text-base">
                        {typeof certificateData.signaturePath === 'string' ? (
                          <span className="break-all">{certificateData.signaturePath}</span>
                        ) : (
                          <img
                            src={URL.createObjectURL(certificateData.signaturePath)}
                            alt="Signature"
                            className="h-10 sm:h-12 object-contain border rounded bg-white mt-1"
                          />
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">Ready to Generate</h3>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Fill in the form details and click "Generate Certificate" to create your professional certificate.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewCertif;
