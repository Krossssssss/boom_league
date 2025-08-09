import React, { useState } from 'react';
import { LucideShield, LucideX, LucideAlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}) => {
  const { theme } = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Check password
    if (password === 'kross') {
      onConfirm();
      handleClose();
    } else {
      setError('Incorrect password. Access denied.');
      setPassword('');
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${
        theme === 'dark' 
          ? 'bg-gray-800/95 border-gray-700/50' 
          : 'bg-white/95 border-gray-200/50'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-red-500/20 border-red-500/30' 
                : 'bg-red-100 border-red-200'
            } border`}>
              <LucideShield className="text-red-500" size={20} />
            </div>
            <h2 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <LucideX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className={`flex items-start gap-3 p-4 rounded-lg mb-6 ${
            theme === 'dark'
              ? 'bg-yellow-500/10 border-yellow-500/20'
              : 'bg-yellow-50 border-yellow-200'
          } border`}>
            <LucideAlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className={`font-medium mb-1 ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'
              }`}>
                Destructive Action
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-yellow-300/80' : 'text-yellow-700'
              }`}>
                {message}
              </p>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-white/90' : 'text-gray-700'
              }`}>
                Enter Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to confirm"
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/30 transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 text-white border-gray-600 placeholder-gray-400'
                    : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                } ${error ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <LucideX size={14} />
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900'
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? 'bg-red-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                } text-white`}
                disabled={isSubmitting || !password.trim()}
              >
                {isSubmitting ? 'Verifying...' : 'Confirm Delete'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
