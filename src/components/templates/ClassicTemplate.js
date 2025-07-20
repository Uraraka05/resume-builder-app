export function ClassicTemplate({ resume }) {
  // Helper function to safely process comma-separated responsibilities
  const getResponsibilities = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text.split(',').map(item => item.trim()).filter(Boolean);
  };

  return (
    <div id="resume-view" className="bg-white shadow-lg w-full max-w-4xl mx-auto aspect-[210/297] p-12 font-serif text-gray-800">
      {/* Header */}
      <div className="text-center border-b-4 border-gray-700 pb-4">
        <h1 className="text-5xl font-bold tracking-wider">{resume.name || "Your Name"}</h1>
        <p className="text-xl font-light mt-2">{resume.title || "Your Title"}</p>
        <p className="text-sm text-gray-600 mt-4">
          {resume.email}
          {resume.phone && `  •  ${resume.phone}`}
        </p>
        <div className="flex justify-center gap-6 mt-2 text-blue-700 text-sm">
          {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>}
          {resume.website && <a href={resume.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Personal Website</a>}
        </div>
      </div>
      
      <div className="mt-8 space-y-8">
        {/* Summary Section */}
        {resume.summary && (
          <div>
            <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3">Summary</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* --- UPDATED Experience Section --- */}
        <div>
          <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3">Experience</h2>
          {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
            <div key={i} className="mb-4">
              <p className="font-bold text-lg">{exp.position}</p>
              <div className="flex justify-between items-center text-sm text-gray-700">
                <p className="italic font-semibold">{exp.company}</p>
                <p className="font-light">{exp.years}</p>
              </div>
              {exp.responsibilities && (
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  {getResponsibilities(exp.responsibilities).map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* --- UPDATED Education Section --- */}
        <div>
          <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3">Education</h2>
          {resume.education?.map((edu, i) => (edu.school || edu.degree) && (
            <div key={i} className="mb-2 text-sm">
              <p className="font-bold">{edu.degree}</p>
              <p className="italic">{edu.school}</p>
              <p className="text-gray-600">{edu.year}</p>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div>
          <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3">Skills</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {resume.skills?.filter(Boolean).join('  •  ')}
          </p>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2 mb-3">Projects</h2>
          {resume.projects?.map((proj, i) => proj.title && (
            <div key={i} className="mb-3">
              <p className="font-bold text-lg">{proj.title}</p>
              <p className="text-sm mt-1">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}