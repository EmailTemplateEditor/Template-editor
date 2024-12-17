import React from "react";
import './Navbar.css';

const Navbar = ({ onSave, onSend }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Template Builder</h1>
      </div>
      <div className="navbar-right">
        <button className="navbar-btn save-btn" onClick={onSave}>
          Save
        </button>
        <button className="navbar-btn send-btn" onClick={onSend}>
          Send
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
