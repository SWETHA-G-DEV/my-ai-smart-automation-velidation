import React from 'react';
import { CORRECTION_TEMPLATES, CorrectionTemplate } from '../utils/correctionAssistant';
import { X, Languages, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface CorrectionGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId?: string;
}

export const CorrectionGuidanceModal: React.FC<CorrectionGuidanceModalProps> = ({
  isOpen,
  onClose,
  selectedTemplateId,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = React.useState<string>(
    selectedTemplateId || CORRECTION_TEMPLATES[0].id
  );

  const activeTemplate =
    CORRECTION_TEMPLATES.find((t) => t.id === activeTab) || CORRECTION_TEMPLATES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Smart Correction Assistant / திருத்த வழிகாட்டி</h3>
              <p className="text-xs text-slate-300">Bilingual English &amp; Tamil Document Correction Guidance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
          {CORRECTION_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setActiveTab(tmpl.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
                activeTab === tmpl.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tmpl.category}: {tmpl.titleEn.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Header Title */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{activeTemplate.titleEn}</span>
            </div>
            <p className="text-xs font-semibold text-blue-800 mt-1">{activeTemplate.titleTa}</p>
          </div>

          {/* Bilingual Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* English Guidance */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>English Instructions</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-rose-700">What went wrong:</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeTemplate.problemEn}
                </p>
              </div>
              <div>
                <h5 className="text-xs font-bold text-emerald-700">How to fix it:</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeTemplate.solutionEn}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Sample Notification Sent to Student:
                </span>
                <p className="text-xs font-mono text-slate-800 mt-1 italic">
                  "{activeTemplate.exampleMessageEn}"
                </p>
              </div>
            </div>

            {/* Tamil Guidance */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>தமிழ் வழிகாட்டுதல் (Tamil Instructions)</span>
              </div>
              <div>
                <h5 className="text-xs font-bold text-rose-700">காரணம்:</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeTemplate.problemTa}
                </p>
              </div>
              <div>
                <h5 className="text-xs font-bold text-emerald-700">சரிசெய்யும் வழிமுறை:</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeTemplate.solutionTa}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  மாணவருக்கு அனுப்பப்படும் மாதிரி அறிவிப்பு:
                </span>
                <p className="text-xs font-mono text-slate-800 mt-1 italic">
                  "{activeTemplate.exampleMessageTa}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Understood / சரி
          </button>
        </div>
      </div>
    </div>
  );
};
