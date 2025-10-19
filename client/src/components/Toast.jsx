import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './Toast.css';

const Toast = ({
    message,
    type = 'success',
    duration = 3000,
    onClose
}) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FiCheck className="w-5 h-5" />;
            case 'error':
                return <FiX className="w-5 h-5" />;
            case 'warning':
                return <FiAlertCircle className="w-5 h-5" />;
            case 'info':
                return <FiInfo className="w-5 h-5" />;
            default:
                return <FiCheck className="w-5 h-5" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`toast toast-${type}`}
        >
            <div className="toast-content">
                <div className="toast-icon">
                    {getIcon()}
                </div>
                <div className="toast-message">
                    {message}
                </div>
                <button
                    className="toast-close"
                    onClick={onClose}
                    aria-label="Close notification"
                >
                    <FiX className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default Toast;
