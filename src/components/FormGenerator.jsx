import React from 'react';
import { User, Calendar, BookOpen, UserCheck, Loader, Award } from 'lucide-react';

const FormGenerator = ({ formData, onInputChange, onSubmit, isGenerating, error, onReset }) => {
  const validateForm = () => {
    const requiredFields = [
      'id', 
      'participantName', 
      'activity', 
      'dateIssued', 
      'examinerName', 
      'examinerPosition', 
      'companyCode'
    ];
    
    const emptyFields = requiredFields.filter(field => !formData[field]);
    if (emptyFields.length > 0) {
      return `Please fill in all required fields: ${emptyFields.join(', ')}`;
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" />
        Certificate Details
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID Sertifikat
          </label>
          <input
            type="text"
            name="id"
            value={formData.id || ''}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Masukkan ID Sertifikat"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Participant Name
          </label>
          <input
            type="text"
            name="participantName"
            value={formData.participantName}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter participant's full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="w-4 h-4 inline mr-2" />
            Activity
          </label>
          <input
            type="text"
            name="activity"
            value={formData.activity}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., Workshop, Seminar, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date Issued
          </label>
          <input
            type="date"
            name="dateIssued"
            value={formData.dateIssued}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature (optional)
          </label>
          <input
            type="file"
            name="signaturePath"
            accept="image/*"
            onChange={onInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserCheck className="w-4 h-4 inline mr-2" />
            Examiner Name
          </label>
          <input
            type="text"
            name="examinerName"
            value={formData.examinerName}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter examiner's name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Examiner Position
          </label>
          <input
            type="text"
            name="examinerPosition"
            value={formData.examinerPosition}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter examiner's position"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Code
          </label>
          <input
            type="text"
            name="companyCode"
            value={formData.companyCode}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter company code"
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Award className="w-5 h-5" />
                Generate Certificate
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormGenerator;