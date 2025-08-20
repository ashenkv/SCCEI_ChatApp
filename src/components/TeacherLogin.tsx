import React, { useState } from "react";
import { User, ArrowRight } from "lucide-react";

interface TeacherLoginProps {
  onSuccess: () => void;
}

export function TeacherLogin({ onSuccess }: TeacherLoginProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed === "logTeacher") {
      setError("");
      onSuccess();
      return;
    }
    setError("Invalid ID.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full p-4 inline-block mb-4">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Teacher Login
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Teacher ID
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
              required
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
