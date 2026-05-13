'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { reportAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'bug',
    name: '',
    email: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reportAPI.submitReport(formData);
      setIsSubmitted(true);
      toast.success('Report submitted successfully!');
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-900 to-gray-900 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FiAlertTriangle size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2">Report an Issue</h1>
            <p className="text-gray-300 max-w-lg mx-auto">
              Found a bug, spotted incorrect content, or have general feedback? Let us know so we can improve your experience.
            </p>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <FiCheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Report Received</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Thank you for taking the time to report this to us. Our team will review the details and take appropriate action.
                </p>
                <Button variant="outline" onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ ...formData, description: '' });
                }}>
                  Submit Another Report
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 ml-1">What kind of issue are you reporting?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {[
                      { id: 'bug', label: 'Bug/Error' },
                      { id: 'content', label: 'Content Issue' },
                      { id: 'feedback', label: 'Feedback' },
                      { id: 'other', label: 'Other' },
                    ].map((type) => (
                      <label 
                        key={type.id}
                        className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                          formData.type === type.id 
                            ? 'border-primary-600 bg-primary-50 text-primary-700' 
                            : 'border-gray-200 hover:border-primary-200 text-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type.id}
                          checked={formData.type === type.id}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">Your Name</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 ml-1">Description</label>
                  <textarea
                    required
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="Please describe the issue in detail. If it's a bug, what steps led to it?"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    fullWidth
                    size="lg"
                    icon={FiMessageSquare}
                    iconPosition="right"
                  >
                    Submit Report
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
