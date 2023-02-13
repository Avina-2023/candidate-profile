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
    CANDIDATE_DASHBOARD: {
      HOME: 'candidate',
      DASHBOARD: 'dashboard',

      // General Profile Routes Start
      GENERAL_CANDIDATE: '/profile',
      GENERAL_JOINING: 'profile/candidate',
      GENERAL_JOINING_PERSONAL: 'profile/candidate/personal',
      GENERAL_JOINING_CONTACT: 'profile/candidate/contact',
      GENERAL_JOINING_DEPENDENT: 'profile/candidate/dependent',
      GENERAL_JOINING_EDUCATION: 'profile/candidate/education',
      GENERAL_JOINING_WORK: 'profile/candidate/work',
      GENERAL_JOINING_PROJECT: 'profile/candidate/project',
      GENERAL_JOINING_ACCOMPLISHMENTS :'profile/candidate/accomplishments',
      GENERAL_JOINING_UPLOAD: 'profile/candidate/upload',
      GENERAL_JOINING_DISCIPLINARY_DETAILS: 'profile/candidate/disciplinary',
      GENERAL_JOINING_PREVIEW: 'profile/candidate/preview',
      GENERAL_JOINING_SUBMIT: 'profile/candidate/submit',
      GENERAL_JOINING_FAQ: 'profile/candidate/faq',
      GENERAL_DOCUMENT: 'profile/candidate/document',
      GENERAL_DOCUMENT_LIST: 'profile/candidate/document/list',
      // General Profile Routes End
    },
    JOB:{
      JOBDESCRIPTION:'job/jobdescription'
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
      GENERAL_JOINING_PROJECT: 'project',
      GENERAL_JOINING_ACCOMPLISHMENTS :'accomplishments',
      GENERAL_JOINING_UPLOAD: 'upload',
      GENERAL_JOINING_PREVIEW: 'preview',
      GENERAL_JOINING_SUBMIT: 'submit',
      GENERAL_JOINING_FAQ: 'faq',
      GENERAL_DOCUMENT: 'document',
      GENERAL_DOCUMENT_LIST: 'list',
      GENERAL_JOINING_DISCIPLINARY_DETAILS: 'disciplinary',
      // General Profile Routes End

    },
    JOB:{
      JobDescription:'job/jobdescription'
    }

  }
};
