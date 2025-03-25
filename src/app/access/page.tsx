'use client';

import { useState } from 'react';
import { useAccessCode } from '@/context/AccessContext';

export default function AccessPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { verifyCode, previousPath } = useAccessCode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCode(code, previousPath)) {
      setError('');
    } else {
      setError('Invalid access code');
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-4">
      <div className="w-full max-w-xl space-y-6">
        <h2 className="text-center text-3xl font-normal">
          Kindly Input Your Trading Access Key
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-transparent border border-gray-800 rounded-xl px-6 py-4 text-white text-lg"
              placeholder="Trading Access Key"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl text-xl font-normal"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}