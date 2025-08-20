import React, { useState, useRef, useEffect } from "react";
import { Send, User, Clock, MessageSquare } from "lucide-react";
import { Student } from "../types/Chat";

interface ChatInterfaceProps {
  student: Student;
  onSendMessage: (content: string) => void;
  onSimulateStudentMessage: (content: string) => void;
}

export function ChatInterface({
  student,
  onSendMessage,
  onSimulateStudentMessage,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [studentMessage, setStudentMessage] = useState("");
  const [showSimulator, setShowSimulator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [student.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      messageInputRef.current?.focus();
    }
  };

  const handleSimulateMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentMessage.trim()) {
      onSimulateStudentMessage(studentMessage.trim());
      setStudentMessage("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getTimeUntilExpiry = (timestamp: Date) => {
    const now = new Date();
    const expiryTime = new Date(timestamp.getTime() + 24 * 60 * 60 * 1000);
    const remaining = expiryTime.getTime() - now.getTime();
    const hoursRemaining = Math.floor(remaining / (1000 * 60 * 60));
    const minutesRemaining = Math.floor(
      (remaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (hoursRemaining > 0) {
      return `${hoursRemaining}h ${minutesRemaining}m`;
    }
    return `${minutesRemaining}m`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="hidden md:block bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {student.name}
              </h2>
              <p className="text-sm text-gray-500">
                {student.messages.length} message
                {student.messages.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSimulator && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Student Message Simulator
            </span>
          </div>
          <form onSubmit={handleSimulateMessage} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message as the student..."
              value={studentMessage}
              onChange={(e) => setStudentMessage(e.target.value)}
              className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
            />
            <button
              type="submit"
              disabled={!studentMessage.trim()}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send as Student
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {student.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">
                Send a message to start the conversation with {student.name}
              </p>
            </div>
          </div>
        ) : (
          <>
            {student.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "teacher" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === "teacher"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div
                    className={`flex items-center justify-between mt-2 text-xs ${
                      msg.sender === "teacher"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    <span>{formatTime(msg.timestamp)}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{getTimeUntilExpiry(msg.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            ref={messageInputRef}
            type="text"
            placeholder={`Message ${student.name}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-2 text-xs text-center text-gray-500">
          Messages will be automatically deleted after 24 hours
        </div>
      </div>
    </div>
  );
}
