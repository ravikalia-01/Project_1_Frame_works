import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

import "./resume.css";

function ResumeBuilder() {
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    bio: "",
    languages: "",
    education: [{ course:"", college: "", place: "", year: "", status: "" }],
    experience: [{ title: "",company: "", city: "", province: "", country: "", start: "", end: "" }],
    skills: [""],
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setResumeData({ ...resumeData, profileImage: imageUrl });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const handleEducationChange = (index, e) => {
    const newEdu = [...resumeData.education];
    newEdu[index][e.target.name] = e.target.value;
    setResumeData({ ...resumeData, education: newEdu });
  };

  const handleExperienceChange = (index, e) => {
    const newExp = [...resumeData.experience];
    newExp[index][e.target.name] = e.target.value;
    setResumeData({ ...resumeData, experience: newExp });
  };

  const handleSkillChange = (index, e) => {
    const newSkills = [...resumeData.skills];
    newSkills[index] = e.target.value;
    setResumeData({ ...resumeData, skills: newSkills });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { course: "", college: "", place: "", year: "", status: "" }],
    });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { title: "", company: "", city: "", province: "", country: "", start: "", end: "" },
      ],
    });
  };

  const addSkill = () => {
    setResumeData({ ...resumeData, skills: [...resumeData.skills, ""] });
  };

  const handlePreview = () => {
    navigate("/preview", { state: { resumeData } });
  };

  return (
    
    
    <div className="page-center">
      <Header />
      <div className="resume-builder">
        <h1>Resume Builder</h1>
        <form className="resume-form" onSubmit={e => e.preventDefault()}>
          <label>Upload Photo</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {resumeData.profileImage && (
                <img
                  src={resumeData.profileImage}
                  alt="Profile Preview"
                  className="image-preview"
                />
              )}

          <label>Name</label>
          <input type="text" name="name" value={resumeData.name} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={resumeData.email} onChange={handleChange} />

          <label>Mobile No.</label>
          <input type="text" name="mobile" value={resumeData.mobile} onChange={handleChange} />

          <label>Date of Birth</label>
          <input type="date" name="dob" value={resumeData.dob} onChange={handleChange} />

          <label>Gender</label>
          <select name="gender" value={resumeData.gender} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Marital Status</label>
          <select name="maritalStatus" value={resumeData.maritalStatus} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
          </select>

          <label>Bio</label>
          <textarea name="bio" value={resumeData.bio} onChange={handleChange}></textarea>

          <label>Languages</label>
          <input type="text" name="languages" value={resumeData.languages} onChange={handleChange} />
          <div>
            <h3>Education</h3>
            {resumeData.education.map((edu, i) => (
              <div key={i} className="nested-group">
                <input  type="text"  name="course"  placeholder="Course/Program"  value={edu.course}  onChange={e => handleEducationChange(i, e)}/>
                <input  type="text"  name="college"  placeholder="College/University"  value={edu.college}  onChange={e => handleEducationChange(i, e)}/>
                <input  type="text"  name="place"  placeholder="Place"  value={edu.place}  onChange={e => handleEducationChange(i, e)}/>
                <input  type="text"  name="year"  placeholder="Year of Passing"  value={edu.year}  onChange={e => handleEducationChange(i, e)}/>
                <select name="status" value={edu.status} onChange={e => handleEducationChange(i, e)}>
                  <option value="">-- Status --</option>
                  <option value="Passed">Passed</option>
                  <option value="Pursuing">Pursuing</option>
                  <option value="Dropped">Dropped</option>
                </select>
              </div>
            ))}
            <button type="button" onClick={addEducation}>Add Education</button>
          </div>
          <div>
            <h3>Work Experience</h3>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="nested-group">
                <input  type="text"  name="title"  placeholder="Title/Post Name"  value={exp.title}  onChange={e => handleExperienceChange(i, e)}/>
                <input  type="text"  name="company"  placeholder="Company Name"  value={exp.company}  onChange={e => handleExperienceChange(i, e)}/>
                <input  type="date"  name="start"  value={exp.start}  onChange={e => handleExperienceChange(i, e)}/>
                <input  type="date"  name="end"  value={exp.end}  onChange={e => handleExperienceChange(i, e)}/>
                <input  type="text"  name="city"  placeholder="City"  value={exp.city}  onChange={e => handleExperienceChange(i, e)}/>
                <input  type="text"  name="province"  placeholder="Province"  value={exp.province}  onChange={e => handleExperienceChange(i, e)}/>
                <input  type="text"  name="country"  placeholder="Country"  value={exp.country}  onChange={e => handleExperienceChange(i, e)}/>
              </div>
            ))}
            <button type="button" onClick={addExperience}>Add Experience</button>
          </div>
          <div>
          <h3>Skills</h3>
          {resumeData.skills.map((skill, i) => (
            <input  key={i}  type="text"  placeholder={`Skill ${i + 1}`}  value={skill}  onChange={e => handleSkillChange(i, e)}/>
          ))}
          <button type="button" onClick={addSkill}>Add Skill</button>
          </div>
          <button type="button" className="preview-btn" onClick={handlePreview}>
            Preview Resume
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResumeBuilder;
