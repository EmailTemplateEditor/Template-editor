import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import SegmentPreview from "../components/SegmentPreview";
import StudentModal from "../components/StudentModal";
import "./MainPage.css";

const MainPage = () => {
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [segments, setSegments] = useState([]);
  const [students, setStudents] = useState([]);

  // Function to add a segment
const handleAddSegment = (type) => {
  let newSegment;

  if (type === "segment-1") {
    newSegment = {
      id: Date.now(),
      type,
      content: {
        icon: "",
        heading: "Default Heading",
        text: "Default Text",
        image:""
      },
    };
  } else if (type === "segment-2") {
    newSegment = {
      id: Date.now(),
      type,
      content: {
        input: "Hello",
        textEditor: "Default Text Editor Content",
      },
    };
  } else if (type === "segment-3") {
    newSegment = {
      id: Date.now(),
      type,
      content: {
        input: "http://imagecon.com",
        heading: "Sample Text Editor Content",
        image:""
      },
    };
  }

  setSegments([...segments, newSegment]);
};


  // Save students to DB
  const saveStudentToDB = async(studentsList) => {
    try {
      const response = await axios.post("http://localhost:5000/api/savestudent",
        studentsList
      );
      alert("All student details saved successfully!");
      console.log("Saved students:", response.data);
      setStudents(response.data);
      setShowStudentModal(false);
    } catch (error) {
      console.error("Error saving student details:", error);
      alert("Error saving student details. Please try again.");
    }
  };

  // Send emails
const sendEmails = async () => {
  try {
    if (students.length === 0) {
      alert("No students available to send emails.");
      return;
    }

    if (!segments || segments.length === 0) {
      alert("Please add at least one segment before sending emails.");
      return;
    }

    // Get the last 3 students
    const lastThreeStudents = students.slice(-3);

    // Send the last 3 student details and segments to the backend
    await axios.post("http://localhost:5000/api/sendEmail", {
      students:lastThreeStudents, // Last 3 students
      segments, // Email content segments
    });

    alert("Emails sent successfully to the last 3 students!");
  } catch (error) {
    console.error("Error sending emails:", error);
    alert("Failed to send emails. Please try again.");
  }
};

  return (
    <div className="main-page">
      <Navbar onSave={() => setShowStudentModal(true)} onSend={sendEmails} />
      <div className="editor-section">
        <div className="controls">
          <button onClick={() => handleAddSegment("segment-1")}>
            Add Segment 1
          </button>
          <button onClick={() => handleAddSegment("segment-2")}>
            Add Segment 2
          </button>
              <button onClick={() => handleAddSegment("segment-3")}>
            Add Segment 3
          </button>
        </div>
        <SegmentPreview segments={segments} setSegments={setSegments} />
      </div>
      {showStudentModal && (
        <StudentModal
          onClose={() => setShowStudentModal(false)}
          onSave={saveStudentToDB}
        />
      )}
    </div>
  );
};

export default MainPage;
