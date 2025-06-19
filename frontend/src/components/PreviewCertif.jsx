import React from 'react';
import { Award } from 'lucide-react';
import certBg from '../assets/page_1.png';

const PreviewCertif = ({ certificateData, isGenerated }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isGenerated ? 'Certificate Generated!' : 'Preview'}
      </h2>
      {isGenerated && certificateData ? (
        <>
          <div className="mb-6 flex justify-center">
            <div className="w-full max-w-2xl relative">
              <img src={certBg} alt="Certificate Background" className="w-full rounded-xl border-4 border-blue-200 shadow-lg" />
            </div>
          </div>
          <div className="flex justify-center">
            <table className="min-w-[350px] max-w-lg w-full mx-auto bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
              <tbody>
                <tr className="even:bg-gray-50">
                  <td className="py-2 px-4 font-semibold text-gray-700 border-b border-gray-100">ID Sertifikat</td>
                  <td className="py-2 px-4 border-b border-gray-100 font-mono">{certificateData.id || certificateData.certificateId}</td>
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
  );
};

export default PreviewCertif;
