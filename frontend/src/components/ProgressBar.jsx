import React from 'react';

const ProgressBar = ({ percentage, isCorrectAnswer = false }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className={`h-4 rounded-full transition-all duration-500 ease-out ${
          isCorrectAnswer
            ? 'bg-red-500'
            : 'bg-gradient-to-r from-testio-teal to-testio-blue'
        }`}
        style={{
          width: `${percentage}%`,
          minWidth: percentage > 0 ? '8px' : '0px',
        }}
      />
    </div>
  );
};

export default ProgressBar;
