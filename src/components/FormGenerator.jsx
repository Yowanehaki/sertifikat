import React from 'react';
import { User, Calendar, BookOpen, UserCheck, Loader, Award, Upload, Building2, FileText } from 'lucide-react';

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
    <div onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" />
        Certificate Details
      </h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-100 rounded flex items-center justify-center">
              <FileText className="w-2.5 h-2.5 text-indigo-600" />
            </div>
            Certificate ID
          </label>
          <input
            type="text"
            name="id"
            value={formData.id || ''}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter the Certificate ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded flex items-center justify-center">
              <User className="w-2.5 h-2.5 text-green-600" />
            </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
              <BookOpen className="w-2.5 h-2.5 text-purple-600" />
            </div>
            Activity
          </label>
          <input
            type="text"
            name="activity"
            value={formData.activity}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., Workshop, Activity, etc."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 rounded flex items-center justify-center">
              <Calendar className="w-2.5 h-2.5 text-orange-600" />
            </div>
            Date Issued
          </label>
          <input
            type="date"
            name="dateIssued"
            value={formData.dateIssued}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder=""
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-100 rounded flex items-center justify-center">
              <Upload className="w-2.5 h-2.5 text-pink-600" />
            </div>
            Signature
          </label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50">
            <input
              type="file"
              name="signaturePath"
              accept="image/*"
              onChange={onInputChange}
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-600">Click to upload signature</p>
              <p className="text-xs text-gray-400 mt-1">PNG</p>
            </div>
          </div>
          {formData.signaturePath && (
            <div className="mt-2 text-sm text-gray-600">
              File: {typeof formData.signaturePath === 'string' 
                ? formData.signaturePath 
                : formData.signaturePath.name}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-4 h-4 bg-teal-100 rounded flex items-center justify-center">
              <UserCheck className="w-2.5 h-2.5 text-teal-600" />
            </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-100 rounded flex items-center justify-center">
              <Building2 className="w-2.5 h-2.5 text-cyan-600" />
            </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 rounded flex items-center justify-center">
              <Building2 className="w-2.5 h-2.5 text-amber-600" />
            </div>
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
            onClick={handleSubmit}
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
    </div>
  );
};

export default FormGenerator;