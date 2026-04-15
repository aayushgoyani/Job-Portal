import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Plus,
  Trash2,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Linkedin,
} from "lucide-react";
import Header from "../LandingPage/components/Header";
import Footer from "../LandingPage/components/Footer";
import html2pdf from "html2pdf.js";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      summary: "",
    },
    education: [
      { id: 1, degree: "", school: "", graduationYear: "" }
    ],
    experience: [
      { id: 1, jobTitle: "", company: "", duration: "", description: "" }
    ],
    projects: [
      { id: 1, title: "", link: "", description: "" }
    ],
    skills: "",
  });

  useEffect(() => {
    if (user) {
      setResumeData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.name || prev.personal.fullName,
          email: user.email || prev.personal.email,
          phone: user.phone || prev.personal.phone,
          linkedin: user.linkedin || prev.personal.linkedin,
          // user model doesn't have address yet, but we can pre-fill what we have
        }
      }));
    }
  }, [user]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [name]: value },
    }));
  };

  const handleArrayChange = (category, index, field, value) => {
    setResumeData((prev) => {
      const newArray = [...prev[category]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [category]: newArray };
    });
  };

  const addItem = (category) => {
    setResumeData((prev) => {
      const newItem =
        category === "education"
          ? { id: Date.now(), degree: "", school: "", graduationYear: "" }
          : category === "experience"
          ? { id: Date.now(), jobTitle: "", company: "", duration: "", description: "" }
          : { id: Date.now(), title: "", link: "", description: "" };
      return { ...prev, [category]: [...prev[category], newItem] };
    });
  };

  const removeItem = (category, id) => {
    setResumeData((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  const downloadPDF = () => {
    setLoading(true);
    const element = document.getElementById("resume-preview");
    
    if (!element) {
      setLoading(false);
      return;
    }

    try {
      window.scrollTo(0, 0); // Ensure we are at the top for capture
      // Add a style tag to hide non-pdf elements during capture
      const style = document.createElement("style");
      style.id = "pdf-capture-style";
      style.textContent = `
        .no-pdf { visibility: hidden !important; }
        
        /* Comprehensive oklch to hex overrides for the entire document during capture */
        :root, body, div, span, h1, h2, h3, h4, h5, h6, p, a, b, i, svg {
          --color-blue-50: #eff6ff !important;
          --color-blue-100: #dbeafe !important;
          --color-blue-200: #bfdbfe !important;
          --color-blue-300: #93c5fd !important;
          --color-blue-400: #60a5fa !important;
          --color-blue-500: #3b82f6 !important;
          --color-blue-600: #2563eb !important;
          --color-blue-700: #1d4ed8 !important;
          --color-blue-800: #1e40af !important;
          --color-blue-900: #1e3a8a !important;
          --color-blue-950: #172554 !important;
          
          --color-gray-50: #f9fafb !important;
          --color-gray-100: #f3f4f6 !important;
          --color-gray-200: #e5e7eb !important;
          --color-gray-300: #d1d5db !important;
          --color-gray-400: #9ca3af !important;
          --color-gray-500: #6b7280 !important;
          --color-gray-600: #4b5563 !important;
          --color-gray-700: #374151 !important;
          --color-gray-800: #1f2937 !important;
          --color-gray-900: #111827 !important;
          --color-gray-950: #030712 !important;

          --color-purple-500: #a855f7 !important;
          --color-purple-600: #9333ea !important;
          --color-purple-700: #7e22ce !important;

          /* Force any oklch color function to black as a safe fallback for html2canvas */
          color-scheme: light !important;
        }

        #resume-preview {
          box-shadow: none !important;
          margin: 0 !important;
          padding: 40px !important;
          width: 800px !important; /* Fixed width for consistent capture */
          min-height: auto !important;
        }

        /* Ensure all text is dark */
        #resume-preview * {
          color: #111827 !important;
        }
        #resume-preview .text-blue-600 {
          color: #2563eb !important;
        }
        #resume-preview .text-gray-600 {
          color: #4b5563 !important;
        }
      `;
      document.head.appendChild(style);

      const fileName = (resumeData.personal.fullName || 'Resume').replace(/[^a-z0-9]/gi, '_') + '.pdf';
      
      const opt = {
        margin:       10,
        filename:     fileName,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2,
          useCORS: true, 
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate PDF directly from the element without cloning to ensure all styles are live
      const worker = html2pdf().from(element).set(opt).toPdf();
      
      // Give the browser a moment to apply the .no-pdf styles and settle icons
      setTimeout(() => {
        worker.save()
          .then(() => {
            if (document.getElementById("pdf-capture-style")) {
              document.head.removeChild(style);
            }
            setLoading(false);
          })
          .catch(err => {
            console.error("PDF download error:", err);
            if (document.getElementById("pdf-capture-style")) {
              document.head.removeChild(style);
            }
            setLoading(false);
            alert("Failed to generate PDF. Please try again.");
          });
      }, 500);
    } catch (error) {
      console.error("Error during PDF setup:", error);
      const s = document.getElementById("pdf-capture-style");
      if (s) document.head.removeChild(s);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <div className="no-pdf"><Header /></div>
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24">
        <div className="no-pdf mb-8 flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate('/profile')} 
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resume <span className="text-blue-600">Builder</span></h1>
            <p className="text-gray-500 font-medium">Create a professional resume in minutes.</p>
          </div>
          <button
            onClick={downloadPDF}
            disabled={loading}
            className="no-pdf flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {loading ? <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span> : <Download className="w-5 h-5" />}
            Download PDF
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 h-full">
          {/* Form Section */}
          <div className="no-pdf bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-8 space-y-8 overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-gray-200">
            
            {/* Personal Info */}
            <section className="space-y-4">
              <h2 className="text-xl font-black flex items-center gap-2 text-gray-900 border-b pb-2">
                <User className="w-5 h-5 text-blue-600" /> Personal Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input type="text" name="fullName" value={resumeData.personal.fullName} onChange={handlePersonalChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                  <input type="email" name="email" value={resumeData.personal.email} onChange={handlePersonalChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                  <input type="text" name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 234 567 890" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Address / Location</label>
                  <input type="text" name="address" value={resumeData.personal.address} onChange={handlePersonalChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="New York, NY" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">LinkedIn Profile</label>
                  <input type="text" name="linkedin" value={resumeData.personal.linkedin} onChange={handlePersonalChange} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://linkedin.com/in/username" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Summary (Objective)</label>
                  <textarea name="summary" value={resumeData.personal.summary} onChange={handlePersonalChange} rows="3" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="A brief professional summary..."></textarea>
                </div>
              </div>
            </section>

            {/* Experience */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-xl font-black flex items-center gap-2 text-gray-900">
                  <Briefcase className="w-5 h-5 text-blue-600" /> Experience
                </h2>
                <button onClick={() => addItem("experience")} className="text-xs flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full"><Plus className="w-3 h-3"/> Add</button>
              </div>
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 bg-gray-50 rounded-xl space-y-4 relative group border border-gray-100">
                  {resumeData.experience.length > 1 && (
                    <button onClick={() => removeItem("experience", exp.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Job Title</label>
                      <input type="text" value={exp.jobTitle} onChange={(e) => handleArrayChange("experience", index, "jobTitle", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Software Engineer" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Company</label>
                      <input type="text" value={exp.company} onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tech Corp" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Duration</label>
                      <input type="text" value={exp.duration} onChange={(e) => handleArrayChange("experience", index, "duration", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jan 2020 - Present" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Description (Tasks/Achievements)</label>
                      <textarea value={exp.description} onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)} rows="3" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Developed web applications using React..."></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-xl font-black flex items-center gap-2 text-gray-900">
                  <GraduationCap className="w-5 h-5 text-blue-600" /> Education
                </h2>
                <button onClick={() => addItem("education")} className="text-xs flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full"><Plus className="w-3 h-3"/> Add</button>
              </div>
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="p-4 bg-gray-50 rounded-xl space-y-4 relative group border border-gray-100">
                  {resumeData.education.length > 1 && (
                    <button onClick={() => removeItem("education", edu.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Degree/Course</label>
                      <input type="text" value={edu.degree} onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="B.S. Computer Science" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">School/University</label>
                      <input type="text" value={edu.school} onChange={(e) => handleArrayChange("education", index, "school", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="University of Tech" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Graduation Year</label>
                      <input type="text" value={edu.graduationYear} onChange={(e) => handleArrayChange("education", index, "graduationYear", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2022" />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Projects */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-xl font-black flex items-center gap-2 text-gray-900">
                  <FileText className="w-5 h-5 text-blue-600" /> Projects
                </h2>
                <button onClick={() => addItem("projects")} className="text-xs flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full"><Plus className="w-3 h-3"/> Add</button>
              </div>
              {resumeData.projects.map((proj, index) => (
                <div key={proj.id} className="p-4 bg-gray-50 rounded-xl space-y-4 relative group border border-gray-100">
                  {resumeData.projects.length > 1 && (
                    <button onClick={() => removeItem("projects", proj.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Project Title</label>
                      <input type="text" value={proj.title} onChange={(e) => handleArrayChange("projects", index, "title", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="E-commerce App" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Link (Optional)</label>
                      <input type="text" value={proj.link} onChange={(e) => handleArrayChange("projects", index, "link", e.target.value)} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://github.com/..." />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                      <textarea value={proj.description} onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)} rows="3" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Briefly describe what you built..."></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="space-y-4">
              <h2 className="text-xl font-black flex items-center gap-2 text-gray-900 border-b pb-2">
                <Wrench className="w-5 h-5 text-blue-600" /> Skills
              </h2>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Key Skills (Comma Separated)</label>
                <textarea value={resumeData.skills} onChange={(e) => setResumeData({...resumeData, skills: e.target.value})} rows="3" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="JavaScript, React, Node.js, HTML, CSS..."></textarea>
              </div>
            </section>
            
          </div>

          {/* Preview Section */}
          <div className="h-[800px] border border-gray-200 rounded-[2rem] bg-gray-300 flex justify-center overflow-y-auto p-4 md:p-8">
            <div id="resume-preview" className="bg-white w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 shadow-md">
              
              {/* Header */}
              <div className="border-b-2 border-gray-800 pb-6 mb-6">
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-wider mb-2">
                  {resumeData.personal.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600 font-medium">
                  {resumeData.personal.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-gray-800" style={{ marginTop: '1px' }} />
                      <span className="leading-none">{resumeData.personal.email}</span>
                    </div>
                  )}
                  {resumeData.personal.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-gray-800" style={{ marginTop: '1px' }} />
                      <span className="leading-none">{resumeData.personal.phone}</span>
                    </div>
                  )}
                  {resumeData.personal.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-800" style={{ marginTop: '1px' }} />
                      <span className="leading-none">{resumeData.personal.address}</span>
                    </div>
                  )}
                  {resumeData.personal.linkedin && (
                    <div className="flex items-center space-x-2">
                      <Linkedin className="w-3.5 h-3.5 text-gray-800" style={{ marginTop: '1px' }} />
                      <span className="leading-none">{resumeData.personal.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {resumeData.personal.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{resumeData.personal.summary}</p>
                </div>
              )}

              {/* Experience */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Professional Experience</h2>
                <div className="space-y-4">
                  {resumeData.experience.map((exp, idx) => (
                    (exp.jobTitle || exp.company || exp.description) && (
                      <div key={idx} className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-gray-900">{exp.jobTitle || "Job Title"}</h3>
                          <span className="text-sm text-gray-600 font-medium italic">{exp.duration}</span>
                        </div>
                        <div className="text-sm font-semibold text-blue-600 mb-2">{exp.company}</div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Education</h2>
                <div className="space-y-3">
                  {resumeData.education.map((edu, idx) => (
                    (edu.degree || edu.school) && (
                      <div key={idx} className="mb-2">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold text-gray-900">{edu.degree || "Degree"}</h3>
                          <span className="text-sm text-gray-600">{edu.graduationYear}</span>
                        </div>
                        <div className="text-sm text-gray-700">{edu.school}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Key Projects</h2>
                <div className="space-y-4">
                  {resumeData.projects.map((proj, idx) => (
                    (proj.title || proj.description) && (
                      <div key={idx} className="mb-4">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-gray-900">{proj.title || "Project Title"}</h3>
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                              Link <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{proj.description}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Skills */}
              {resumeData.skills && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Core Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.split(',').map((skill, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <div className="no-pdf"><Footer /></div>
    </div>
  );
};

export default ResumeBuilder;
