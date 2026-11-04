import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowRight, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

interface StudentLoginPageProps {
  setCurrentView: (view: string) => void;
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({ setCurrentView }) => {
  const { loginStudent, switchDemoUser, students } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginStudent(email, password);
    if (success) {
      setCurrentView('student-dashboard');
    } else {
      setError('Invalid student email or password. You can also pick a demo profile below.');
    }
  };

  const handleDemoSelect = (stdId: string) => {
    switchDemoUser('student', stdId);
    setCurrentView('student-dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Student Portal Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your admission application, upload certificates, and view validation status.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. kavitha@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Sign In to Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            Don't have an application yet?{' '}
            <button
              onClick={() => setCurrentView('student-register')}
              className="text-blue-700 font-bold hover:underline"
            >
              Register New Candidate
            </button>
          </p>
        </div>

        {/* 1-Click Fast Fill Demo Accounts */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Quick 1-Click Test Accounts:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoSelect('std-01')}
              className="p-2 border border-slate-200 rounded-lg text-left hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="font-bold text-slate-900">Kavitha Raman</div>
              <div className="text-[10px] text-emerald-600 font-semibold">100% Verified</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect('std-02')}
              className="p-2 border border-slate-200 rounded-lg text-left hover:bg-amber-50 hover:border-amber-300 transition"
            >
              <div className="font-bold text-slate-900">Rahul Sharma</div>
              <div className="text-[10px] text-amber-600 font-semibold">Correction Needed</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
