export function MinimalistTemplate({ resume }) {
    return (
      <div id="resume-view" className="bg-white shadow-2xl w-full aspect-[210/297] p-12 font-sans">
        <div className="grid grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="col-span-1">
            <h1 className="text-3xl font-bold text-gray-800">{resume.name}</h1>
            <div className="mt-8 space-y-4 text-sm">
                <div>
                    <h3 className="font-bold text-gray-500 uppercase tracking-widest">Contact</h3>
                    <p className="mt-1 break-all">{resume.email}</p>
                    <p>{resume.phone}</p>
                </div>
                <div>
                    <h3 className="font-bold text-gray-500 uppercase tracking-widest">Education</h3>
                    <p className="mt-1">{resume.education}</p>
                </div>
                <div>
                    <h3 className="font-bold text-gray-500 uppercase tracking-widest">Skills</h3>
                    <ul className="mt-1 space-y-1">
                        {resume.skills?.map((skill, i) => skill && <li key={i}>{skill}</li>)}
                    </ul>
                </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="col-span-2">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800">Summary</h2>
                <div className="w-1/4 border-b-2 border-gray-300 mt-1 mb-2"></div>
                <p className="text-sm text-gray-700">{resume.summary}</p>
            </div>
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800">Experience</h2>
                <div className="w-1/4 border-b-2 border-gray-300 mt-1 mb-2"></div>
                {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
                  <div key={i} className="mb-3">
                    <p className="font-bold">{exp.position}</p>
                    <p className="text-sm text-gray-600">{exp.company} | {exp.years}</p>
                    {exp.responsibilities && (
                        <ul className="list-disc pl-5 mt-1 text-xs space-y-1 text-gray-600">
                        {exp.responsibilities.split(',').map((item, j) => item.trim() && <li key={j}>{item.trim()}</li>)}
                        </ul>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
