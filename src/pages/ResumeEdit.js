
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../features/auth/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../features/auth/AuthContext";
import NavBar from "../components/NavBar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from 'react-hot-toast';

// Import the template thumbnails
import classicThumb from '../assets/classic-thumb.png';
import modernThumb from '../assets/modern-thumb.png';
import minimalistThumb from '../assets/minimalist-thumb.png';


const defaultForm = {
  name: "",
  title: "",
  email: "",
  phone: "",
  linkedin: "",
  website: "",
  summary: "",
  education: "",
  skills: [""],
  experience: [{ company: "", position: "", years: "", responsibilities: "" }],
  projects: [{ title: "", description: "" }],
  photoUrl: "",
  template: 'modern', // Default template
};

function toValidForm(data = {}) {
  return {
    ...defaultForm,
    ...data,
    template: data.template || 'modern',
    skills: Array.isArray(data.skills) && data.skills.length ? data.skills : [""],
    experience: Array.isArray(data.experience) && data.experience.length ? data.experience : [{ company: "", position: "", years: "", responsibilities: "" }],
    projects: Array.isArray(data.projects) && data.projects.length ? data.projects : [{ title: "", description: "" }],
  };
}

function ResumeEdit() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [photoUploading, setPhotoUploading] = useState(false);

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

    // Auto-save template change
    if (name === 'template') {
        if (user && resumeId) {
            const resumeRef = doc(db, "users", user.uid, "resumes", resumeId);
            setDoc(resumeRef, { template: value }, { merge: true });
        }
    }
  };
  const handleTemplateChange = async (templateName) => {
    // Update the UI immediately for a responsive feel
    setForm((prev) => ({ ...prev, template: templateName }));

    // Save this specific change to Firestore in the background
    if (user && resumeId) {
        const resumeRef = doc(db, "users", user.uid, "resumes", resumeId);
        try {
            // Use { merge: true } to only update the template field
            await setDoc(resumeRef, { template: templateName }, { merge: true });
            toast.success(`Template changed to ${templateName}`);
        } catch (error) {
            toast.error("Could not save template choice.");
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
  const handleProjectChange = (index, field, value) => {
    const newProjects = [...form.projects];
    newProjects[index][field] = value;
    setForm((prev) => ({ ...prev, projects: newProjects }));
  };
  const addProject = () => setForm((prev) => ({ ...prev, projects: [...prev.projects, { title: "", description: "" }] }));
  const removeProject = (i) => setForm((prev) => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }));
    const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const MAX_FILE_SIZE_MB = 2;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      e.target.value = null;
      return;
    }
    if (!user) return;
    setPhotoUploading(true);
    const uploadToast = toast.loading("Uploading photo...");
    try {
      const storageRef = ref(storage, `profilePhotos/${user.uid}/${resumeId}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setForm((prev) => ({ ...prev, photoUrl: downloadURL }));
      toast.success("Photo uploaded!", { id: uploadToast });
    } catch (err) {
      toast.error("Photo upload failed: " + err.message, { id: uploadToast });
    } finally {
      setPhotoUploading(false);
    }
  };
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

  if (loading || authLoading) return <div>Loading form...</div>;

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Edit Your Resume</h2>
            <button
              onClick={handleView}
              className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
            >
              Preview & Download
            </button>
          </div>

          {/* --- ALL YOUR FORM FIELDS ARE NOW RESTORED --- */}
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div>
                <label htmlFor="template" className="block font-bold mb-2 text-gray-700">Choose a Template:</label>
                <select
                    id="template"
                    name="template"
                    value={form.template}
                    onChange={handleChange}
                    className="border p-3 rounded w-full bg-white transition duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="professional">Professional</option>
                </select>
            </div>
            <div>
              <label className="block font-bold mb-2 text-gray-700">Profile Photo:</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={photoUploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              {form.photoUrl && <img src={form.photoUrl} alt="Preview" className="w-24 h-24 rounded-full mt-4" />}
            </div>
            <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="border p-3 rounded w-full" required />
            <input type="text" name="title" placeholder="Job Title (e.g. Software Engineer)" value={form.title} onChange={handleChange} className="border p-3 rounded w-full" />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border p-3 rounded w-full" required />
            <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="border p-3 rounded w-full" />
            <input type="url" name="linkedin" placeholder="LinkedIn Profile URL" value={form.linkedin} onChange={handleChange} className="border p-3 rounded w-full" />
            <input type="url" name="website" placeholder="Personal Website URL" value={form.website} onChange={handleChange} className="border p-3 rounded w-full" />
            <textarea name="summary" placeholder="Career Summary" value={form.summary} onChange={handleChange} className="border p-3 rounded w-full" />
            <input type="text" name="education" placeholder="Education (e.g., B.E. in Computer Science)" value={form.education} onChange={handleChange} className="border p-3 rounded w-full" />
            <div>
              <label className="font-bold text-gray-700">Skills:</label>
              {form.skills.map((skill, i) => (
                <div key={i} className="flex gap-2 mt-1">
                  <input type="text" value={skill} onChange={(e) => handleSkillChange(i, e.target.value)} className="border p-2 rounded w-full" />
                  <button type="button" onClick={() => removeSkill(i)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold">−</button>
                </div>
              ))}
              <button type="button" onClick={addSkill} className="mt-2 bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600">+ Add Skill</button>
            </div>
            <div>
              <label className="font-bold text-gray-700">Experience:</label>
              {form.experience.map((exp, i) => (
                <div key={i} className="border-t pt-4 mt-2 space-y-2">
                  <input type="text" placeholder="Position" value={exp.position} onChange={(e) => handleExpChange(i, "position", e.target.value)} className="border p-2 rounded w-full" />
                  <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleExpChange(i, "company", e.target.value)} className="border p-2 rounded w-full" />
                  <textarea placeholder="Job Responsibilities (use a comma for each new bullet point)" value={exp.responsibilities} onChange={(e) => handleExpChange(i, "responsibilities", e.target.value)} className="border p-2 rounded w-full text-sm" />
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Years" value={exp.years} onChange={(e) => handleExpChange(i, "years", e.target.value)} className="border p-2 rounded w-full" />
                    <button type="button" onClick={() => removeExp(i)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold self-center">−</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addExp} className="mt-2 bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600">+ Add Experience</button>
            </div>
            <div>
              <label className="font-bold text-gray-700">Projects:</label>
              {form.projects.map((project, i) => (
                <div key={i} className="border-t pt-4 mt-2 space-y-2">
                  <input type="text" placeholder="Project Title" value={project.title} onChange={(e) => handleProjectChange(i, "title", e.target.value)} className="border p-2 rounded w-full" />
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="Description" value={project.description} onChange={(e) => handleProjectChange(i, "description", e.target.value)} className="border p-2 rounded w-full" />
                    <button type="button" onClick={() => removeProject(i)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold self-center">−</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addProject} className="mt-2 bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600">+ Add Project</button>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded mt-4 font-bold hover:bg-blue-700">
              {photoUploading ? "Uploading..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ResumeEdit;