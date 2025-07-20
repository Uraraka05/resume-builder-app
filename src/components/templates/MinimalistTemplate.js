export function MinimalistTemplate({ resume }) {
  // Helper function to safely process comma-separated text
  const getListItems = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text.split(',').map(item => item.trim()).filter(Boolean);
  };

  return (
    <div id="resume-view" className="bg-white shadow-lg w-full max-w-4xl mx-auto aspect-[210/297] p-10 sm:p-12 font-sans">
      <div className="grid grid-cols-3 gap-10">

        {/* --- Left Column (Contact & Key Info) --- */}
        <div className="col-span-1 flex flex-col space-y-8">
          {/* Name & Title */}
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">{resume.name || "Your Name"}</h1>
            <p className="text-md text-gray-600 mt-1">{resume.title || "Your Title"}</p>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-widest">Contact</h3>
            <div className="mt-2 text-xs space-y-1 break-words">
              <p>{resume.email}</p>
              {resume.phone && <p>{resume.phone}</p>}
              {resume.linkedin && <a href={resume.linkedin} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">LinkedIn</a>}
              {resume.website && <a href={resume.website} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">Website</a>}
            </div>
          </div>
          
          {/* Education */}
          <div>
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-widest">Education</h3>
            <div className="mt-2 space-y-2 text-xs">
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
            <h3 className="font-bold text-gray-500 text-sm uppercase tracking-widest">Skills</h3>
            <ul className="mt-2 space-y-1 text-xs list-disc list-inside">
              {resume.skills?.map((skill, i) => skill && <li key={i}>{skill}</li>)}
            </ul>
          </div>
        </div>

        {/* --- Right Column (Main Content) --- */}
        <div className="col-span-2">
          {/* Summary */}
          {resume.summary && (
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800">Summary</h2>
                <div className="w-full border-b border-gray-300 mt-1 mb-2"></div>
                <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {/* Experience */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">Experience</h2>
            <div className="w-full border-b border-gray-300 mt-1 mb-2"></div>
            {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
              <div key={i} className="mb-4">
                <p className="font-bold text-base">{exp.position}</p>
                <p className="text-sm italic font-semibold text-gray-700">{exp.company}</p>
                <p className="text-xs text-gray-500 mb-1">{exp.years}</p>
                {exp.responsibilities && (
                  <ul className="list-disc pl-5 mt-1 text-xs space-y-1 text-gray-600">
                    {getListItems(exp.responsibilities).map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xl font-bold text-gray-800">Projects</h2>
            <div className="w-full border-b border-gray-300 mt-1 mb-2"></div>
            {resume.projects?.map((proj, i) => proj.title && (
              <div key={i} className="mb-3">
                <p className="font-bold text-base">{proj.title}</p>
                <p className="text-sm text-gray-600">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}