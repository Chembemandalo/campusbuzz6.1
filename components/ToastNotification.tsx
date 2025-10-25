import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { XCircleIcon } from './icons';

interface ToastNotificationProps {
  notification: Notification | null;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    // Allow time for fade-out animation before calling onClose to clear the notification from state
    setTimeout(() => {
        onClose();
    }, 300);
  };

  if (!notification) {
    return null;
  }

  return (
    <div className={`fixed bottom-5 right-5 w-full max-w-sm z-50 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="bg-white rounded-lg shadow-2xl p-4">
        <div className="flex items-start">
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">New Notification</p>
            <p className="mt-1 text-sm text-gray-600">{notification.text}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification;
