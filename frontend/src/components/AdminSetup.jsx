import React, { useState } from 'react';
import { VotingAPI } from '../services/api';
import PhotoUpload from './PhotoUpload';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    statements: ['', '', ''],
    correctAnswer: 0,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const api = new VotingAPI();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('photo', formData.photo);
      formDataToSend.append('statements', JSON.stringify(formData.statements));
      formDataToSend.append('correctAnswer', formData.correctAnswer.toString());

      const response = await api.createGame(formDataToSend);

      if (response.success) {
        setResult(response);
      } else {
        alert('Error creating game');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating game');
    } finally {
      setLoading(false);
    }
  };

  const updateStatement = (index, value) => {
    const newStatements = [...formData.statements];
    newStatements[index] = value;
    setFormData({ ...formData, statements: newStatements });
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold text-testio-blue mb-6">
            Game Created Successfully!
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voting URL (Share with employees):
              </label>
              <div className="input-field bg-gray-50">{result.votingUrl}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results URL (For live tracking):
              </label>
              <div className="input-field bg-gray-50">{result.resultsUrl}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Secret (Save this to reveal answer):
              </label>
              <div className="input-field bg-gray-50 font-mono text-sm">
                {result.adminSecret}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setResult(null);
              setFormData({
                name: '',
                photo: null,
                statements: ['', '', ''],
                correctAnswer: 0,
              });
            }}
            className="btn-secondary mt-6"
          >
            Create Another Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-testio-blue mb-6">
          Create New Game
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="candidate-name" className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Name
            </label>
            <input
              id="candidate-name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              required
            />
          </div>

          <PhotoUpload
            onPhotoSelect={photo => setFormData({ ...formData, photo })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Three Statements (2 truths, 1 lie)
            </label>
            {formData.statements.map((statement, index) => (
              <div key={index} className="mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    id={`lie-option-${index}`}
                    type="radio"
                    name="correctAnswer"
                    checked={formData.correctAnswer === index}
                    onChange={() =>
                      setFormData({ ...formData, correctAnswer: index })
                    }
                    className="text-testio-blue"
                  />
                  <label htmlFor={`lie-option-${index}`} className="text-sm text-gray-600">
                    This is the lie
                  </label>
                </div>
                <textarea
                  value={statement}
                  onChange={e => updateStatement(index, e.target.value)}
                  className="input-field w-full mt-1"
                  rows="2"
                  placeholder={`Statement ${index + 1}...`}
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !formData.photo ||
              !formData.name ||
              formData.statements.some(s => !s.trim())
            }
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Creating Game...' : 'Create Game'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSetup;
