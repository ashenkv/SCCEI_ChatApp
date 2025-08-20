import { Student, Message } from "../types/Chat";

const STORAGE_KEY = "classroom-chat-data";
const EXPIRY_HOURS = 24;

export class ChatStorage {
  static getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return parsed.students.map((student: any) => ({
        ...student,
        createdAt: new Date(student.createdAt),
        lastMessage: student.lastMessage
          ? {
              ...student.lastMessage,
              timestamp: new Date(student.lastMessage.timestamp),
            }
          : undefined,
        messages: student.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }));
    } catch (error) {
      console.error("Error loading students:", error);
      return [];
    }
  }

  static saveStudents(students: Student[]): void {
    try {
      const data = {
        students: students.map((student) => ({
          ...student,
          createdAt: student.createdAt.toISOString(),
          messages: student.messages.map((msg) => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          })),
        })),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving students:", error);
    }
  }

  static addStudent(name: string): Student {
    const students = this.getStudents();
    const newStudent: Student = {
      id: Date.now().toString(),
      name,
      messages: [],
      createdAt: new Date(),
    };

    students.push(newStudent);
    this.saveStudents(students);
    return newStudent;
  }

  static deleteStudent(studentId: string): void {
    const students = this.getStudents();
    const filteredStudents = students.filter((s) => s.id !== studentId);
    this.saveStudents(filteredStudents);
  }

  static addMessage(studentId: string, message: Message): void {
    const students = this.getStudents();
    const studentIndex = students.findIndex((s) => s.id === studentId);

    if (studentIndex !== -1) {
      students[studentIndex].messages.push(message);
      students[studentIndex].lastMessage = message;
      this.saveStudents(students);
    }
  }

  static markMessagesAsRead(studentId: string): void {
    const students = this.getStudents();
    const studentIndex = students.findIndex((s) => s.id === studentId);

    if (studentIndex !== -1) {
      students[studentIndex].messages.forEach((msg) => {
        if (msg.sender === "student") {
          msg.isRead = true;
        }
      });
      this.saveStudents(students);
    }
  }

  static markTeacherMessagesAsRead(studentId: string): void {
    const students = this.getStudents();
    const studentIndex = students.findIndex((s) => s.id === studentId);

    if (studentIndex !== -1) {
      students[studentIndex].messages.forEach((msg) => {
        if (msg.sender === "teacher") {
          msg.isRead = true;
        }
      });
      this.saveStudents(students);
    }
  }

  static cleanupOldMessages(): void {
    const students = this.getStudents();
    const now = new Date();

    students.forEach((student) => {
      student.messages = student.messages.filter((msg) => {
        const messageAge = now.getTime() - msg.timestamp.getTime();
        const hoursOld = messageAge / (1000 * 60 * 60);
        return hoursOld < EXPIRY_HOURS;
      });

      if (student.messages.length > 0) {
        student.lastMessage = student.messages[student.messages.length - 1];
      } else {
        student.lastMessage = undefined;
      }
    });

    const activeStudents = students.filter((student) => {
      if (student.messages.length === 0) {
        const studentAge = now.getTime() - student.createdAt.getTime();
        const hoursOld = studentAge / (1000 * 60 * 60);
        return hoursOld < EXPIRY_HOURS;
      }
      return true;
    });

    this.saveStudents(activeStudents);
  }
}
