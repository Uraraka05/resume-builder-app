import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../features/auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
      console.error("Resume element not found!");
      return;
    }
    setPdfLoading(true);

    html2canvas(input, { 
      // --- START OF THE ROBUST FIX ---
      onclone: (document) => {
        // Find all stylesheets and style blocks from the original document
        const styleAndLinkElements = Array.from(window.document.querySelectorAll('link[rel="stylesheet"], style'));
        
        // Append a clone of each to the head of the document that html2canvas will render
        styleAndLinkElements.forEach((item) => {
          document.head.appendChild(item.cloneNode(true));
        });
      },
      // --- END OF THE ROBUST FIX ---
      
      scale: 2,
      useCORS: true,
      // Setting explicit dimensions to help the renderer
      width: input.scrollWidth,
      height: input.scrollHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
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
      })
      .catch(err => {
        console.error("PDF generation failed:", err);
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
          <SelectedTemplate resume={resume} />
        </div>
      </div>
    </>
  );
}

export default PortfolioView;
