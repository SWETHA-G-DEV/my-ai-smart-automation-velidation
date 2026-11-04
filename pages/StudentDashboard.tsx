import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { EligibilityBadge } from '../components/EligibilityBadge';
import { DocumentUploadCard } from '../components/DocumentUploadCard';
import { MarksValidationTable } from '../components/MarksValidationTable';
import { CorrectionGuidanceModal } from '../components/CorrectionGuidanceModal';
import { evaluateAdmissionEligibility } from '../utils/validation';
import { generateVerificationPdfReport } from '../utils/pdfGenerator';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Download,
  Camera,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentDashboard: React.FC = () => {
  const {
    activeStudent,
    documents,
    documentRequirements,
    courseRules,
    updateStudentMarks,
    resolveCorrection,
  } = useApp();

  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();

  if (!activeStudent) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-500">No active student session found. Please login or select a demo profile.</p>
      </div>
    );
  }

  const studentDocs = documents.filter((d) => d.studentId === activeStudent.id);
  const mark12Doc = studentDocs.find((d) => d.docType === 'marksheet_12');
  const photoDoc = studentDocs.find((d) => d.docType === 'photo');

  // Mandatory requirements calculation
  const mandatoryReqs = documentRequirements.filter(
    (r) => r.isRequired || (r.type === 'community_certificate' && activeStudent.quota !== 'General')
  );

  const uploadedMandatoryCount = mandatoryReqs.filter((req) =>
    studentDocs.some((d) => d.docType === req.type)
  ).length;

  const missingDocs = mandatoryReqs.filter(
    (req) => !studentDocs.some((d) => d.docType === req.type)
  );

  const verificationProgress = Math.round((uploadedMandatoryCount / mandatoryReqs.length) * 100);

  const eligibility = evaluateAdmissionEligibility(activeStudent, courseRules);

  const handleDownloadPdf = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
    generateVerificationPdfReport(activeStudent, studentDocs, courseRules);
  };

  const openCorrection = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setIsGuidanceOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-900/60">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {activeStudent.name}!
            </h1>
            <StatusBadge status={activeStudent.status} size="lg" />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono">
            <span>Application ID: <strong>{activeStudent.applicationId}</strong></span>
            <span>•</span>
            <span>12th Reg: <strong>{activeStudent.registerNumber}</strong></span>
            <span>•</span>
            <span>Course: <strong>{activeStudent.courseApplied}</strong></span>
            <span>•</span>
            <span>Quota: <strong>{activeStudent.quota}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Official Verification PDF</span>
          </button>
        </div>
      </div>

      {/* Verification Pipeline Step Tracker */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Admission Verification Lifecycle
          </span>
          <span className="text-xs font-bold text-blue-900">
            Document Completion: {verificationProgress}%
          </span>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              studentDocs.length > 0
                ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <p className="font-bold">Documents Uploaded</p>
              <p className="text-[11px] text-slate-500">
                {studentDocs.length} of {documentRequirements.length} files
              </p>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              mark12Doc?.ocrResult
                ? 'bg-blue-50/80 border-blue-200 text-blue-900'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <p className="font-bold">OCR Marks Extraction</p>
              <p className="text-[11px] text-slate-500">
                {mark12Doc?.ocrResult ? `Extracted (${mark12Doc.ocrResult.confidence}%)` : 'Upload 12th Marksheet'}
              </p>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              photoDoc?.photoQuality
                ? photoDoc.photoQuality.isBlurry
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <p className="font-bold">Photo Quality Audit</p>
              <p className="text-[11px] text-slate-500">
                {photoDoc?.photoQuality ? `Score ${photoDoc.photoQuality.score}/100` : 'Upload Passport Photo'}
              </p>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              activeStudent.status === 'Verified'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : activeStudent.status === 'Correction Required'
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 ${
                activeStudent.status === 'Verified' ? 'bg-emerald-600' : 'bg-slate-400'
              }`}
            >
              4
            </div>
            <div>
              <p className="font-bold">Admin Verification</p>
              <p className="text-[11px] text-slate-500">{activeStudent.status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Correction Notifications (Tamil & English) */}
      {activeStudent.correctionsRequested && activeStudent.correctionsRequested.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Immediate Attention Required: {activeStudent.correctionsRequested.length} Correction Notification(s)</span>
            </div>
            <button
              onClick={() => openCorrection('blurry_photo')}
              className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-200 px-3 py-1 rounded-lg transition"
            >
              Open Tamil / English Guide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeStudent.correctionsRequested.map((corr) => (
              <div key={corr.id} className="p-4 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider">
                    Doc: {corr.docType.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                    Action Pending
                  </span>
                </div>
                <p className="text-xs text-slate-700">{corr.messageEn}</p>
                <p className="text-xs font-semibold text-blue-900 italic border-t border-slate-100 pt-1.5">
                  {corr.messageTa}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Notified: {corr.requestedAt}</span>
                  <button
                    onClick={() => resolveCorrection(activeStudent.id, corr.id)}
                    className="text-[11px] text-emerald-700 font-bold hover:underline"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Uploaded */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Documents Uploaded</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {studentDocs.length} <span className="text-sm font-normal text-slate-500">/ {documentRequirements.length}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {missingDocs.length === 0 ? 'All mandatory files submitted' : `${missingDocs.length} mandatory file(s) pending`}
          </p>
        </div>

        {/* Card 2: Photo Quality */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Photo Quality Biometrics</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {photoDoc?.photoQuality ? `${photoDoc.photoQuality.score} / 100` : 'Not Checked'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {photoDoc?.photoQuality
              ? photoDoc.photoQuality.isBlurry
                ? 'Out of focus / blurry'
                : 'Sharp & compliant'
              : 'Passport photo pending'}
          </p>
        </div>

        {/* Card 3: Marksheet Verification */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Aggregate</span>
          <div className="text-2xl font-black text-blue-900 mt-1">
            {activeStudent.totalEnteredMarks} <span className="text-sm font-normal text-slate-500">({activeStudent.enteredPercentage}%)</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">6 subjects evaluated</p>
        </div>

        {/* Card 4: Cutoff & Course Eligibility */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Admission Eligibility</span>
          <div className="mt-1">
            <EligibilityBadge evaluation={eligibility} />
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate" title={eligibility.ruleName}>
            {eligibility.ruleName}
          </p>
        </div>
      </div>

      {/* Academic Marks Cross-Verification Table */}
      <section className="space-y-3">
        <MarksValidationTable
          subjects={activeStudent.subjects}
          ocrResult={mark12Doc?.ocrResult}
          isStudentMode={true}
          onUpdateMarks={(updated) => updateStudentMarks(activeStudent.id, updated)}
        />
      </section>

      {/* Document Upload Checklist Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Document Upload Checklist</h2>
            <p className="text-xs text-slate-500">
              Upload clear PDF, JPG or PNG certificates. High-contrast scans yield 100% OCR accuracy.
            </p>
          </div>
          <div className="text-xs text-slate-500 hidden sm:block">
            <span>Supported: PDF, JPG, PNG (Max 10MB each)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documentRequirements.map((req) => {
            const uploaded = studentDocs.find((d) => d.docType === req.type);
            return (
              <DocumentUploadCard
                key={req.type}
                requirement={req}
                uploadedDoc={uploaded}
                studentId={activeStudent.id}
                isStudentView={true}
              />
            );
          })}
        </div>
      </section>

      {/* Smart Correction Assistant Modal */}
      <CorrectionGuidanceModal
        isOpen={isGuidanceOpen}
        onClose={() => setIsGuidanceOpen(false)}
        selectedTemplateId={selectedTemplateId}
      />
    </div>
  );
};
