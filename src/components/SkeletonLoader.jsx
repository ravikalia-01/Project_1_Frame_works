import React from 'react';
import './skeletonLoader.css';

const SkeletonLoader = ({ type = 'default' }) => {
  if (type === 'resume-builder') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-header">
          <div className="skeleton skeleton-title"></div>
        </div>
        <div className="skeleton-form">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-field">
              <div className="skeleton skeleton-label"></div>
              <div className="skeleton skeleton-input"></div>
            </div>
          ))}
          <div className="skeleton-actions">
            <div className="skeleton skeleton-button"></div>
            <div className="skeleton skeleton-button"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'resume-preview') {
    return (
      <div className="skeleton-container">
        <div className="skeleton-resume">
          <div className="skeleton skeleton-profile"></div>
          <div className="skeleton skeleton-name"></div>
          <div className="skeleton skeleton-section">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton skeleton-line"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-container">
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-text medium"></div>
    </div>
  );
};

export default SkeletonLoader;
