/**
 * Generates realistic SVG data URLs for sample admission documents and photos.
 * Allows instant testing of OCR, photo quality checking, and marks comparison without external file uploads.
 */

export function createSampleMarksheet12(options?: {
  studentName?: string;
  regNo?: string;
  physicsMark?: number;
}): string {
  const name = options?.studentName || 'KAVITHA RAMAN';
  const regNo = options?.regNo || '7112024';
  const phy = options?.physicsMark !== undefined ? options.physicsMark : 91;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200" style="background:#fff; font-family:sans-serif;">
    <rect width="100%" height="100%" fill="#ffffff" />
    <rect x="25" y="25" width="850" height="1150" fill="none" stroke="#1e3a8a" stroke-width="4" />
    <rect x="35" y="35" width="830" height="1130" fill="none" stroke="#93c5fd" stroke-width="1.5" />

    <!-- Header -->
    <text x="450" y="80" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e3a8a">DEPARTMENT OF GOVERNMENT EXAMINATIONS, TAMIL NADU</text>
    <text x="450" y="110" text-anchor="middle" font-size="16" font-weight="bold" fill="#334155">HIGHER SECONDARY EXAMINATION CERTIFICATE (+2)</text>
    <text x="450" y="135" text-anchor="middle" font-size="13" fill="#64748b">STATEMENT OF MARKS - MARCH 2024</text>
    <line x1="60" y1="155" x2="840" y2="155" stroke="#cbd5e1" stroke-width="2" />

    <!-- Candidate Info -->
    <text x="70" y="200" font-size="15" font-weight="bold" fill="#1e293b">NAME OF CANDIDATE :</text>
    <text x="260" y="200" font-size="16" font-weight="bold" fill="#0f172a">${name}</text>

    <text x="70" y="240" font-size="15" font-weight="bold" fill="#1e293b">REGISTER NO :</text>
    <text x="260" y="240" font-size="16" font-weight="bold" fill="#0f172a">${regNo}</text>

    <text x="520" y="200" font-size="15" font-weight="bold" fill="#1e293b">SCHOOL / CENTER :</text>
    <text x="680" y="200" font-size="14" fill="#334155">GOVT HSS, SALEM</text>

    <text x="520" y="240" font-size="15" font-weight="bold" fill="#1e293b">TMR CODE :</text>
    <text x="680" y="240" font-size="14" fill="#334155">HSE-2024-TN89</text>

    <!-- Table Header -->
    <rect x="60" y="290" width="780" height="45" fill="#f1f5f9" stroke="#94a3b8" />
    <text x="80" y="320" font-size="14" font-weight="bold" fill="#1e293b">SUBJECT NAME</text>
    <text x="420" y="320" font-size="14" font-weight="bold" fill="#1e293b">MAX MARKS</text>
    <text x="580" y="320" font-size="14" font-weight="bold" fill="#1e293b">MARKS OBTAINED</text>
    <text x="740" y="320" font-size="14" font-weight="bold" fill="#1e293b">RESULT</text>

    <!-- Rows -->
    <!-- Row 1: Tamil -->
    <rect x="60" y="335" width="780" height="45" fill="#ffffff" stroke="#e2e8f0" />
    <text x="80" y="363" font-size="14" font-weight="600" fill="#334155">TAMIL</text>
    <text x="450" y="363" font-size="14" fill="#475569">100</text>
    <text x="630" y="363" font-size="15" font-weight="bold" fill="#0f172a">092</text>
    <text x="750" y="363" font-size="14" font-weight="bold" fill="#15803d">PASS</text>

    <!-- Row 2: English -->
    <rect x="60" y="380" width="780" height="45" fill="#f8fafc" stroke="#e2e8f0" />
    <text x="80" y="408" font-size="14" font-weight="600" fill="#334155">ENGLISH</text>
    <text x="450" y="408" font-size="14" fill="#475569">100</text>
    <text x="630" y="408" font-size="15" font-weight="bold" fill="#0f172a">088</text>
    <text x="750" y="408" font-size="14" font-weight="bold" fill="#15803d">PASS</text>

    <!-- Row 3: Mathematics -->
    <rect x="60" y="425" width="780" height="45" fill="#ffffff" stroke="#e2e8f0" />
    <text x="80" y="453" font-size="14" font-weight="600" fill="#334155">MATHEMATICS</text>
    <text x="450" y="453" font-size="14" fill="#475569">100</text>
    <text x="630" y="453" font-size="15" font-weight="bold" fill="#0f172a">095</text>
    <text x="750" y="453" font-size="14" font-weight="bold" fill="#15803d">PASS</text>

    <!-- Row 4: Physics -->
    <rect x="60" y="470" width="780" height="45" fill="#f8fafc" stroke="#e2e8f0" />
    <text x="80" y="498" font-size="14" font-weight="600" fill="#334155">PHYSICS</text>
    <text x="450" y="498" font-size="14" fill="#475569">100</text>
    <text x="630" y="498" font-size="15" font-weight="bold" fill="#0f172a">0${phy}</text>
    <text x="750" y="498" font-size="14" font-weight="bold" fill="#15803d">PASS</text>

    <!-- Row 5: Chemistry -->
    <rect x="60" y="515" width="780" height="45" fill="#ffffff" stroke="#e2e8f0" />
    <text x="80" y="543" font-size="14" font-weight="600" fill="#334155">CHEMISTRY</text>
    <text x="450" y="543" font-size="14" fill="#475569">100</text>
    <text x="630" y="543" font-size="15" font-weight="bold" fill="#0f172a">089</text>
    <text x="750" y="543" font-size="14" font-weight="bold" fill="#15803d">PASS</text>

    <!-- Row 6: Computer Science -->
    <rect x="60" y="560" width="780" height="45" fill="#f8fafc" stroke="#e2e8f0" />
    <text x="80" y="588" font-size="14" font-weight="600" fill="#334155">COMPUTER SCIENCE</text>
    <text x="450" y="588" font-size="14" fill="#475569">100</text>
    <text x="630" y="588" font-size="15" font-weight="bold" fill="#0f172a">096</text>
    <text x="750" y="588" font-size="14" font-weight="bold" fill="#15803d">PASS</text>

    <!-- Total row -->
    <rect x="60" y="615" width="780" height="50" fill="#eff6ff" stroke="#93c5fd" stroke-width="2" />
    <text x="80" y="647" font-size="16" font-weight="bold" fill="#1e3a8a">TOTAL MARKS :</text>
    <text x="240" y="647" font-size="18" font-weight="bold" fill="#1e3a8a">${460 + phy} / 600</text>
    <text x="500" y="647" font-size="15" font-weight="bold" fill="#1e3a8a">PERCENTAGE : ${(((460 + phy) / 600) * 100).toFixed(2)}%</text>

    <!-- Seal and Signature -->
    <circle cx="200" cy="850" r="60" fill="none" stroke="#1d4ed8" stroke-width="3" stroke-dasharray="6,4" />
    <text x="200" y="845" text-anchor="middle" font-size="11" font-weight="bold" fill="#1d4ed8">GOVT EXAMINATIONS</text>
    <text x="200" y="865" text-anchor="middle" font-size="10" fill="#1d4ed8">OFFICIAL SEAL</text>

    <line x1="620" y1="880" x2="780" y2="880" stroke="#0f172a" stroke-width="1.5" />
    <text x="700" y="905" text-anchor="middle" font-size="13" font-weight="bold" fill="#0f172a">SECRETARY</text>
    <text x="700" y="925" text-anchor="middle" font-size="11" fill="#64748b">Board of Higher Secondary Exam</text>
    
    <text x="450" y="1120" text-anchor="middle" font-size="11" fill="#94a3b8">This is an authentic computer generated document issued for verification purposes.</text>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function createSamplePhoto(quality: 'sharp' | 'blurry' | 'dark'): string {
  // We can render via SVG data URL or canvas
  const bg = quality === 'dark' ? '#1e293b' : '#3b82f6';
  const blurFilter = quality === 'blurry' ? 'filter="blur(5px)"' : '';
  const opacity = quality === 'dark' ? '0.45' : '1';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="350" height="450" viewBox="0 0 350 450">
    <rect width="100%" height="100%" fill="${bg}" opacity="${opacity}" />
    <g ${blurFilter}>
      <!-- Person avatar silhouette -->
      <circle cx="175" cy="160" r="75" fill="#fbd38d" />
      <!-- Hair -->
      <path d="M 100 150 C 100 80, 250 80, 250 150 C 230 110, 120 110, 100 150 Z" fill="#2d3748" />
      <!-- Eyes -->
      <circle cx="150" cy="155" r="7" fill="#1a202c" />
      <circle cx="200" cy="155" r="7" fill="#1a202c" />
      <!-- Smile -->
      <path d="M 155 195 Q 175 215 195 195" stroke="#975a16" stroke-width="3" fill="none" />
      <!-- Body / Collar Shirt -->
      <path d="M 80 450 L 95 300 C 105 270, 245 270, 255 300 L 270 450 Z" fill="#ffffff" />
      <polygon points="175,270 145,340 205,340" fill="#2563eb" />
      <!-- Label -->
      <rect x="50" y="415" width="250" height="25" fill="rgba(0,0,0,0.6)" rx="4" />
      <text x="175" y="432" font-family="sans-serif" font-size="12" fill="#ffffff" text-anchor="middle" font-weight="bold">PASSPORT SPEC 3.5 x 4.5 CM</text>
    </g>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function createSampleTransferCertificate(studentName = 'KAVITHA RAMAN'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="850" height="1100" viewBox="0 0 850 1100" style="background:#fff; font-family:sans-serif;">
    <rect width="100%" height="100%" fill="#ffffff" />
    <rect x="30" y="30" width="790" height="1040" fill="none" stroke="#334155" stroke-width="2" />
    
    <text x="425" y="90" text-anchor="middle" font-size="20" font-weight="bold" fill="#0f172a">GOVERNMENT MODEL HIGHER SECONDARY SCHOOL</text>
    <text x="425" y="120" text-anchor="middle" font-size="15" fill="#475569">SALEM DISTRICT, TAMIL NADU - 636001</text>
    <text x="425" y="160" text-anchor="middle" font-size="18" font-weight="bold" fill="#1e3a8a">TRANSFER CERTIFICATE (T.C.)</text>
    <line x1="70" y1="180" x2="780" y2="180" stroke="#94a3b8" stroke-width="1.5" />

    <text x="80" y="230" font-size="14" fill="#334155">T.C. Serial Number : <strong>TC/2024/0981</strong></text>
    <text x="500" y="230" font-size="14" fill="#334155">Admission No : <strong>ADM/8821</strong></text>

    <text x="80" y="280" font-size="14" fill="#334155">1. Name of the Pupil :</text>
    <text x="320" y="280" font-size="15" font-weight="bold" fill="#0f172a">${studentName}</text>

    <text x="80" y="330" font-size="14" fill="#334155">2. Name of Father / Guardian :</text>
    <text x="320" y="330" font-size="14" fill="#0f172a">RAMANATHAN K</text>

    <text x="80" y="380" font-size="14" fill="#334155">3. Nationality and Religion :</text>
    <text x="320" y="380" font-size="14" fill="#0f172a">Indian - Hindu</text>

    <text x="80" y="430" font-size="14" fill="#334155">4. Date of Birth :</text>
    <text x="320" y="430" font-size="14" fill="#0f172a">14-05-2006 (Fourteen May Two Thousand Six)</text>

    <text x="80" y="480" font-size="14" fill="#334155">5. Class from which leaving :</text>
    <text x="320" y="480" font-size="14" font-weight="bold" fill="#0f172a">XII Std (Completed March 2024)</text>

    <text x="80" y="530" font-size="14" fill="#334155">6. Medium of Instruction :</text>
    <text x="320" y="530" font-size="14" fill="#0f172a">English Medium</text>

    <text x="80" y="580" font-size="14" fill="#334155">7. Conduct and Character :</text>
    <text x="320" y="580" font-size="14" font-weight="bold" fill="#15803d">GOOD</text>

    <text x="80" y="630" font-size="14" fill="#334155">8. Date of application for TC :</text>
    <text x="320" y="630" font-size="14" fill="#0f172a">25-05-2024</text>

    <!-- Signatures -->
    <circle cx="200" cy="850" r="50" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="4,4" />
    <text x="200" y="855" text-anchor="middle" font-size="12" fill="#2563eb" font-weight="bold">SCHOOL SEAL</text>

    <line x1="580" y1="880" x2="740" y2="880" stroke="#000" stroke-width="1.5" />
    <text x="660" y="905" text-anchor="middle" font-size="14" font-weight="bold" fill="#0f172a">HEADMASTER / PRINCIPAL</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
