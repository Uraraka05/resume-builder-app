export function ModernTemplate({ resume }) {
  return (
    <div id="resume-view" className="bg-white shadow-2xl flex w-full aspect-[210/297]">
      {/* Left Column (Dark) */}
      <div className="w-1/3 bg-gray-800 text-white p-8">
        {resume.photoUrl && (
          <img src={resume.photoUrl} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-6 ring-4 ring-gray-600"/>
        )}
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Contact</h2>
          <div className="w-1/4 border-b-2 border-blue-300 my-2"></div>
          <div className="text-sm mt-2 space-y-2 break-all">
            <p>📧 {resume.email}</p>
            {resume.phone && <p>📱 {resume.phone}</p>}
            {resume.linkedin && <a href={resume.linkedin} className="hover:underline">🔗 LinkedIn</a>}
            {resume.website && <a href={resume.website} className="hover:underline">🌐 Website</a>}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Education</h2>
          <div className="w-1/4 border-b-2 border-blue-300 my-2"></div>
          <p className="text-sm mt-2">{resume.education}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Skills</h2>
          <div className="w-1/4 border-b-2 border-blue-300 my-2"></div>
          <ul className="mt-2 space-y-1 text-sm">
            {resume.skills?.map((skill, i) => skill && <li key={i}>• {skill}</li>)}
          </ul>
        </div>
      </div>
      {/* Right Column (Light) */}
      <div className="w-2/3 p-8 text-gray-700">
        <div className="mb-8 text-left">
          <h1 className="text-5xl font-bold text-gray-800">{resume.name}</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-gray-300 pb-2">Summary</h2>
          <p className="mt-4 text-sm">{resume.summary}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-gray-300 pb-2">Experience</h2>
          {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
            <div key={i} className="mt-4">
              <div className="flex justify-between items-baseline">
                <p className="font-bold text-lg">{exp.position}</p>
                <p className="text-xs font-semibold text-gray-500">{exp.years}</p>
              </div>
              <p className="text-md italic text-gray-600">{exp.company}</p>
              {exp.responsibilities && (
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  {exp.responsibilities.split(',').map((item, j) => item.trim() && <li key={j}>{item.trim()}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-gray-300 pb-2">Projects</h2>
          {resume.projects?.map((proj, i) => proj.title && (
            <div key={i} className="mt-4">
              <p className="font-bold text-lg">{proj.title}</p>
              <p className="text-sm">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
