import React, { createContext, useContext, useReducer } from "react";

// Define the initial state
const initialState = {
  resumeData: {
    name: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    bio: "",
    languages: "",
    education: [{ course: "", college: "", place: "", year: "", status: "" }],
    experience: [
      {
        title: "",
        company: "",
        city: "",
        province: "",
        country: "",
        start: "",
        end: "",
      },
    ],
    skills: [""],
    profileImage: null,
  },
};

// Define action types
const actionTypes = {
  UPDATE_FIELD: "UPDATE_FIELD",
  UPDATE_EDUCATION: "UPDATE_EDUCATION",
  UPDATE_EXPERIENCE: "UPDATE_EXPERIENCE",
  UPDATE_SKILL: "UPDATE_SKILL",
  ADD_EDUCATION: "ADD_EDUCATION",
  ADD_EXPERIENCE: "ADD_EXPERIENCE",
  ADD_SKILL: "ADD_SKILL",
  REMOVE_EDUCATION: "REMOVE_EDUCATION",
  REMOVE_EXPERIENCE: "REMOVE_EXPERIENCE",
  REMOVE_SKILL: "REMOVE_SKILL",
  RESET_FORM: "RESET_FORM",
  SET_RESUME_DATA: "SET_RESUME_DATA",
};

// Create the reducer function
const resumeReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_FIELD:
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          [action.field]: action.value,
        },
      };

    case actionTypes.UPDATE_EDUCATION:
      const updatedEducation = [...state.resumeData.education];
      updatedEducation[action.index] = {
        ...updatedEducation[action.index],
        ...action.data,
      };
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: updatedEducation,
        },
      };

    case actionTypes.UPDATE_EXPERIENCE:
      const updatedExperience = [...state.resumeData.experience];
      updatedExperience[action.index] = {
        ...updatedExperience[action.index],
        ...action.data,
      };
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: updatedExperience,
        },
      };

    case actionTypes.UPDATE_SKILL:
      const updatedSkills = [...state.resumeData.skills];
      updatedSkills[action.index] = action.value;
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: updatedSkills,
        },
      };

    case actionTypes.ADD_EDUCATION:
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: [
            ...state.resumeData.education,
            { course: "", college: "", place: "", year: "", status: "" },
          ],
        },
      };

    case actionTypes.ADD_EXPERIENCE:
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: [
            ...state.resumeData.experience,
            {
              title: "",
              company: "",
              city: "",
              province: "",
              country: "",
              start: "",
              end: "",
            },
          ],
        },
      };

    case actionTypes.ADD_SKILL:
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: [...state.resumeData.skills, ""],
        },
      };

    case actionTypes.REMOVE_EDUCATION:
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.filter(
            (_, i) => i !== action.index
          ),
        },
      };

    case actionTypes.REMOVE_EXPERIENCE:
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          experience: state.resumeData.experience.filter(
            (_, i) => i !== action.index
          ),
        },
      };

    case actionTypes.REMOVE_SKILL:
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: state.resumeData.skills.filter((_, i) => i !== action.index),
        },
      };

    case actionTypes.RESET_FORM:
      return {
        ...state,
        resumeData: initialState.resumeData,
      };

    case actionTypes.SET_RESUME_DATA:
      return {
        ...state,
        resumeData: action.data,
      };

    default:
      return state;
  }
};

// Create the context
const ResumeContext = createContext();

// Create the provider component
export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Action creators
  const updateField = (field, value) => {
    dispatch({ type: actionTypes.UPDATE_FIELD, field, value });
  };

  const updateEducation = (index, data) => {
    dispatch({ type: actionTypes.UPDATE_EDUCATION, index, data });
  };

  const updateExperience = (index, data) => {
    dispatch({ type: actionTypes.UPDATE_EXPERIENCE, index, data });
  };

  const updateSkill = (index, value) => {
    dispatch({ type: actionTypes.UPDATE_SKILL, index, value });
  };

  const addEducation = () => {
    dispatch({ type: actionTypes.ADD_EDUCATION });
  };

  const addExperience = () => {
    dispatch({ type: actionTypes.ADD_EXPERIENCE });
  };

  const addSkill = () => {
    dispatch({ type: actionTypes.ADD_SKILL });
  };

  const removeEducation = (index) => {
    dispatch({ type: actionTypes.REMOVE_EDUCATION, index });
  };

  const removeExperience = (index) => {
    dispatch({ type: actionTypes.REMOVE_EXPERIENCE, index });
  };

  const removeSkill = (index) => {
    dispatch({ type: actionTypes.REMOVE_SKILL, index });
  };

  const resetForm = () => {
    dispatch({ type: actionTypes.RESET_FORM });
  };

  const setResumeData = (data) => {
    dispatch({ type: actionTypes.SET_RESUME_DATA, data });
  };

  return (
    <ResumeContext.Provider
      value={{
        ...state,
        updateField,
        updateEducation,
        updateExperience,
        updateSkill,
        addEducation,
        addExperience,
        addSkill,
        removeEducation,
        removeExperience,
        removeSkill,
        resetForm,
        setResumeData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook to use the context
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};

export default ResumeContext;
