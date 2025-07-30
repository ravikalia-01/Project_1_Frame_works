import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useResume } from "../context/AppContext";
import Header from "./Header";
import "./resume.css";

function ResumePreview() {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const resumeRef = useRef();

  // Check if there's any meaningful data to display
  const hasData = resumeData.name || resumeData.email || resumeData.mobile || 
                  resumeData.education.some(edu => edu.course || edu.college) ||
                  resumeData.experience.some(exp => exp.title || exp.company) ||
                  resumeData.skills.some(skill => skill.trim());

  if (!hasData) {
    return (
      <div className="page-center">
        <Header />
        <div className="resume-preview" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>No resume data to display</h2>
          <p>Please go to the Resume Builder to add your information.</p>
          <button onClick={() => navigate("/builder")} className="preview-btn">
            Go to Resume Builder
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: `${resumeData.name || "Resume"}`,
  });

  return (
    <div>
      <Header />
      {/* Printable Area */}
      <div className="resume-preview" ref={resumeRef}>
        <div className="head">
          <div className="proImg">
            {resumeData.profileImage && (
              <img src={resumeData.profileImage} alt="Profile" className="profile-pic"/>
            )}
          </div>
          <div className="titleClass">
            <h1 className="title">{resumeData.name}</h1>
           
          </div>
        </div>

        <div className="bioClass">
          <p>{resumeData.bio}</p>
        </div>

        <div className="resume-columns">
          <div className="left-column">
            <section className="section">
              <h2>Personal Info</h2>
              <p><strong>Email:</strong> {resumeData.email}</p>
              <p><strong>Mobile:</strong> {resumeData.mobile}</p>
              <p><strong>Date of Birth:</strong> {resumeData.dob}</p>
              <p><strong>Gender:</strong> {resumeData.gender}</p>
              <p><strong>Marital Status:</strong> {resumeData.maritalStatus}</p>
            </section>

            <section className="section">
              <h2>Education</h2>
              {resumeData.education.map((edu, i) => (
                <div key={i} className="item">
                  <h3> {edu.course}</h3>
                  <p><strong>College:</strong> {edu.college}</p>
                  <p><strong>Place:</strong> {edu.place}</p>
                  <p><strong>Year:</strong> {edu.year}</p>
                  <p><strong>Status:</strong> {edu.status}</p>
                </div>
              ))}
            </section>

            <section className="section">
              <h2>Skills</h2>
              <ul>
                {resumeData.skills.map((skill, i) =>
                  skill ? <li key={i}>{skill}</li> : null
                )}
              </ul>
            </section>

            <section className="section lang">
              <h2>Languages</h2>
              <p>{resumeData.languages}</p>
            </section>
          </div>

          <div className="right-column">
            <section className="section">
              <h2>Work Experience</h2>
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="item">
                  <h3>{exp.title}</h3>
                  <p><strong>Company:</strong> {exp.company}</p>
                  <p><strong>Start Date:</strong> {exp.start}</p>
                  <p><strong>End Date:</strong> {exp.end}</p>
                  <p><strong>City:</strong> {exp.city}</p>
                  <p><strong>Province:</strong> {exp.province}</p>
                  <p><strong>Country:</strong> {exp.country}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button onClick={() => navigate("/")}>Back to Builder</button>
        <button style={{ marginLeft: "1rem" }} onClick={handlePrint}>
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}

export default ResumePreview;
