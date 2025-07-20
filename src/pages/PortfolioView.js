import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../features/auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from 'react-hot-toast'; // Import toast for user feedback

import { ModernTemplate } from '../components/templates/ModernTemplate';
import { ClassicTemplate } from '../components/templates/ClassicTemplate';
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';

const templateMap = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimalist: MinimalistTemplate,
    professional: ProfessionalTemplate,
};

function PortfolioView() {
  const { userId, resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    async function fetchResume() {
      setLoading(true);
      const resumeRef = doc(db, "users", userId, "resumes", resumeId);
      const docSnap = await getDoc(resumeRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.education && typeof data.education === 'string') {
          data.education = [{ school: '', degree: data.education, year: '' }];
        }
        setResume(data);
      } else {
        setResume(null);
      }
      setLoading(false);
    }
    fetchResume();
  }, [userId, resumeId]);

  const handleDownloadPdf = () => {
    const input = document.getElementById('resume-view');
    if (!input) {
      toast.error("Resume content not found. Cannot generate PDF.");
      return;
    }
    setPdfLoading(true);
    toast.loading("Generating PDF... this may take a moment.");

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      
      // --- THE ABSOLUTE FINAL onclone SCRIPT ---
      onclone: (clonedDoc) => {
        const originalLinks = window.document.querySelectorAll('link[rel="stylesheet"]');
        originalLinks.forEach((link) => {
          // Get the raw href (e.g., /static/css/main.css)
          const href = link.getAttribute('href');
          if (href) {
            const newLink = clonedDoc.createElement('link');
            newLink.rel = 'stylesheet';
            // Construct the URL using the document's base URI, the most reliable method
            newLink.href = new URL(href, document.baseURI).href;
            clonedDoc.head.appendChild(newLink);
          }
        });
        // Also clone inline style blocks
        const originalStyles = window.document.querySelectorAll('style');
        originalStyles.forEach((style) => {
            clonedDoc.head.appendChild(style.cloneNode(true));
        });
      },
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`resume_${resume.name || "user"}.pdf`);
        toast.dismiss();
        toast.success("PDF downloaded successfully!");
      })
      .catch(err => {
        console.error("PDF generation failed:", err);
        toast.dismiss();
        toast.error("An error occurred while generating the PDF.");
      })
      .finally(() => {
        setPdfLoading(false);
      });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!resume) return <div className="min-h-screen flex items-center justify-center">Resume not found.</div>;

  const SelectedTemplate = templateMap[resume.template] || ModernTemplate;

  return (
    <>
      <NavBar />
      <div className="bg-gray-100 min-h-screen py-10 font-sans">
        <div className="max-w-4xl mx-auto"> 
          <div className="text-center mb-8">
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all font-bold disabled:bg-gray-400"
            >
              {pdfLoading ? "Generating PDF..." : "Download as PDF"}
            </button>
          </div>
          <div>
            <SelectedTemplate resume={resume} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PortfolioView;