import React, { useState } from 'react';

const Validation = ({ formData, onConfirm, onCancel, error }) => {
  const [triedSubmit, setTriedSubmit] = useState(false);
  const requiredFields = ['id', 'participantName', 'activity', 'dateIssued', 'examinerName', 'examinerPosition', 'companyCode'];
  const emptyFields = requiredFields.filter((key) => !formData[key]);

  const handleConfirm = () => {
    setTriedSubmit(true);
    if (emptyFields.length === 0) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Konfirmasi Generate Sertifikat</h2>
        <div className="mb-4 text-gray-700">
          Apakah Anda yakin ingin generate sertifikat dengan data ini?
        </div>
        {triedSubmit && emptyFields.length > 0 && (
          <div className="mb-2 text-red-500">Masih ada field yang kosong!</div>
        )}
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <div className="flex gap-4 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
};

export default Validation; 