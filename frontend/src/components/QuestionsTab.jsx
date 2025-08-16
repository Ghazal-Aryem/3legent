import React, { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const QuestionsTab = ({ questions, setActiveTab }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">Have a question about this product?</p>
          <button 
            className="px-6 py-2 bg-gray-900 text-white rounded-full flex items-center gap-2 hover:bg-gray-800 transition"
            onClick={() => setActiveTab('ask-question')}
          >
            <FiMessageSquare />
            <span>Ask Question</span>
          </button>
        </div>
      </div>
      
      {questions.map((q) => (
        <div key={q.id} className="pb-6 border-b border-gray-200">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{q.question}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">Asked by {q.author} • {q.date}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg mt-3">
            <p className="text-gray-700">{q.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsTab;