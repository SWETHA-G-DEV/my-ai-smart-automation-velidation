export type ApplicationStatus = 
  | 'Submitted' 
  | 'Under Verification' 
  | 'Correction Required' 
  | 'Verified' 
  | 'Manual Review Required';

export type DocumentType = 
  | 'marksheet_10' 
  | 'marksheet_12' 
  | 'transfer_certificate' 
  | 'community_certificate' 
  | 'photo' 
  | 'other';

export interface SubjectMark {
  name: string;
  maxMarks: number;
  enteredMarks: number;
  extractedMarks?: number;
  isMatched?: boolean;
}

export interface OcrResult {
  rawText: string;
  confidence: number; // 0 - 100
  extractedName?: string;
  extractedRegisterNo?: string;
  subjects: Array<{ name: string; marks: number; maxMarks: number }>;
  totalMarks?: number;
  percentage?: number;
  warnings: string[];
  isProcessing?: boolean;
}

export interface PhotoQualityResult {
  score: number; // 0 - 100
  blurScore: number;
  brightness: number; // 0 - 100
  resolution: { width: number; height: number };
  aspectRatio: number;
  isBlurry: boolean;
  isLowBrightness: boolean;
  isOverExposed: boolean;
  isLowResolution: boolean;
  isExcessivelyCropped: boolean;
  suggestions: string[];
}

export interface UploadedDocument {
  id: string;
  studentId: string;
  docType: DocumentType;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileDataUrl: string; // base64 or object URL
  uploadDate: string;
  fileHash: string; // SHA-256 for duplicate check
  ocrResult?: OcrResult;
  photoQuality?: PhotoQualityResult;
  isDuplicate?: boolean;
  duplicateWarning?: string;
  verificationStatus: 'Pending' | 'Valid' | 'Mismatch' | 'Correction Required' | 'Needs Review';
  adminRemarks?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  password?: string;
  mobile: string;
  registerNumber: string; // 12th Board Registration No
  courseApplied: string;
  quota: 'General' | 'OBC' | 'BC' | 'MBC' | 'SC' | 'ST' | 'Sports / Special';
  applicationId: string;
  appliedDate: string;
  status: ApplicationStatus;
  avatarUrl?: string;
  
  // Academic marks entered by student
  boardName: string;
  passingYear: string;
  subjects: SubjectMark[];
  totalEnteredMarks: number;
  enteredPercentage: number;
  
  // Correction notes
  correctionsRequested: Array<{
    id: string;
    docType: DocumentType;
    messageEn: string;
    messageTa: string;
    status: 'pending' | 'resolved';
    requestedAt: string;
  }>;
  
  // Admin notes
  adminReviewNotes?: string;
  lastReviewedAt?: string;
}

export interface CourseEligibilityRule {
  courseCode: string;
  courseName: string;
  department: string;
  minPercentageGeneral: number;
  minPercentageReserved: number;
  requiredSubjects: string[];
  formula: 'Cutoff_200' | 'Aggregate_Percentage'; // Cutoff_200 = Maths + (Physics + Chemistry)/2 (standard TN engineering formula)
}

export interface EligibilityEvaluation {
  status: 'Eligible' | 'Not Eligible' | 'Needs Manual Review';
  score: number; // e.g. 184/200 cutoff or percentage
  ruleName: string;
  reasons: string[];
  isPassingSubjectRequirements: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admission_officer' | 'verifier';
  department: string;
}

export interface DocumentRequirement {
  type: DocumentType;
  title: string;
  description: string;
  isRequired: boolean;
  acceptedFormats: string[];
}
