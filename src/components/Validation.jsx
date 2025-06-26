import React, { useState } from 'react';
import useModalScroll from './ui/useModalScroll';

const Validation = ({ formData, onConfirm, onCancel, error, loading }) => {
  const [triedSubmit, setTriedSubmit] = useState(false);
  useModalScroll(true);
  
  const validateForm = () => {
    const requiredFields = [
      { field: 'id', label: 'Certificate ID' },
      { field: 'participantName', label: 'Participant Name' },
      { field: 'activity', label: 'Activity' },
      { field: 'dateIssued', label: 'Date Issued' },
      { field: 'examinerName', label: 'Examiner Name' },
      { field: 'examinerPosition', label: 'Examiner Position' },
      { field: 'companyCode', label: 'Company Code' }
    ];
    
    return requiredFields.filter(({ field }) => !formData[field] || formData[field].trim() === '');
  };
  
  const emptyFields = validateForm();

  const handleConfirm = () => {
    setTriedSubmit(true);
    if (emptyFields.length === 0 && !loading) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50 px-4 sm:px-0">
      <div className="bg-white rounded-xl shadow-2xl border-1 p-4 sm:p-8 max-w-md w-full mx-4 sm:mx-0">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Confirm Generate Certificate</h2>
        <div className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-700">
        Are you sure you want to generate a certificate with this data?
        </div>
        {triedSubmit && emptyFields.length > 0 && (
          <div className="mb-2 text-sm sm:text-base text-red-500">
            Please complete all required fields
          </div>
        )}
        {error && <div className="mb-2 text-sm sm:text-base text-red-500">{error}</div>}
        <div className="flex gap-3 sm:gap-4 justify-end mt-4 sm:mt-6">
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Ya'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Validation;