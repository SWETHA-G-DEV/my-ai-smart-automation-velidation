import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminUser,
  ApplicationStatus,
  CourseEligibilityRule,
  DocumentRequirement,
  DocumentType,
  Student,
  SubjectMark,
  UploadedDocument,
  OcrResult,
  PhotoQualityResult,
} from '../types';
import {
  DEMO_ADMIN,
  INITIAL_COURSES,
  INITIAL_DOCUMENT_REQUIREMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_STUDENTS,
} from '../data/demoData';
import { computeFileHash, checkDuplicateDocument } from '../utils/crypto';
import { analyzePhotoQuality } from '../utils/photoQuality';
import { extractMarksheetData } from '../utils/ocrService';

interface AppContextType {
  currentUser: {
    role: 'guest' | 'student' | 'admin';
    student?: Student;
    admin?: AdminUser;
  };
  students: Student[];
  documents: UploadedDocument[];
  courseRules: CourseEligibilityRule[];
  documentRequirements: DocumentRequirement[];
  activeStudent: Student | null; // Currently logged in student or student being inspected by admin
  isOcrProcessing: boolean;
  ocrProgress: { status: string; progress: number } | null;

  // Auth actions
  loginStudent: (email: string, pass: string) => boolean;
  registerStudent: (student: Omit<Student, 'id' | 'applicationId' | 'appliedDate' | 'status' | 'correctionsRequested'>) => Student;
  loginAdmin: (email: string, pass: string) => boolean;
  logout: () => void;
  switchDemoUser: (role: 'admin' | 'student', studentId?: string) => void;
  resetAllData: () => void;

  // Student Actions
  uploadDocument: (file: File | Blob, docType: DocumentType, studentId: string, customFileName?: string) => Promise<UploadedDocument>;
  removeDocument: (docId: string) => void;
  updateStudentMarks: (studentId: string, subjects: SubjectMark[]) => void;
  loadSampleDocumentForTesting: (studentId: string, docType: DocumentType, scenario?: string) => Promise<void>;
  resolveCorrection: (studentId: string, correctionId: string) => void;

  // Admin Actions
  adminReviewApplication: (
    studentId: string,
    status: ApplicationStatus,
    adminNotes?: string,
    corrections?: Array<{ docType: DocumentType; messageEn: string; messageTa: string }>
  ) => void;
  updateCourseRules: (newRules: CourseEligibilityRule[]) => void;
  updateDocumentRequirements: (newReqs: DocumentRequirement[]) => void;
  setActiveStudentForInspection: (student: Student | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'smartadmit_students_v1',
  DOCS: 'smartadmit_docs_v1',
  RULES: 'smartadmit_rules_v1',
  REQS: 'smartadmit_reqs_v1',
  AUTH: 'smartadmit_auth_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return stored ? JSON.parse(stored) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [documents, setDocuments] = useState<UploadedDocument[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DOCS);
      return stored ? JSON.parse(stored) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [courseRules, setCourseRules] = useState<CourseEligibilityRule[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RULES);
      return stored ? JSON.parse(stored) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REQS);
      return stored ? JSON.parse(stored) : INITIAL_DOCUMENT_REQUIREMENTS;
    } catch {
      return INITIAL_DOCUMENT_REQUIREMENTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<{
    role: 'guest' | 'student' | 'admin';
    student?: Student;
    admin?: AdminUser;
  }>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.role === 'admin') return { role: 'admin', admin: DEMO_ADMIN };
        if (parsed.role === 'student' && parsed.studentId) {
          const s = INITIAL_STUDENTS.find((item) => item.id === parsed.studentId) || INITIAL_STUDENTS[0];
          return { role: 'student', student: s };
        }
      }
    } catch {
      // Fallback to guest
    }
    return { role: 'guest' };
  });

  const [activeStudentForAdmin, setActiveStudentForAdmin] = useState<Student | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<{ status: string; progress: number } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage quota exceeded for students', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(documents));
    } catch (e) {
      console.warn('Storage quota exceeded for documents', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(courseRules));
    } catch (e) {
      console.warn('Storage quota exceeded for rules', e);
    }
  }, [courseRules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQS, JSON.stringify(documentRequirements));
    } catch (e) {
      console.warn('Storage quota exceeded for requirements', e);
    }
  }, [documentRequirements]);

  // Keep active student in sync
  const activeStudent: Student | null =
    currentUser.role === 'student' && currentUser.student
      ? students.find((s) => s.id === currentUser.student?.id) || currentUser.student
      : activeStudentForAdmin;

  // Authentication
  const loginStudent = (email: string, pass: string): boolean => {
    const student = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (student && (!student.password || student.password === pass)) {
      const user = { role: 'student' as const, student };
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ role: 'student', studentId: student.id }));
      return true;
    }
    return false;
  };

  const registerStudent = (
    newStudentData: Omit<Student, 'id' | 'applicationId' | 'appliedDate' | 'status' | 'correctionsRequested'>
  ): Student => {
    const id = `std-${Date.now()}`;
    const nextNum = students.length + 105;
    const applicationId = `SA-2024-00${nextNum}`;
    const appliedDate = new Date().toISOString().split('T')[0];

    const student: Student = {
      ...newStudentData,
      id,
      applicationId,
      appliedDate,
      status: 'Submitted',
      correctionsRequested: [],
    };

    setStudents((prev) => [student, ...prev]);
    setCurrentUser({ role: 'student', student });
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ role: 'student', studentId: student.id }));
    return student;
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    if (email.toLowerCase() === DEMO_ADMIN.email.toLowerCase() && pass === 'admin123') {
      setCurrentUser({ role: 'admin', admin: DEMO_ADMIN });
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ role: 'admin' }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser({ role: 'guest' });
    setActiveStudentForAdmin(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const switchDemoUser = (role: 'admin' | 'student', studentId?: string) => {
    if (role === 'admin') {
      setCurrentUser({ role: 'admin', admin: DEMO_ADMIN });
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ role: 'admin' }));
    } else {
      const target = students.find((s) => s.id === studentId) || students[0];
      setCurrentUser({ role: 'student', student: target });
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ role: 'student', studentId: target.id }));
    }
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.DOCS);
    localStorage.removeItem(STORAGE_KEYS.RULES);
    localStorage.removeItem(STORAGE_KEYS.REQS);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    setStudents(INITIAL_STUDENTS);
    setDocuments(INITIAL_DOCUMENTS);
    setCourseRules(INITIAL_COURSES);
    setDocumentRequirements(INITIAL_DOCUMENT_REQUIREMENTS);
    setCurrentUser({ role: 'guest' });
    setActiveStudentForAdmin(null);
  };

  // Upload Document with SHA-256, OCR, and Photo Quality Analysis
  const uploadDocument = async (
    file: File | Blob,
    docType: DocumentType,
    studentId: string,
    customFileName?: string
  ): Promise<UploadedDocument> => {
    // 1. Compute Hash for Duplicate Check
    const hash = await computeFileHash(file);
    const existingStudentDocs = documents.filter((d) => d.studentId === studentId && d.docType !== docType);
    const duplicateCheck = checkDuplicateDocument(hash, existingStudentDocs);

    // 2. Read as Data URL
    const fileDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const fileName = customFileName || (file instanceof File ? file.name : `${docType}_document.png`);
    const mimeType = file.type || 'image/png';
    const fileSize = file.size;

    let photoQuality: PhotoQualityResult | undefined;
    let ocrResult: OcrResult | undefined;
    let verificationStatus: UploadedDocument['verificationStatus'] = 'Pending';

    // 3. Document-specific processing
    if (docType === 'photo') {
      try {
        photoQuality = await analyzePhotoQuality(fileDataUrl);
        if (photoQuality.isBlurry || photoQuality.score < 50) {
          verificationStatus = 'Correction Required';
        } else {
          verificationStatus = 'Valid';
        }
      } catch (err) {
        console.error('Photo analysis error:', err);
      }
    } else if (docType === 'marksheet_12' || docType === 'marksheet_10') {
      try {
        setIsOcrProcessing(true);
        ocrResult = await extractMarksheetData(fileDataUrl, (prog) => {
          setOcrProgress(prog);
        });

        if (ocrResult.subjects && ocrResult.subjects.length > 0) {
          verificationStatus = 'Pending';
        } else {
          verificationStatus = 'Needs Review';
        }
      } catch (err) {
        console.error('OCR processing error:', err);
      } finally {
        setIsOcrProcessing(false);
        setOcrProgress(null);
      }
    }

    const docId = `doc-${studentId}-${docType}-${Date.now()}`;
    const reqItem = documentRequirements.find((r) => r.type === docType);

    const newDoc: UploadedDocument = {
      id: docId,
      studentId,
      docType,
      title: reqItem ? reqItem.title : docType.replace('_', ' ').toUpperCase(),
      fileName,
      fileSize,
      mimeType,
      fileDataUrl,
      uploadDate: new Date().toISOString().split('T')[0],
      fileHash: hash,
      ocrResult,
      photoQuality,
      isDuplicate: duplicateCheck.isDuplicate,
      duplicateWarning: duplicateCheck.isDuplicate
        ? `Identical file matches previously uploaded "${duplicateCheck.duplicateWithTitle}". Please confirm valid certificate.`
        : undefined,
      verificationStatus,
    };

    // Replace if same docType exists for this student, otherwise append
    setDocuments((prev) => {
      const filtered = prev.filter((d) => !(d.studentId === studentId && d.docType === docType));
      return [...filtered, newDoc];
    });

    return newDoc;
  };

  const removeDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const updateStudentMarks = (studentId: string, subjects: SubjectMark[]) => {
    const total = subjects.reduce((acc, s) => acc + (Number(s.enteredMarks) || 0), 0);
    const max = subjects.length * 100;
    const percentage = max > 0 ? Number(((total / max) * 100).toFixed(2)) : 0;

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          subjects,
          totalEnteredMarks: total,
          enteredPercentage: percentage,
        };
      })
    );
  };

  const resolveCorrection = (studentId: string, correctionId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          correctionsRequested: s.correctionsRequested.map((c) =>
            c.id === correctionId ? { ...c, status: 'resolved' as const } : c
          ),
          status: s.correctionsRequested.filter((c) => c.id !== correctionId && c.status === 'pending').length === 0
            ? 'Under Verification'
            : s.status,
        };
      })
    );
  };

  const adminReviewApplication = (
    studentId: string,
    status: ApplicationStatus,
    adminNotes?: string,
    corrections?: Array<{ docType: DocumentType; messageEn: string; messageTa: string }>
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;

        const newCorrections = corrections
          ? corrections.map((c) => ({
              id: `corr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              docType: c.docType,
              messageEn: c.messageEn,
              messageTa: c.messageTa,
              status: 'pending' as const,
              requestedAt: new Date().toISOString().split('T')[0],
            }))
          : [];

        return {
          ...s,
          status,
          adminReviewNotes: adminNotes ?? s.adminReviewNotes,
          lastReviewedAt: new Date().toISOString().split('T')[0],
          correctionsRequested: [...newCorrections, ...s.correctionsRequested],
        };
      })
    );
  };

  const updateCourseRules = (newRules: CourseEligibilityRule[]) => {
    setCourseRules(newRules);
  };

  const updateDocumentRequirements = (newReqs: DocumentRequirement[]) => {
    setDocumentRequirements(newReqs);
  };

  // Helper for one-click testing with realistic sample documents
  const loadSampleDocumentForTesting = async (studentId: string, docType: DocumentType, scenario = 'clear') => {
    // Generate realistic sample data
    let sampleDataUrl: string;
    let fileName = '';

    const currentStd = students.find((s) => s.id === studentId);
    const studentName = currentStd ? currentStd.name.toUpperCase() : 'STUDENT CANDIDATE';
    const regNo = currentStd ? currentStd.registerNumber : '7112024';

    if (docType === 'marksheet_12') {
      const phy = scenario === 'mismatch' ? 76 : 91;
      const { createSampleMarksheet12 } = await import('../utils/sampleImages');
      sampleDataUrl = createSampleMarksheet12({ studentName, regNo, physicsMark: phy });
      fileName = `Sample_12th_Board_Marksheet_${scenario}.png`;
    } else if (docType === 'photo') {
      const q = scenario === 'blurry' ? 'blurry' : scenario === 'dark' ? 'dark' : 'sharp';
      const { createSamplePhoto } = await import('../utils/sampleImages');
      sampleDataUrl = createSamplePhoto(q);
      fileName = `Sample_Passport_Photo_${scenario}.png`;
    } else if (docType === 'transfer_certificate') {
      const { createSampleTransferCertificate } = await import('../utils/sampleImages');
      sampleDataUrl = createSampleTransferCertificate(studentName);
      fileName = 'Sample_Transfer_Certificate.png';
    } else {
      const { createSampleTransferCertificate } = await import('../utils/sampleImages');
      sampleDataUrl = createSampleTransferCertificate(studentName);
      fileName = `${docType}_sample.png`;
    }

    // Convert data url to Blob
    const res = await fetch(sampleDataUrl);
    const blob = await res.blob();
    await uploadDocument(blob, docType, studentId, fileName);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        students,
        documents,
        courseRules,
        documentRequirements,
        activeStudent,
        isOcrProcessing,
        ocrProgress,
        loginStudent,
        registerStudent,
        loginAdmin,
        logout,
        switchDemoUser,
        resetAllData,
        uploadDocument,
        removeDocument,
        updateStudentMarks,
        loadSampleDocumentForTesting,
        resolveCorrection,
        adminReviewApplication,
        updateCourseRules,
        updateDocumentRequirements,
        setActiveStudentForInspection: setActiveStudentForAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
