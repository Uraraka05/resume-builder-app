export function ClassicTemplate({ resume }) {
  return (
    <div id="resume-view" className="bg-white shadow-2xl w-full aspect-[210/297] p-12 font-serif">
      <div className="text-center border-b-2 pb-6 border-gray-300">
        <h1 className="text-4xl font-bold text-gray-800">{resume.name}</h1>
        <p className="text-md text-gray-600 mt-2">
          {resume.email} {resume.phone && `| ${resume.phone}`}
        </p>
        <div className="flex justify-center gap-4 mt-2 text-blue-600">
          {resume.linkedin && <a href={resume.linkedin}>LinkedIn</a>}
          {resume.website && <a href={resume.website}>Website</a>}
        </div>
      </div>
      
      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">Summary</h2>
          <p className="text-gray-700 text-sm">{resume.summary}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">Experience</h2>
          {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <p className="font-bold">{exp.position}</p>
                <p className="text-sm text-gray-600">{exp.years}</p>
              </div>
              <p className="italic text-gray-700">{exp.company}</p>
              {exp.responsibilities && (
                <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                  {exp.responsibilities.split(',').map((item, j) => item.trim() && <li key={j}>{item.trim()}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">Education</h2>
          <p className="text-gray-700 text-sm">{resume.education}</p>
        </div>
        <div>
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">Skills</h2>
          <p className="text-gray-700 text-sm">{resume.skills?.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}