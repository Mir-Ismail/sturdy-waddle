import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
    size = 'medium',
    color = 'primary',
    text = '',
    overlay = false,
    fullScreen = false
}) => {
    const spinnerClass = `loading-spinner ${size} ${color} ${overlay ? 'overlay' : ''} ${fullScreen ? 'fullscreen' : ''}`;

    return (
        <div className={spinnerClass}>
            <div className="spinner-container">
                <div className="spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                {text && <p className="loading-text">{text}</p>}
            </div>
        </div>
    );
};

export default LoadingSpinner;
