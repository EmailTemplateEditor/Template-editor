import React, { useState } from "react";

const StudentModal = ({ onClose, onSave }) => {
  const [students, setStudents] = useState([]); // List of students
  const [currentStudent, setCurrentStudent] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setCurrentStudent({ ...currentStudent, [e.target.name]: e.target.value });
  };

  const addStudent = () => {
    if (
      !currentStudent.name ||
      !currentStudent.email ||
      !currentStudent.phone ||
      !currentStudent.subject ||
      !currentStudent.message
    ) {
      alert("All fields are required!");
      return;
    }

    setStudents((prev) => [
      ...prev,
      { ...currentStudent, id: currentStudent.id || Date.now() },
    ]);
    setCurrentStudent({
      id: null,
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const saveAllToDB = () => {
    if (students.length === 0) {
      alert("No students to save!");
      return;
    }
    onSave(students);
  };

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Student Details</h2>

        {/* Student List */}
        <div className="student-list">
          <h3>Student List</h3>
          {students.map((student) => (
            <div key={student.id} className="student-item">
              {student.name} - {student.email}
              <button onClick={() => handleEdit(student)}>Edit</button>
              <button onClick={() => handleDelete(student.id)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Form Fields */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={currentStudent.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={currentStudent.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={currentStudent.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={currentStudent.subject}
          onChange={handleChange}
        />
        <input
          type="text"
          name="message"
          placeholder="Message"
          value={currentStudent.message}
          onChange={handleChange}
        />

        {/* Actions */}
        <div className="modal-actions">
          <button onClick={addStudent}>Add Student</button>
          <button onClick={saveAllToDB}>Save All to DB</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
