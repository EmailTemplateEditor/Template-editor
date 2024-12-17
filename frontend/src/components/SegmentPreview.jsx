import React, { useState } from "react";
import axios from 'axios';

import "./SegmentPreview.css";

const SegmentPreview = ({ segments, setSegments }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editSegmentIndex, setEditSegmentIndex] = useState(null); // Index of the segment being edited
  const [modalContent, setModalContent] = useState({icon: '',
  image: '',
  heading: '',
  text: '',
  backgroundColor: '#ffffff',}); // Content being edited
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drag-and-drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index) => {
    const reorderedSegments = [...segments];
    const [removed] = reorderedSegments.splice(draggedIndex, 1);
    reorderedSegments.splice(index, 0, removed);
    setSegments(reorderedSegments);
    setDraggedIndex(null);
  };

  // Delete segment
  const handleDelete = (index) => {
    const updatedSegments = segments.filter((_, i) => i !== index);
    setSegments(updatedSegments);
  };

  // Open modal for editing
  const handleEdit = (index) => {
    setEditSegmentIndex(index);
    setModalContent(segments[index].content); // Load current content into modal
    setIsModalOpen(true);
  };

  // Save changes from modal
  const saveChanges = () => {
    const updatedSegments = [...segments];
    updatedSegments[editSegmentIndex].content = modalContent;
    setSegments(updatedSegments);
    closeModal();
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({});
    setEditSegmentIndex(null);
  };

  // Handle input changes in modal
  const handleModalChange = (key, value) => {
    setModalContent((prev) => ({ ...prev, [key]: value }));
  };

  // Handle image upload
 const handleImageUpload = async (key, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('http://localhost:5000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    handleModalChange(key, response.data.url); // Update the modal content with the uploaded image URL
  } catch (error) {
    console.error(`Error uploading ${key}:`, error);
  }
};
  return (
    <div className="segment-preview">
      {segments.map((segment, index) => (
        <div
          key={segment.id}
          className="segment"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
         style={{
         backgroundColor: segment.type === "segment-1" 
             ? segment.content.backgroundColor 
             : segment.type === "segment-2" 
             ? 'transparent' 
             : segment.type === "segment-3" 
             ? segment.content.backgroundColor 
             : 'transparent'
     }}
        >
         <div className="segment-content">
  
    {(() => {
    if (segment.type === "segment-1") {
      return (
        <div className="segment-1">
          <div className="banner">
            <div className="banner-headings">
              <div>
                <img src={segment.content.icon} alt="Icon" className="icon" />
              </div>
              <div>
                <h2>{segment.content.heading}</h2>
              </div>
            </div>

            <p>{segment.content.text}</p>
          </div>
          <div>
            <img
              src={segment.content.image}
              alt="RightImage"
              className="right-image"
            />
          </div>
        </div>
      );
    } else if (segment.type === "segment-2") {
      return (
        <div className="segment-2">
          <p>{segment.content.input}</p>
          <p>{segment.content.textEditor}</p>
        </div>
      );
    }
 else if (segment.type === "segment-3") {
      return (
        <div className="segment-3">
          <div className="banner">
                <h2>{segment.content.heading}</h2>
                <a className="banner-btn" href={segment.content.input}>Click Here to know More</a>
        
            </div>
          <div className="ban-img">
            <img
              src={segment.content.image}
              alt="RightImage"
              className="right-image"
            />
          </div>
        </div>
      );
    }
      })()}
</div>

          <div className="segment-actions">
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Segment</h2>
           <>
  {segments[editSegmentIndex].type === "segment-1" && (
    <>
      {/* Icon Upload */}
      <label>Icon:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload("icon", e.target.files[0])}
      />
      {modalContent.icon && (
        <img src={modalContent.icon} alt="Icon Preview" className="preview" />
      )}

      {/* Heading */}
      <label>Heading:</label>
      <input
        type="text"
        value={modalContent.heading}
        onChange={(e) => handleModalChange("heading", e.target.value)}
      />

      {/* Text */}
      <label>Text:</label>
      <textarea
        value={modalContent.text}
        onChange={(e) => handleModalChange("text", e.target.value)}
      />

      {/* RightImage Upload */}
      <label>Right Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload("image", e.target.files[0])}
      />
      {modalContent.image && (
        <img src={modalContent.image} alt="RightImage Preview" className="preview" />
      )}

      {/* Background Color */}
      <label>Background Color:</label>
      <input
        type="color"
        value={modalContent.backgroundColor || "#ffffff"}
        onChange={(e) => handleModalChange("backgroundColor", e.target.value)}
      />
    </>
  )}

  {segments[editSegmentIndex].type === "segment-2" && (
    <>
      <label>Input:</label>
      <input
        type="text"
        value={modalContent.input}
        onChange={(e) => handleModalChange("input", e.target.value)}
      />
      <label>Text Editor:</label>
      <textarea
        value={modalContent.textEditor}
        onChange={(e) => handleModalChange("textEditor", e.target.value)}
      />
    </>
  )}
{segments[editSegmentIndex].type === "segment-3" && (
    <>

      {/* Heading */}
      <label>Heading:</label>
      <input
        type="text"
        value={modalContent.heading}
        onChange={(e) => handleModalChange("heading", e.target.value)}
      />
 {/* url button */}
      <label>Button Url:</label>
      <input
        type="text"
        value={modalContent.input}
        onChange={(e) => handleModalChange("input", e.target.value)}
      />
      

      {/* RightImage Upload */}
      <label>Right Image:</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload("image", e.target.files[0])}
      />
      {modalContent.image && (
        <img src={modalContent.image} alt="RightImage Preview" className="preview" />
      )}

      {/* Background Color */}
      <label>Background Color:</label>
      <input
        type="color"
        value={modalContent.backgroundColor || "#ffffff"}
        onChange={(e) => handleModalChange("backgroundColor", e.target.value)}
      />
    </>
  )}

</>

            <div className="modal-actions">
              <button onClick={saveChanges}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentPreview;
