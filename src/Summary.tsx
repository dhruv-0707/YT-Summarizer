import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Summary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const summaryData = location.state;

  if (!summaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No summary data available. Please go back and try again.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">{summaryData.title}</h1>
        <p className="text-gray-600 mb-4">{summaryData.summary}</p>
        {/* {summaryData.description && (
          <p className="text-gray-800 mb-4">
            <strong>Description:</strong> {summaryData.description}
          </p>
        )} */}
        {summaryData.topics.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Topics:</h2>
            <ul className="list-disc list-inside">
              {summaryData.topics.map((topic: string, index: number) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Summary;
