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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-4 sm:px-0">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 max-w-md w-full mx-4 sm:mx-0">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Confirm Generate Certificate</h2>
        <div className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-700">
        Are you sure you want to generate a certificate with this data?
        </div>
        {triedSubmit && emptyFields.length > 0 && (
          <div className="mb-2 text-sm sm:text-base text-red-500">Masih ada field yang kosong!</div>
        )}
        {error && <div className="mb-2 text-sm sm:text-base text-red-500">{error}</div>}
        <div className="flex gap-3 sm:gap-4 justify-end mt-4 sm:mt-6">
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
};

export default Validation;