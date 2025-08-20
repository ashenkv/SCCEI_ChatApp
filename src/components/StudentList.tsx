import React, { useState } from "react";
import { Plus, User, MessageCircle, Trash2, Clock } from "lucide-react";
import { Student } from "../types/Chat";

interface StudentListProps {
  students: Student[];
  selectedStudent: Student | null;
  onSelectStudent: (student: Student) => void;
  onAddStudent: (name: string) => void;
  onDeleteConversation: (studentId: string) => void;
}

export function StudentList({
  students,
  selectedStudent,
  onSelectStudent,
  onAddStudent,
  onDeleteConversation,
}: StudentListProps) {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName("");
      setIsAddingStudent(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return date.toLocaleDateString();
  };

  const getUnreadCount = (student: Student) => {
    return student.messages.filter(
      (msg) => !msg.isRead && msg.sender === "student"
    ).length;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {students.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No students yet</p>
            <p className="text-xs mt-1">Add a student to start chatting</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {students.map((student) => {
              const unreadCount = getUnreadCount(student);
              const isSelected = selectedStudent?.id === student.id;

              return (
                <div
                  key={student.id}
                  className={`group relative flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-50 border-2 border-blue-200"
                      : "hover:bg-gray-50 border-2 border-transparent"
                  }`}
                  onClick={() => onSelectStudent(student)}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isSelected ? "bg-blue-200" : "bg-gray-200"
                      }`}
                    >
                      <User
                        className={`h-5 w-5 ${
                          isSelected ? "text-blue-700" : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium truncate ${
                          isSelected ? "text-blue-900" : "text-gray-900"
                        }`}
                      >
                        {student.name}
                      </p>
                      {student.lastMessage && (
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTime(student.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 truncate">
                        {student.lastMessage
                          ? `${
                              student.lastMessage.sender === "teacher"
                                ? "You: "
                                : ""
                            }${student.lastMessage.content}`
                          : "No messages yet"}
                      </p>

                      {unreadCount > 0 && (
                        <span className="flex-shrink-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `Delete conversation with ${student.name}?`
                        )
                      ) {
                        onDeleteConversation(student.id);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
