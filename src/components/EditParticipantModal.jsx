import React, { useState, useEffect } from 'react';
import useModalScroll from './ui/useModalScroll';

const EditParticipantModal = ({ open, onClose, participant, onSave }) => {
  const [form, setForm] = useState({
    serialNumber: '',
    participantName: '',
    activity: '',
    companyCode: ''
  });

  useEffect(() => {
    if (participant) {
      setForm({
        serialNumber: participant.serialNumber || '',
        participantName: participant.participantName || '',
        activity: participant.activity || '',
        companyCode: participant.companyCode || ''
      });
    }
  }, [participant]);

  useModalScroll(open);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl border-1 w-full max-w-lg max-h-screen overflow-y-auto">
    {/* Header */}
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Participant</h2>
          <p className="text-indigo-100 mt-1">Update participant information</p>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Certificate ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Certificate ID
          </label>
          <div className="relative">
            <input
              type="text"
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none font-mono text-sm"
              placeholder="Enter certificate ID"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Participant Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Participant Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="participantName"
              value={form.participantName}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
              placeholder="Enter participant name"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Activity
          </label>
          <div className="relative">
            <input
              type="text"
              name="activity"
              value={form.activity}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
              placeholder="Enter activity name"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Company Code */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Company Code
          </label>
          <div className="relative">
            <input
              type="text"
              name="companyCode"
              value={form.companyCode}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
              placeholder="Enter company code"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 bg-gradient-to-r from-red-500 to-red-500 border-gray-300 text-white-700 font-semibold rounded-xl hover:from-red-500 hover:to-white hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-green-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  );
};

export default EditParticipantModal; 