// src/components/templates/ProfessionalTemplate.js

export function ProfessionalTemplate({ resume }) {
    return (
      <div id="resume-view" className="bg-white shadow-2xl w-full aspect-[210/297] p-10 font-sans text-sm">
        {/* --- Header --- */}
        <div className="flex justify-between items-start pb-4 border-b-2 border-gray-800">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{resume.name || "John Smith"}</h1>
            <p className="text-lg text-gray-600">{/* Add a 'title' field for "Project Manager" */}</p>
          </div>
          <div className="text-right text-xs text-gray-600">
            {resume.phone && <p>{resume.phone}</p>}
            {resume.email && <p>{resume.email}</p>}
            {resume.linkedin && <p><a href={resume.linkedin}>LinkedIn</a></p>}
            {resume.website && <p><a href={resume.website}>Website</a></p>}
          </div>
        </div>
  
        {/* --- Summary --- */}
        <div className="py-4">
          <p className="text-gray-700">{resume.summary}</p>
        </div>
  
        {/* --- Main Content using Grid --- */}
        <div className="grid grid-cols-12 gap-8">
          {/* --- Left Timeline Column --- */}
          <div className="col-span-2">
            <h3 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-4">Experience</h3>
            <div className="h-full border-l-2 border-gray-200">
              {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
                <div key={i} className="relative pl-4 pb-8">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 bg-gray-400 rounded-full"></div>
                  <p className="text-xs text-gray-500">{exp.years}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* --- Right Content Column --- */}
          <div className="col-span-10">
            {/* Empty div to align with the title */}
            <div className="h-10"></div> 
            {resume.experience?.map((exp, i) => (exp.company || exp.position) && (
              <div key={i} className="pb-8">
                <p className="font-bold">{exp.position}</p>
                <p className="text-sm text-gray-600">{exp.company}</p>
                {exp.responsibilities && (
                  <ul className="list-disc pl-5 mt-1 text-xs space-y-1 text-gray-600">
                    {exp.responsibilities.split(',').map((item, j) => item.trim() && <li key={j}>{item.trim()}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- Other Sections --- */}
        <div className="grid grid-cols-2 gap-8 pt-4 border-t-2 border-gray-200">
            <div>
                <h3 className="font-bold text-gray-800 mb-2">Education</h3>
                <p className="text-gray-700">{resume.education}</p>
            </div>
            <div>
                <h3 className="font-bold text-gray-800 mb-2">Skills</h3>
                <p className="text-gray-700">{resume.skills?.join(', ')}</p>
            </div>
        </div>
      </div>
    );
  }
