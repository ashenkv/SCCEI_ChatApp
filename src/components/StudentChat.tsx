import React, { useState, useEffect, useRef } from "react";
import { Send, User, Clock, MessageCircle, LogOut } from "lucide-react";
import { ChatStorage } from "../utils/ChatStorage";
import { Student, Message } from "../types/Chat";

interface StudentChatProps {
  studentName: string;
  onSendMessage: (content: string) => void;
}

export function StudentChat({ studentName, onSendMessage }: StudentChatProps) {
  const [message, setMessage] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStudentData = () => {
      const students = ChatStorage.getStudents();
      const currentStudent = students.find((s) => s.name === studentName);
      if (currentStudent) {
        setStudent(currentStudent);
        ChatStorage.markTeacherMessagesAsRead(currentStudent.id);
      }
    };

    loadStudentData();

    const interval = setInterval(loadStudentData, 2000);

    return () => clearInterval(interval);
  }, [studentName]);

  useEffect(() => {
    scrollToBottom();
  }, [student?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
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

  const handleLogout = () => {
    window.location.href = window.location.pathname;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col">
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{studentName}</h1>
              <p className="text-sm text-gray-500">Chat with Teacher</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!student || student.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">
                Send a message to start the conversation with your teacher
              </p>
            </div>
          </div>
        ) : (
          <>
            {student.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "student" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === "student"
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div
                    className={`flex items-center justify-between mt-2 text-xs ${
                      msg.sender === "student"
                        ? "text-green-100"
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
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            placeholder="Type your message to teacher..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
