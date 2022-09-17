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
    },
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
      GENERAL_DOCUMENT_LIST: 'list'
      // General Profile Routes End

    },

  }
};
