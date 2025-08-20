import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  Users,
  Clock,
  Trash2,
  QrCode,
  User,
} from "lucide-react";
import { ChatInterface } from "./components/ChatInterface";
import { StudentList } from "./components/StudentList";
import { StudentLogin } from "./components/StudentLogin";
import { TeacherLogin } from "./components/TeacherLogin";
import { StudentChat } from "./components/StudentChat";
import { QRCodeGenerator } from "./components/QRCodeGenerator";
import { ChatStorage } from "./utils/ChatStorage";
import { Message, Student } from "./types/Chat";
import blueLogo from "./resource/blueLogo.png";

function App() {
  const [userType, setUserType] = useState<"teacher" | "student" | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] =
    useState<boolean>(false);

  const [showQRCode, setShowQRCode] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const name = urlParams.get("name");

    if (mode === "student" && name) {
      setUserType("student");
      setStudentName(decodeURIComponent(name));
      const existingStudents = ChatStorage.getStudents();
      const existingStudent = existingStudents.find(
        (s) => s.name === decodeURIComponent(name)
      );
      if (!existingStudent) {
        ChatStorage.addStudent(decodeURIComponent(name));
      }
    }

    const savedStudents = ChatStorage.getStudents();
    setStudents(savedStudents);

    ChatStorage.cleanupOldMessages();

    const cleanupInterval = setInterval(() => {
      ChatStorage.cleanupOldMessages();
      const updatedStudents = ChatStorage.getStudents();
      setStudents(updatedStudents);
    }, 60 * 60 * 1000); 

    return () => clearInterval(cleanupInterval);
  }, []);

  const handleStudentLogin = (name: string) => {
    setStudentName(name);
    setUserType("student");

    const existingStudents = ChatStorage.getStudents();
    const existingStudent = existingStudents.find((s) => s.name === name);
    if (!existingStudent) {
      ChatStorage.addStudent(name);
    }

    const newUrl = `${window.location.origin}${
      window.location.pathname
    }?mode=student&name=${encodeURIComponent(name)}`;
    window.history.replaceState({}, "", newUrl);
  };

  const handleTeacherLogin = () => {
    setUserType("teacher");
    setIsTeacherAuthenticated(false);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleAddStudent = (name: string) => {
    const newStudent = ChatStorage.addStudent(name);
    const updatedStudents = ChatStorage.getStudents();
    setStudents(updatedStudents);
    setSelectedStudent(newStudent);
    setIsMobileMenuOpen(false);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedStudent) return;

    ChatStorage.addMessage(selectedStudent.id, {
      id: Date.now().toString(),
      content,
      sender: "teacher",
      timestamp: new Date(),
      isRead: true,
    });

    const updatedStudents = ChatStorage.getStudents();
    setStudents(updatedStudents);

    const updatedSelectedStudent = updatedStudents.find(
      (s) => s.id === selectedStudent.id
    );
    if (updatedSelectedStudent) {
      setSelectedStudent(updatedSelectedStudent);
    }
  };

  const handleSimulateStudentMessage = (content: string) => {
    if (!selectedStudent) return;

    ChatStorage.addMessage(selectedStudent.id, {
      id: Date.now().toString(),
      content,
      sender: "student",
      timestamp: new Date(),
      isRead: false,
    });

    const updatedStudents = ChatStorage.getStudents();
    setStudents(updatedStudents);

    const updatedSelectedStudent = updatedStudents.find(
      (s) => s.id === selectedStudent.id
    );
    if (updatedSelectedStudent) {
      setSelectedStudent(updatedSelectedStudent);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsMobileMenuOpen(false);

    ChatStorage.markMessagesAsRead(student.id);

    const updatedStudents = ChatStorage.getStudents();
    setStudents(updatedStudents);
  };

  const handleDeleteConversation = (studentId: string) => {
    ChatStorage.deleteStudent(studentId);
    const updatedStudents = ChatStorage.getStudents();
    setStudents(updatedStudents);

    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent(null);
    }
  };

  const handleStudentSendMessage = (content: string) => {
    if (!studentName) return;

    let students = ChatStorage.getStudents();
    let student = students.find((s) => s.name === studentName);

    if (!student) {
      student = ChatStorage.addStudent(studentName);
    }

    ChatStorage.addMessage(student.id, {
      id: Date.now().toString(),
      content,
      sender: "student",
      timestamp: new Date(),
      isRead: false,
    });
  };

  const unreadCount = students.reduce((count, student) => {
    return (
      count +
      student.messages.filter((msg) => !msg.isRead && msg.sender === "student")
        .length
    );
  }, 0);

  if (userType === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-gray-200 rounded-full p-4 inline-block mb-4">
              <img src={blueLogo} alt="SCC logo" className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              SCC EDUCATION INSTITUTE
            </h1>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Q&A Chat</h1>
            <p className="text-gray-600">Choose your access type</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleTeacherLogin}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3"
            >
              <Users className="h-6 w-6" />
              <span className="font-medium">Teacher Access</span>
            </button>

            <button
              onClick={() => setUserType("student")}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-3"
            >
              <User className="h-6 w-6" />
              <span className="font-medium">Student Access</span>
            </button>
          </div>

          <div className="pt-6 text-center text-gray-400">
            <p>- Develop by Macware Solutions -</p>
          </div>
        </div>
      </div>
    );
  }

  if (userType === "student" && !studentName) {
    return <StudentLogin onLogin={handleStudentLogin} />;
  }

  if (userType === "teacher" && !isTeacherAuthenticated) {
    return <TeacherLogin onSuccess={() => setIsTeacherAuthenticated(true)} />;
  }

  if (userType === "student" && studentName) {
    return (
      <StudentChat
        studentName={studentName}
        onSendMessage={handleStudentSendMessage}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <div
        className={`bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isMobileMenuOpen ? "w-80" : "w-80"
        } md:relative absolute md:translate-x-0 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } z-20 h-full`}
      >
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="h-8 w-8" />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold">SCC Q&A Chat</h1>
                <button
                  onClick={() => setShowQRCode(true)}
                  className="p-1 hover:bg-blue-500 rounded transition-colors"
                  title="Show QR Code for Students"
                >
                  <QrCode className="h-5 w-5" />
                </button>
              </div>
              <p className="text-blue-100 text-sm">
                Connect with your students
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center space-x-2 bg-blue-500 bg-opacity-50 rounded-lg p-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <StudentList
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
            onAddStudent={handleAddStudent}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            - Develop by Macware Solutions -
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center space-x-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Users className="h-6 w-6 text-gray-600" />
          </button>
          {selectedStudent && (
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">
                {selectedStudent.name}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedStudent.messages.length} message
                {selectedStudent.messages.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {selectedStudent ? (
          <ChatInterface
            student={selectedStudent}
            onSendMessage={handleSendMessage}
            onSimulateStudentMessage={handleSimulateStudentMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="bg-white rounded-full p-6 shadow-lg inline-block mb-6">
                <MessageCircle className="h-16 w-16 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Classroom Chat
              </h2>
              <p className="text-gray-600 mb-6">
                Select a student from the sidebar to start a conversation, or
                add a new student to begin chatting.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Privacy Notice</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  All messages are automatically deleted after 24 hours for
                  privacy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showQRCode && <QRCodeGenerator onClose={() => setShowQRCode(false)} />}
    </div>
  );
}

export default App;
