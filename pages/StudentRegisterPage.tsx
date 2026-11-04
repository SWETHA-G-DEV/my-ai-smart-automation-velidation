import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { SubjectMark } from '../types';

interface StudentRegisterPageProps {
  setCurrentView: (view: string) => void;
}

export const StudentRegisterPage: React.FC<StudentRegisterPageProps> = ({ setCurrentView }) => {
  const { registerStudent, courseRules } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    registerNumber: '',
    courseApplied: courseRules[0]?.courseName || 'B.E. Computer Science & Engineering',
    quota: 'General' as const,
    boardName: 'Tamil Nadu State Board',
    passingYear: '2024',
  });

  const [marks, setMarks] = useState<SubjectMark[]>([
    { name: 'Language / Tamil', maxMarks: 100, enteredMarks: 90 },
    { name: 'English', maxMarks: 100, enteredMarks: 85 },
    { name: 'Mathematics', maxMarks: 100, enteredMarks: 92 },
    { name: 'Physics', maxMarks: 100, enteredMarks: 88 },
    { name: 'Chemistry', maxMarks: 100, enteredMarks: 86 },
    { name: 'Computer Science', maxMarks: 100, enteredMarks: 94 },
  ]);

  const handleMarkChange = (index: number, val: string) => {
    const num = Math.min(100, Math.max(0, Number(val) || 0));
    const next = [...marks];
    next[index] = { ...next[index], enteredMarks: num };
    setMarks(next);
  };

  const total = marks.reduce((acc, m) => acc + (m.enteredMarks || 0), 0);
  const percentage = Number(((total / 600) * 100).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerStudent({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
      registerNumber: formData.registerNumber,
      courseApplied: formData.courseApplied,
      quota: formData.quota,
      boardName: formData.boardName,
      passingYear: formData.passingYear,
      subjects: marks,
      totalEnteredMarks: total,
      enteredPercentage: percentage,
    });

    setCurrentView('student-dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">New Applicant Registration</h2>
              <p className="text-xs text-slate-300">
                Enroll your admission application for automated document validation &amp; counseling
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Personal Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 pb-1 border-b border-slate-100">
              1. Candidate Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (as per 10th Marksheet) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. S. Harish Kumar"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email ID *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="harish@gmail.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Set your admission portal password"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  12th Board Registration No *
                </label>
                <input
                  type="text"
                  required
                  value={formData.registerNumber}
                  onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                  placeholder="e.g. 7112099"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quota / Category *</label>
                <select
                  value={formData.quota}
                  onChange={(e) => setFormData({ ...formData, quota: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="General">Open Competition / General (OC)</option>
                  <option value="BC">Backward Class (BC)</option>
                  <option value="MBC">Most Backward Class (MBC / DNC)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="Sports / Special">Sports / Differently Abled Quota</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic & Course Choice */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 pb-1 border-b border-slate-100">
              2. Course &amp; Qualifying Board
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Applied *</label>
                <select
                  value={formData.courseApplied}
                  onChange={(e) => setFormData({ ...formData, courseApplied: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  {courseRules.map((c) => (
                    <option key={c.courseCode} value={c.courseName}>
                      {c.courseName} ({c.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifying School Board</label>
                <select
                  value={formData.boardName}
                  onChange={(e) => setFormData({ ...formData, boardName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="Tamil Nadu State Board">Tamil Nadu Higher Secondary (State Board)</option>
                  <option value="Central Board of Secondary Education (CBSE)">CBSE</option>
                  <option value="Council for Indian School Certificate Examinations (ICSE)">ICSE</option>
                  <option value="Other Recognized State Board">Other Recognized State Board</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Passing Year</label>
                <input
                  type="text"
                  value={formData.passingYear}
                  onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Academic Marks Entry */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                3. Self-Reported 12th Marks (To be validated via OCR)
              </h3>
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                Total: {total} / 600 ({percentage}%)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {marks.map((m, idx) => (
                <div key={m.name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-semibold text-slate-800 block truncate" title={m.name}>
                    {m.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={m.enteredMarks}
                      onChange={(e) => handleMarkChange(idx, e.target.value)}
                      className="w-16 px-2 py-1 text-center font-bold text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                    <span className="text-[11px] text-slate-400 font-mono">/ 100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentView('student-login')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Already applied? Login here
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Submit &amp; Open Document Uploader</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
