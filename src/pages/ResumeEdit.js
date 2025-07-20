import toast from 'react-hot-toast';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../features/auth/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../features/auth/AuthContext";
import NavBar from "../components/NavBar";

// 'education' is now an array of objects
const defaultForm = {
  name: "",
  title: "",
  email: "",
  phone: "",
  linkedin: "",
  website: "",
  summary: "",
  education: [{ school: "", degree: "", year: "" }], // Changed
  skills: [""],
  experience: [{ company: "", position: "", years: "", responsibilities: "" }],
  projects: [{ title: "", description: "" }],
  template: 'modern',
};

// toValidForm now handles the education array
// THIS IS THE NEW, CORRECT VERSION
function toValidForm(data = {}) {
  const baseForm = { ...defaultForm, ...data };

  // If education from the database is a string, convert it to the new array format.
  if (data.education && typeof data.education === 'string') {
    baseForm.education = [{ school: '', degree: data.education, year: '' }];
  } else if (!Array.isArray(data.education) || data.education.length === 0) {
    // Otherwise, ensure it's a valid array, falling back to the default if empty/invalid.
    baseForm.education = [{ school: "", degree: "", year: "" }];
  }

  // Ensure other array fields are also valid
  baseForm.skills = Array.isArray(data.skills) && data.skills.length ? data.skills : [""];
  baseForm.experience = Array.isArray(data.experience) && data.experience.length ? data.experience : [{ company: "", position: "", years: "", responsibilities: "" }];
  baseForm.projects = Array.isArray(data.projects) && data.projects.length ? data.projects : [{ title: "", description: "" }];

  return baseForm;
}

function ResumeEdit() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    const fetchResume = async () => {
      const resumeRef = doc(db, "users", user.uid, "resumes", resumeId);
      const docSnap = await getDoc(resumeRef);
      if (docSnap.exists()) {
        setForm(toValidForm(docSnap.data()));
      }
      setLoading(false);
    };
    fetchResume();
  }, [user, resumeId, authLoading]);
  
  const handleView = () => {
    if (user && resumeId) {
      navigate(`/portfolio/${user.uid}/${resumeId}`);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'template') {
        if (user && resumeId) {
            const resumeRef = doc(db, "users", user.uid, "resumes", resumeId);
            setDoc(resumeRef, { template: value }, { merge: true });
        }
    }
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...form.skills];
    newSkills[index] = value;
    setForm((prev) => ({ ...prev, skills: newSkills }));
  };
  const addSkill = () => setForm((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  const removeSkill = (i) => setForm((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));

  const handleExpChange = (index, field, value) => {
    const newExps = [...form.experience];
    newExps[index][field] = value;
    setForm((prev) => ({ ...prev, experience: newExps }));
  };
  const addExp = () => setForm((prev) => ({ ...prev, experience: [...prev.experience, { company: "", position: "", years: "", responsibilities: "" }] }));
  const removeExp = (i) => setForm((prev) => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }));
  
  const handleEducationChange = (index, field, value) => {
    const newEducation = [...form.education];
    newEducation[index][field] = value;
    setForm((prev) => ({ ...prev, education: newEducation }));
  };
  const addEducation = () => setForm((prev) => ({ ...prev, education: [...prev.education, { school: "", degree: "", year: "" }] }));
  const removeEducation = (i) => setForm((prev) => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }));

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...form.projects];
    newProjects[index][field] = value;
    setForm((prev) => ({ ...prev, projects: newProjects }));
  };
  const addProject = () => setForm((prev) => ({ ...prev, projects: [...prev.projects, { title: "", description: "" }] }));
  const removeProject = (i) => setForm((prev) => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !resumeId) return toast.error("You must be logged in.");
    const saveToast = toast.loading("Saving changes...");
    try {
      const resumeRef = doc(db, "users", user.uid, "resumes", resumeId);
      await setDoc(resumeRef, form);
      toast.success("Resume saved successfully!", { id: saveToast });
    } catch (err) {
      toast.error("Error saving: " + err.message, { id: saveToast });
    }
  };
  
  // --- FIXED: CSS classes defined in the correct scope ---
const commonInputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm";  
const commonLabelClass = "block text-sm font-medium text-gray-700";  
const sectionClass = "border-t border-gray-200 pt-6 mt-6";
  const subSectionClass = "p-4 mb-4 border rounded-md bg-gray-50 space-y-4";
  const removeButtonClass = "bg-red-500 text-white px-3 py-1 text-sm rounded-md shadow-sm hover:bg-red-600 font-medium";
  const addButtonClass = "mt-2 bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 font-semibold";

  if (loading || authLoading) return <div className="min-h-screen flex items-center justify-center">Loading form...</div>;

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Your Resume</h1>
            <button
              onClick={handleView}
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Preview & Download
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            
            {/* TEMPLATE SELECTION */}
            <div>
              <label htmlFor="template" className={commonLabelClass}>Template</label>
              <select id="template" name="template" value={form.template} onChange={handleChange} className={commonInputClass}>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimalist">Minimalist</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            
            {/* CONTACT INFORMATION */}
            <div className={sectionClass}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="name" className={commonLabelClass}>Full Name</label><input type="text" id="name" name="name" value={form.name} onChange={handleChange} className={commonInputClass} required /></div>
                <div><label htmlFor="title" className={commonLabelClass}>Job Title</label><input type="text" id="title" name="title" value={form.title} onChange={handleChange} className={commonInputClass} /></div>
                <div><label htmlFor="email" className={commonLabelClass}>Email Address</label><input type="email" id="email" name="email" value={form.email} onChange={handleChange} className={commonInputClass} required /></div>
                <div><label htmlFor="phone" className={commonLabelClass}>Phone Number</label><input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} className={commonInputClass} /></div>
                <div><label htmlFor="linkedin" className={commonLabelClass}>LinkedIn Profile</label><input type="url" id="linkedin" name="linkedin" value={form.linkedin} onChange={handleChange} className={commonInputClass} /></div>
                <div><label htmlFor="website" className={commonLabelClass}>Personal Website</label><input type="url" id="website" name="website" value={form.website} onChange={handleChange} className={commonInputClass} /></div>
              </div>
            </div>

            {/* PROFESSIONAL SUMMARY */}
            <div className={sectionClass}>
              <label htmlFor="summary" className={commonLabelClass}>Professional Summary</label>
              <textarea id="summary" name="summary" value={form.summary} onChange={handleChange} rows="4" className={commonInputClass} />
            </div>

            {/* EDUCATION SECTION */}
            <div className={sectionClass}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Education</h2>
              {form.education.map((edu, i) => (
                <div key={i} className={subSectionClass}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={commonLabelClass}>School / University</label><input type="text" placeholder="e.g., University of Technology" value={edu.school} onChange={(e) => handleEducationChange(i, "school", e.target.value)} className={commonInputClass} /></div>
                    <div><label className={commonLabelClass}>Degree / Certificate</label><input type="text" placeholder="e.g., B.E. in Computer Science" value={edu.degree} onChange={(e) => handleEducationChange(i, "degree", e.target.value)} className={commonInputClass} /></div>
                  </div>
                  <div><label className={commonLabelClass}>Year of Completion</label><input type="text" placeholder="e.g., 2024" value={edu.year} onChange={(e) => handleEducationChange(i, "year", e.target.value)} className={commonInputClass} /></div>
                  <div className="text-right"><button type="button" onClick={() => removeEducation(i)} className={removeButtonClass}>– Remove</button></div>
                </div>
              ))}
              <button type="button" onClick={addEducation} className={addButtonClass}>+ Add Education</button>
            </div>
            
            {/* --- RESTORED SECTIONS --- */}
            
            {/* SKILLS SECTION */}
            <div className={sectionClass}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Skills</h2>
                {form.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                        <input type="text" placeholder="e.g., JavaScript, React" value={skill} onChange={(e) => handleSkillChange(i, e.target.value)} className={commonInputClass} />
                        <button type="button" onClick={() => removeSkill(i)} className={removeButtonClass}>– Remove</button>
                    </div>
                ))}
                <button type="button" onClick={addSkill} className={addButtonClass}>+ Add Skill</button>
            </div>

            {/* EXPERIENCE SECTION */}
            <div className={sectionClass}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Experience</h2>
                {form.experience.map((exp, i) => (
                    <div key={i} className={subSectionClass}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className={commonLabelClass}>Position</label><input type="text" placeholder="e.g., Senior Developer" value={exp.position} onChange={(e) => handleExpChange(i, "position", e.target.value)} className={commonInputClass} /></div>
                            <div><label className={commonLabelClass}>Company</label><input type="text" placeholder="e.g., Tech Innovations Inc." value={exp.company} onChange={(e) => handleExpChange(i, "company", e.target.value)} className={commonInputClass} /></div>
                        </div>
                        <div><label className={commonLabelClass}>Years</label><input type="text" placeholder="e.g., 2020-Present" value={exp.years} onChange={(e) => handleExpChange(i, "years", e.target.value)} className={commonInputClass} /></div>
                        <div><label className={commonLabelClass}>Responsibilities</label><textarea placeholder="Use a comma for each new bullet point" value={exp.responsibilities} onChange={(e) => handleExpChange(i, "responsibilities", e.target.value)} rows="3" className={commonInputClass} /></div>
                        <div className="text-right"><button type="button" onClick={() => removeExp(i)} className={removeButtonClass}>– Remove</button></div>
                    </div>
                ))}
                <button type="button" onClick={addExp} className={addButtonClass}>+ Add Experience</button>
            </div>

            {/* PROJECTS SECTION */}
            <div className={sectionClass}>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Projects</h2>
                {form.projects.map((project, i) => (
                    <div key={i} className={subSectionClass}>
                      <div><label className={commonLabelClass}>Project Title</label><input type="text" placeholder="e.g., Portfolio Builder" value={project.title} onChange={(e) => handleProjectChange(i, "title", e.target.value)} className={commonInputClass} /></div>
                      <div><label className={commonLabelClass}>Description</label><input type="text" placeholder="A web app for creating resumes" value={project.description} onChange={(e) => handleProjectChange(i, "description", e.target.value)} className={commonInputClass} /></div>
                      <div className="text-right"><button type="button" onClick={() => removeProject(i)} className={removeButtonClass}>– Remove</button></div>
                    </div>
                ))}
                <button type="button" onClick={addProject} className={addButtonClass}>+ Add Project</button>
            </div>
            
            {/* SUBMIT BUTTON */}
            <div className="w-full pt-6 mt-8 border-t border-gray-300">
                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Save Changes
                </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResumeEdit;