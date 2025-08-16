import React, { useState } from 'react';

const AskQuestionTab = ({ setQuestions, setActiveTab }) => {
  const [newQuestion, setNewQuestion] = useState({ question: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newQuestion.question.trim() === '' || newQuestion.email.trim() === '') return;
    
    const question = {
      id: Date.now(),
      question: newQuestion.question,
      answer: "We'll respond to your question shortly",
      date: "just now",
      author: "You"
    };
    
    setQuestions(prev => [question, ...prev]);
    setNewQuestion({ question: '', email: '' });
    setActiveTab('questions');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Ask a Question</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Your Question *</label>
          <textarea 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            rows="4"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            placeholder="Type your question here..."
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Your Email *</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={newQuestion.email}
            onChange={(e) => setNewQuestion({...newQuestion, email: e.target.value})}
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <button 
            type="button"
            className="px-6 py-2 border border-gray-800 rounded-full text-gray-800 font-medium hover:bg-gray-100 transition"
            onClick={() => setActiveTab('questions')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
          >
            Submit Question
          </button>
        </div>
      </div>
    </form>
  );
};

export default AskQuestionTab;