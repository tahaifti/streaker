import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Send, MessageSquare, Bug, Lightbulb, Sparkles } from 'lucide-react';
import axios from 'axios';

const BASE_URL = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_API_FEEDBACK_BASE_URL,
});

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<'bug' | 'feature' | 'feedback'>('feedback');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ isOpen: boolean; message: string; isSuccess: boolean }>({
    isOpen: false,
    message: '',
    isSuccess: false,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await BASE_URL.post('/submit', {
        type: type,
        message: description,
        email: email
      });

      if (response.data.success) {
        setAlert({
          isOpen: true,
          message: 'Thank you! Your feedback has been submitted successfully. 🎉',
          isSuccess: true,
        });

        // Reset form
        setType('feedback');
        setDescription('');
        setEmail('');
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      setAlert({
        isOpen: true,
        message: 'Oops! Something went wrong. Please try again later.',
        isSuccess: false,
      });
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAlert = () => {
    setAlert({ isOpen: false, message: '', isSuccess: false });
    onClose();
  };

  const getTypeIcon = (feedbackType: string) => {
    switch (feedbackType) {
      case 'bug':
        return <Bug className="w-5 h-5" />;
      case 'feature':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getTypeColor = (feedbackType: string) => {
    switch (feedbackType) {
      case 'bug':
        return 'from-red-500 to-pink-500';
      case 'feature':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-blue-500 to-purple-500';
    }
  };

  return (
    <>
      {/* Main Feedback Modal */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-gray-700/50 animate-fade-in-up">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Share Your Thoughts</h2>
                <p className="text-gray-400 text-sm">Help us improve Streaker</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-white mb-4">
                What would you like to share?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'feedback', label: 'Feedback', icon: MessageSquare },
                  { value: 'feature', label: 'Feature', icon: Lightbulb },
                  { value: 'bug', label: 'Bug Report', icon: Bug }
                ].map((option) => (
                  <label key={option.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      checked={type === option.value}
                      onChange={(e) => setType(e.target.value as typeof type)}
                      className="sr-only"
                    />
                    <div className={`
                      flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300
                      ${type === option.value 
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300' 
                        : 'border-gray-600 bg-gray-700/30 text-gray-400 hover:border-gray-500 hover:bg-gray-600/30'
                      }
                    `}>
                      <option.icon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Tell us more
              </label>
              <div className="relative">
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 border border-gray-600 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={4}
                  placeholder={`Share your ${type === 'bug' ? 'bug report' : type === 'feature' ? 'feature idea' : 'feedback'} with us...`}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {description.length}/500
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Email <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border border-gray-600 rounded-xl bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-500 mt-2">
                We'll only use this to follow up on your feedback
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !description.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 font-semibold text-lg flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Feedback
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success/Error Alert Modal */}
      {alert.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60 p-4 animate-fade-in">
          <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-700/50 animate-bounce-in">
            <div className="flex flex-col items-center space-y-6 text-center">
              {alert.isSuccess ? (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {alert.isSuccess ? 'Thank You!' : 'Oops!'}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">{alert.message}</p>
              </div>
              
              <button
                onClick={closeAlert}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackForm;