import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../features/auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import NavBar from "../components/NavBar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from 'react-hot-toast'; // We'll use this for better feedback

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

  // --- THIS IS THE DEFINITIVE PDF GENERATION FUNCTION ---
  const handleDownloadPdf = async () => {
    const input = document.getElementById('resume-view');
    if (!input) {
      toast.error("Resume content could not be found.");
      return;
    }

    setPdfLoading(true);
    toast.loading("Preparing styles for PDF generation...");

    // --- STEP 1: MANUALLY FETCH ALL CSS STYLES AS TEXT ---
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const cssPromises = stylesheets.map(sheet =>
      fetch(sheet.href).then(response => response.text())
    );

    try {
      // Wait for all CSS content to be fetched
      const cssStrings = await Promise.all(cssPromises);
      const allCss = cssStrings.join('\n');
      toast.dismiss();
      toast.loading("Generating PDF image...");

      // --- STEP 2: CALL HTML2CANVAS WITH THE FETCHED CSS ---
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true, // A fallback rendering method
        onclone: (clonedDoc) => {
          // --- STEP 3: INJECT THE CSS TEXT INTO A <style> TAG ---
          const style = clonedDoc.createElement('style');
          style.innerHTML = allCss;
          clonedDoc.head.appendChild(style);
        },
      });

      // --- STEP 4: CREATE AND SAVE THE PDF ---
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
      toast.success("PDF download complete!");

    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.dismiss();
      toast.error("Could not generate PDF. Check console for details.");
    } finally {
      setPdfLoading(false);
    }
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