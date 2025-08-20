import React, { useState } from "react";
import { User, MessageCircle, ArrowRight } from "lucide-react";

interface StudentLoginProps {
  onLogin: (name: string) => void;
}

export function StudentLogin({ onLogin }: StudentLoginProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full p-4 inline-block mb-4">
            <User className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Student Login
          </h1>
          <p className="text-gray-600">
            Enter your name to start chatting with your teacher
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <span>Start Chatting</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-2 text-green-700 mb-2">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Privacy Notice</span>
          </div>
          <p className="text-sm text-green-600">
            Your messages with the teacher are private and will be automatically
            deleted after 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
