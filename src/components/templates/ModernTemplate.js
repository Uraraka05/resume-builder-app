export function ModernTemplate({ resume }) {
  // A helper function to safely split responsibilities
  const getResponsibilities = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text.split(',').map(item => item.trim()).filter(Boolean);
  };

  return (
    // The main container for the resume view
    <div id="resume-view" className="bg-white shadow-2xl flex w-full max-w-4xl mx-auto aspect-[210/297] font-sans">

      {/* Left Column (Dark) */}
      <div className="w-1/3 bg-gray-800 text-white p-6 flex flex-col">
        {/* Contact Section */}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Contact</h2>
          <div className="w-1/4 border-b-2 border-blue-300 my-2"></div>
          <div className="text-xs mt-3 space-y-3 break-words">
            {resume.email && <p>📧 {resume.email}</p>}
            {resume.phone && <p>📱 {resume.phone}</p>}
            {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 block">🔗 LinkedIn</a>}
            {resume.website && <a href={resume.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 block">🌐 Website</a>}
          </div>
        </div>

        {/* --- UPDATED Education Section --- */}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Education</h2>
          <div className="w-1/4 border-b-2 border-blue-300 my-2"></div>
          {resume.education?.map((edu, i) => (edu.school || edu.degree) && (
            <div key={i} className="mt-3 text-xs">
              <p className="font-semibold">{edu.degree}</p>
              <p className="italic">{edu.school}</p>
              {edu.year && <p className="text-gray-400">{edu.year}</p>}
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Skills</h2>
          <div className="w-1/4 border-b-2 border-blue-300 my-2"></div>
          <ul className="mt-3 space-y-1 text-xs list-disc list-inside">
            {resume.skills?.map((skill, i) => skill && <li key={i}>{skill}</li>)}
          </ul>
        </div>
      </div>

      {/* Right Column (Light) */}
      <div className="w-2/3 p-8 text-gray-800 overflow-y-auto">
        {/* Header with Name and Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">{resume.name || "Your Name"}</h1>
          <p className="text-xl text-blue-600 font-medium mt-1">{resume.title || "Your Title"}</p>
        </div>

        {/* Summary Section */}
        {resume.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b-4 border-gray-200 pb-2">Summary</h2>
            <p className="mt-3 text-sm leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* --- UPDATED Experience Section --- */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 border-b-4 border-gray-200 pb-2">Experience</h2>
          {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
            <div key={i} className="mt-4">
              {/* Position */}
              <p className="font-bold text-lg text-gray-900">{exp.position}</p>
              {/* Company & Years - This layout is now changed */}
              <div className="flex justify-between items-center mt-1">
                <p className="text-md italic font-semibold text-gray-700">{exp.company}</p>
                <p className="text-xs font-mono text-gray-500">{exp.years}</p>
              </div>
              {/* Responsibilities */}
              {exp.responsibilities && (
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  {getResponsibilities(exp.responsibilities).map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 border-b-4 border-gray-200 pb-2">Projects</h2>
          {resume.projects?.map((proj, i) => proj.title && (
            <div key={i} className="mt-4">
              <p className="font-bold text-lg">{proj.title}</p>
              <p className="text-sm mt-1">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}