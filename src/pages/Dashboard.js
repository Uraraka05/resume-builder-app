// src/pages/Dashboard.js
// Replace the entire contents of your Dashboard.js file with this code.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../features/auth/firebase";
import { useAuth } from "../features/auth/AuthContext";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

// Blank resume template
const blankResume = {
  name: "Untitled Resume",
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
};

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setLoading(false);
      return;
    }
    
    // Set user's email in the blank resume template for new resumes
    blankResume.email = user.email;

    const col = collection(db, "users", user.uid, "resumes");
    getDocs(col).then(snap => {
      setResumes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }).catch(err => {
      toast.error("Failed to fetch resumes.");
      setLoading(false);
    });
  }, [user, authLoading]);

  const handleNewResume = async () => {
    try {
      const docRef = await addDoc(collection(db, "users", user.uid, "resumes"), blankResume);
      navigate(`/resume/edit/${docRef.id}`);
    } catch (error) {
      toast.error("Could not create a new resume.");
    }
  };

  const handleDelete = (resumeId) => {
    setResumeToDelete(resumeId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!resumeToDelete) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "resumes", resumeToDelete));
      setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete));
      toast.success("Resume deleted!");
    } catch (err) {
      toast.error("Failed to delete resume.");
    } finally {
      setIsModalOpen(false);
      setResumeToDelete(null);
    }
  };

  const handleEdit = (resumeId) => navigate(`/resume/edit/${resumeId}`);
  const handleView = (resumeId) => navigate(`/portfolio/${user.uid}/${resumeId}`);
  const handleCopyLink = (resumeId) => {
    const link = `${window.location.origin}/portfolio/${user.uid}/${resumeId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        toast.success("Portfolio link copied to clipboard!");
      })
      .catch(err => {
        toast.error("Failed to copy link.");
      });
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavBar />
      <main className="p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your Resumes</h1>
            <button
              onClick={handleNewResume}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all font-bold flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Resume
            </button>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700">No Resumes Yet</h2>
              <p className="text-gray-500 mt-2">Click the "New Resume" button to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resumes.map((resume) => (
                <div key={resume.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 truncate">{resume.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{resume.email || 'No email provided'}</p>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button onClick={() => handleEdit(resume.id)} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold text-sm">Edit</button>
                    <button onClick={() => handleView(resume.id)} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 font-semibold text-sm">View</button>
                    <button onClick={() => handleCopyLink(resume.id)} className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 font-semibold text-sm">Copy Link</button>
                    <button onClick={() => handleDelete(resume.id)} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-semibold text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this resume?"
      />
    </div>
  );
}

export default Dashboard;