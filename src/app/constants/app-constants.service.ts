export const CONSTANT = {
  SECRET_KEY: {
    UNIFIED_REPORT: 'unifiedReports',
  },
  MIMETypes: {
    TXT: 'text/plain',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingm1.document',
    DOC: 'application/ msword',
    PDF: 'application/pdf',
    JPG: 'image/jpeg',
    BMP: 'image/bmp',
    PNG: 'image/png',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetm1.sheet',
    RTF: 'application/rtf',
    PPT: 'application/vnd.ms-powerpoint',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationm1.presentation',
  },
  DRUPAL_ADMIN_USERNAME: 'admin',
  DRUPAL_ADMIN_PASSWORD: 'admin@123',
  ENDPOINTS: {
    HOME: '/login',
    MAINTENANCE: '/unavailable',
    REGISTER: {
      CORPORATE: '/register/corporate',
      INSTITUTE: '/register/institute',
      CANDIDATE: '/register/candidate',
    },
    VERIFY: {
      OTP: '/verify/otp',
      EMAIL: '/verify/email',
      EMAIL_ERROR: '/verify/email/error',
      OTP_PASSWORD: '/verify/otp-password'
    },
    PASSWORD: {
      FORGOT: '/forgot-password',
      RESET: '/resetpwd',
      SETUP: '/setpwd'
    },
    LOGIN: '/login',
    LOGOUT: '/logout',
    UNAUTHENTICATED: {
      HOME: '/Unauthenticated',
      VIDEO_ASSESS: '/Unauthenticated/video-assessment-evaluation'
    },
    CUSTOMERS: {
      HOME: '/customer',
      LANDING: '/customer/landing',
      CANDIDATE_DASHBOARD: '/customer/candidate'
    },
    ADMIN_DASHBOARD: {
      HOME: '/admin',
      DASHBOARD: '/admin/dashboard',
      USER_MANAGEMENT: '/admin/user-management',
      USER_MANAGEMENT_USERS_LIST: '/admin/user-management/user-list',
      USER_MANAGEMENT_BULK_UPLOAD: '/admin/user-management/bulk-uploads',
      APPROVALS: '/admin/approvals',
      APPROVALS_INSTITUTE: '/admin/approvals/institute',
      ADMIN_REPORTS: '/admin/reports',
    },
    CANDIDATE_DASHBOARD: {
      HOME: '/candidate',
      // Lnt Profile Routes Start
      CANDIDATE_LARSEN: '/candidate/l&t',
      JOINING: '/candidate/l&t/joining',
      JOINING_PERSONAL: '/candidate/l&t/joining/personal',
      JOINING_CONTACT: '/candidate/l&t/joining/contact',
      JOINING_DEPENDENT: '/candidate/l&t/joining/dependent',
      JOINING_EDUCATION: '/candidate/l&t/joining/education',
      JOINING_WORK: '/candidate/l&t/joining/work',
      JOINING_UPLOAD: '/candidate/l&t/joining/upload',
      JOINING_PREVIEW: '/candidate/l&t/joining/preview',
      JOINING_SUBMIT: '/candidate/l&t/joining/submit',
      JOINING_FAQ: '/candidate/l&t/faq',
      DOCUMENT: '/candidate/l&t/document',
      DOCUMENT_LIST: '/candidate/l&t/document/list',
      // Lnt Profile Routes End

      // General Profile Routes Start
      GENERAL_CANDIDATE: '/candidate/general',
      GENERAL_JOINING: '/candidate/general/joining',
      GENERAL_JOINING_PERSONAL: '/candidate/general/joining/personal',
      GENERAL_JOINING_CONTACT: '/candidate/general/joining/contact',
      GENERAL_JOINING_DEPENDENT: '/candidate/general/joining/dependent',
      GENERAL_JOINING_EDUCATION: '/candidate/general/joining/education',
      GENERAL_JOINING_WORK: '/candidate/general/joining/work',
      GENERAL_JOINING_UPLOAD: '/candidate/general/joining/upload',
      GENERAL_JOINING_PREVIEW: '/candidate/general/joining/preview',
      GENERAL_JOINING_SUBMIT: '/candidate/general/joining/submit',
      GENERAL_JOINING_FAQ: '/candidate/general/faq',
      GENERAL_DOCUMENT: '/candidate/general/document',
      GENERAL_DOCUMENT_LIST: '/candidate/general/document/list',
      // General Profile Routes End

      // ADANI Profile Routes Start
      CANDIDATE_ADANI: '/candidate/adani',
      ADANI_JOINING: '/candidate/adani/joining',
      ADANI_JOINING_PERSONAL: '/candidate/adani/joining/personal',
      ADANI_JOINING_CONTACT: '/candidate/adani/joining/contact',
      ADANI_JOINING_DEPENDENT: '/candidate/adani/joining/dependent',
      ADANI_JOINING_EDUCATION: '/candidate/adani/joining/education',
      ADANI_JOINING_WORK: '/candidate/adani/joining/work',
      ADANI_JOINING_UPLOAD: '/candidate/adani/joining/upload',
      ADANI_JOINING_PREVIEW: '/candidate/adani/joining/preview',
      ADANI_JOINING_SUBMIT: '/candidate/adani/joining/submit',
      ADANI_JOINING_FAQ: '/candidate/adani/faq',
      ADANI_DOCUMENT: '/candidate/adani/document',
      ADANI_DOCUMENT_LIST: '/candidate/adani/document/list',
      // ADANI Profile Routes End

    },
    HR_DASHBOARD: {
      HOME: '/hr',
      DASHBOARD: '/hr/dashboard',
      SHORTLISTING: '/hr/shortlist',
      FIRSTSHORTLISTING: '/hr/shortlist/1st',
      FIRSTSHORTLISTING_LIST: '/hr/shortlist/1st/list',
      FIRSTSHORTLISTING_CRITERIA: '/hr/shortlist/1st/criteria',
      SECONDSHORTLISTING: '/hr/shortlist/2nd',
      SECONDSHORTLISTING_ASSESSMENT_LIST: '/hr/shortlist/2nd/assessment-list',
      SECONDSHORTLISTING_ASSESSMENTCANDIDATE_LIST: '/hr/shortlist/2nd/candidateslist',
      SECONDSHORTLISTING_VIDEO_ASSESSMENT_EVALUATION_HOME: '/hr/shortlist/2nd/video-assessment',
      SECONDSHORTLISTING_VIDEO_ASSESSMENT_EVALUATION_SCREEN: '/hr/shortlist/2nd/video-assessment/evaluator-assign',
      SECONDSHORTLISTED_CANDIDATE_REPORT: '/hr/shortlist/2nd/shortlisted-report',
      VIDEO_ASSESSMENT_SCHEDULE: '/hr/shortlist/2nd/video-schedule',
      USER_MANAGEMENT: '/hr/user-management',
      HR_USER_MANAGEMENT_USERS_LIST: '/hr/user-management/user-list',
      HR_USER_MANAGEMENT_BULK_UPLOAD: '/hr/user-management/bulk-uploads',
      EVALUATION: '/hr/evaluation',
      NEW_INTERVIEW_PANEL_ASSIGNMENT: '/hr/evaluation/interview-panelist-assign',
      NEW_INTERVIEW_PANEL_ASSIGNED: '/hr/evaluation/assigned',
      ASSIGNED_DETAILS: '/hr/evaluation/assigned/details',
      HR_PANEL_EVALUATION: '/hr/evaluation/assigned/candidate-details',
      NEW_INTERVIEW_PANEL_RESULTS_UPLOAD: '/hr/evaluation/upload',
      SUB_ASSESSMENTS: '/hr/evaluation/hr-evaluation/assessment',
      SUB_EDUCATION: '/hr/evaluation/hr-evaluation/education',
      SUB_EMPLOYMENT: '/hr/evaluation/hr-evaluation/employment',
      REPORTS: '/hr/reports',
      REPORTS_LIST: '/hr/reports/second',
      REPORTS_LIST_VIEW: '/hr/reports/list/view',
      FIRST_LEVEL_REPORTS_LIST: '/hr/reports/first',
      HR_STATUS: '/hr/status',
      HR_STATUS_PREASSESSMENT: '/hr/status/pre-assessment',
      HR_STATUS_RECRUITMENT: '/hr/status/recruitment',
      BUSINESSROUTE: '/hr/ic',
      IC_ADDorLIST: '/hr/ic/list',
      OfferedCandidatesLIST: '/hr/ic/candidates'
    },
    TPO_DASHBOARD: {
      HOME: '/tpo',
      DASHBOARD: '/tpo/dashboard',
      USER_MANAGEMENT: '/tpo/user-management',
      USER_MANAGEMENT_USERS_LIST: '/tpo/user-management/user-list',
      USER_MANAGEMENT_BULK_UPLOAD: '/tpo/user-management/bulk-uploads',
      STATUS: '/tpo/status',
      STATUS_PREASSESSMENT: '/tpo/status/pre-assessment',
      STATUS_RECRUITMENT: '/tpo/status/recruitment',
    },
    INTERVIEW_PANEL_DASHBOARD: {
      HOME: '/interview-panel',
      CANDIDATE_DETAILS: '/interview-panel/candidates',
      CANDIDATE_DETAILS_ASSESSMENT_LIST: '/interview-panel/candidates/assessment-list',
      CANDIDATE_DETAILS_PARTICULAR_ASSESSMENT_LIST: '/interview-panel/candidates/assessments',
      CANDIDATE_DETAILS_SUBMITTED: '/interview-panel/candidates/submitted',
      INTERVIEW_PANEL_EVALUATION: '/interview-panel/candidates/evaluation',
      VIDEO_ASSESS_TAB_HOME: '/interview-panel/video-assess',
      VIDEO_ASSESS_ASSIGNED_DETAILS: '/interview-panel/video-assess/candidates',
      VIDEO_ASSESS_EVALUATION_DETAILS: '/interview-panel/video-assess/evaluation'
    }

  },

  ROUTES: {
    HOME: 'home',
    MAINTENANCE: 'unavailable',

    VERIFY: {
      OTP: 'verify/otp',
      EMAIL: 'verify/email',
      EMAIL_ERROR: 'verify/email/error',
      OTP_PASSWORD: 'verify/otp-password'
    },
    PASSWORD: {
      FORGOT: 'forgot-password',
      RESET: 'password/reset',
      SETUP: 'password/setup'
    },
    LOGIN: 'login',
    LOGOUT: 'logout',
    UNAUTHENTICATED: {
      HOME: 'Unauthenticated',
      VIDEO_ASSESS: 'video-assessment-evaluation'
    },
    CUSTOMERS: {
      HOME: 'customer',
      LANDING: 'landing',
      CANDIDATE_DASHBOARD: 'candidate'
    },
    ADMIN_DASHBOARD: {
      HOME: 'admin',
      DASHBOARD: 'dashboard',
      USER_MANAGEMENT: 'user-management',
      USER_MANAGEMENT_USERS_LIST: 'user-list',
      USER_MANAGEMENT_BULK_UPLOAD: 'bulk-uploads',
      APPROVALS: 'approvals',
      APPROVALS_INSTITUTE: 'institute',
      ADMIN_REPORTS: 'reports',
    },
    CANDIDATE_DASHBOARD: {
      HOME: 'candidate',
      DASHBOARD: 'dashboard',

      // General Profile Routes Start
      GENERAL_CANDIDATE: 'general',
      GENERAL_JOINING: 'joining',
      GENERAL_JOINING_PERSONAL: 'personal',
      GENERAL_JOINING_CONTACT: 'contact',
      GENERAL_JOINING_DEPENDENT: 'dependent',
      GENERAL_JOINING_EDUCATION: 'education',
      GENERAL_JOINING_WORK: 'work',
      GENERAL_JOINING_UPLOAD: 'upload',
      GENERAL_JOINING_PREVIEW: 'preview',
      GENERAL_JOINING_SUBMIT: 'submit',
      GENERAL_JOINING_FAQ: 'faq',
      GENERAL_DOCUMENT: 'document',
      GENERAL_DOCUMENT_LIST: 'list',
      // General Profile Routes End


    },

  }
};
