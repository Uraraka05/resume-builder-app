export function ProfessionalTemplate({ resume }) {
  // Helper function to safely split comma-separated text
  const getListItems = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text.split(',').map(item => item.trim()).filter(Boolean);
  };

  return (
    <div id="resume-view" className="bg-white shadow-lg w-full max-w-4xl mx-auto aspect-[210/297] p-10 font-sans text-gray-800 text-sm">
      {/* --- Header --- */}
      <header className="flex justify-between items-start pb-4 border-b-4 border-gray-800">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{resume.name || "Your Name"}</h1>
          <p className="text-lg text-blue-700 font-semibold">{resume.title || "Your Title"}</p>
        </div>
        <div className="text-right text-xs space-y-1">
          {resume.phone && <p>{resume.phone}</p>}
          {resume.email && <p>{resume.email}</p>}
          {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Profile</a>}
          {resume.website && <a href={resume.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Personal Website</a>}
        </div>
      </header>
  
      {/* --- Summary --- */}
      {resume.summary && (
        <section className="py-5">
          <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
        </section>
      )}
  
      {/* --- Experience Section --- */}
      <section className="pt-4">
        <h2 className="text-xl font-bold uppercase tracking-wider text-gray-700 mb-4">Experience</h2>
        <div className="space-y-6">
          {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
            <div key={i}>
              <p className="text-base font-bold text-blue-800">{exp.position}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold italic">{exp.company}</p>
                <p className="text-xs font-mono text-gray-500">{exp.years}</p>
              </div>
              {exp.responsibilities && (
                <ul className="list-disc pl-5 mt-2 text-xs space-y-1 text-gray-600">
                  {getListItems(exp.responsibilities).map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- Education, Skills, and Projects --- */}
      <section className="pt-6 mt-6 border-t-2 border-gray-200">
        <div className="grid grid-cols-3 gap-8">
            {/* Education */}
            <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">Education</h3>
                <div className="space-y-2 text-xs">
                  {resume.education?.map((edu, i) => (edu.school || edu.degree) && (
                    <div key={i}>
                      <p className="font-semibold">{edu.degree}</p>
                      <p>{edu.school}</p>
                      <p className="text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
            </div>
            {/* Skills */}
            <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">Skills</h3>
                <p className="text-gray-700 text-xs leading-snug">
                  {resume.skills?.filter(Boolean).join(' • ')}
                </p>
            </div>
            {/* Projects */}
            <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">Projects</h3>
                 <div className="space-y-2 text-xs">
                  {resume.projects?.map((proj, i) => proj.title && (
                    <div key={i}>
                      <p className="font-semibold">{proj.title}</p>
                      <p className="text-gray-600">{proj.description}</p>
                    </div>
                  ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}