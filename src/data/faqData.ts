export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

export const FAQ_DATA: FaqCategory[] = [
  {
    id: 'general',
    label: 'General Questions',
    items: [
      {
        id: 'gen-1',
        question: 'What documents are required for initial registration?',
        answer:
          'Candidates must provide a valid government-issued ID (Passport or National ID), transcripts from their pre-medical education, a recent passport-sized photograph, and proof of English proficiency (if applicable). Ensure all documents are scanned clearly in PDF format before uploading.',
      },
      {
        id: 'gen-2',
        question: 'How to pay the exam fee securely?',
        answer:
          'You can pay the exam fee through our encrypted payment gateway using mobile financial services (bKash, Nagad, Rocket), credit/debit cards (Visa, MasterCard), or internet banking. A digital payment receipt with transaction ID is generated instantly.',
      },
      {
        id: 'gen-3',
        question: 'Can I change my designated exam center after submission?',
        answer:
          'Center change requests are permitted only during the active correction window before admit cards are issued. You can submit a change request through your candidate portal under "Application Settings".',
      },
      {
        id: 'gen-4',
        question: 'What is the deadline for submitting recommendation letters?',
        answer:
          'Recommendation letters and quota endorsement documents must be uploaded at least 5 business days before the final application closing date to allow for manual board verification.',
      },
      {
        id: 'gen-5',
        question: 'How do I track my application status?',
        answer:
          'Log in to your candidate dashboard using your registered mobile number and OTP. Your dashboard provides a real-time status tracker indicating document verification, payment status, and admit card release.',
      },
    ],
  },
  {
    id: 'admission',
    label: 'Admission Process',
    items: [
      {
        id: 'adm-1',
        question: 'What is the step-by-step procedure for medical admission?',
        answer:
          'The process begins with online registration, mobile OTP verification, educational profile submission, fee payment, examination center selection, taking the standardized examination, and merit ranking publication.',
      },
      {
        id: 'adm-2',
        question: 'When will the examination admit cards be issued?',
        answer:
          'Admit cards are generated automatically after the registration window closes and candidate data is verified. You will receive an SMS and email notification to download your admit card from your dashboard.',
      },
      {
        id: 'adm-3',
        question: 'What is the minimum eligibility criteria to apply?',
        answer:
          'Candidates must have completed their higher secondary education with required GPA benchmarks in Biology, Chemistry, and Physics as mandated by the medical admission board guidelines.',
      },
      {
        id: 'adm-4',
        question: 'Are multiple attempts allowed for the entrance examination?',
        answer:
          'Yes, candidates may apply according to the current year board circular policy regarding fresh and second-time exam candidates.',
      },
      {
        id: 'adm-5',
        question: 'How is the final merit score calculated?',
        answer:
          'The merit score is computed by combining your entrance examination score with weighted standardized GPA scores from your secondary and higher secondary certificates.',
      },
    ],
  },
  {
    id: 'support',
    label: 'Technical Support',
    items: [
      {
        id: 'tech-1',
        question: 'What should I do if I do not receive the OTP on my mobile phone?',
        answer:
          'Ensure your mobile network reception is strong and wait up to 60 seconds. If the OTP is not received, click "Resend OTP". If issues persist, verify that your carrier does not block automated SMS or contact support.',
      },
      {
        id: 'tech-2',
        question: 'How do I reset my account or update my registered mobile number?',
        answer:
          'For security reasons, updating your primary mobile number requires identity verification. Submit a support ticket along with your National ID/Birth Certificate photocopy.',
      },
      {
        id: 'tech-3',
        question: 'What file formats and dimensions are supported for photograph and signature upload?',
        answer:
          'Photographs must be color passport size (300x300 pixels, JPG/PNG under 100KB). Signatures must be 300x80 pixels under 60KB. Supporting documents must be clear PDFs under 1MB.',
      },
      {
        id: 'tech-4',
        question: 'The website page is unresponsive or showing an error during submission. What should I do?',
        answer:
          'Clear your browser cache or open an incognito/private window. Ensure you have a stable internet connection. Incomplete drafts are automatically preserved in your profile.',
      },
      {
        id: 'tech-5',
        question: 'Who can I contact for urgent technical assistance?',
        answer:
          'Our dedicated helpdesk is active Saturday to Thursday (9:00 AM - 6:00 PM). You can reach out via live chat on the portal or email support@shopnercoat.edu.bd.',
      },
    ],
  },
  {
    id: 'fees',
    label: 'Fees & Payments',
    items: [
      {
        id: 'fee-1',
        question: 'What are the accepted payment methods for registration?',
        answer:
          'We support bKash, Nagad, Rocket, Upay, Visa, MasterCard, and direct internet banking through our secure SSL/TLS encrypted gateway.',
      },
      {
        id: 'fee-2',
        question: 'What should I do if money is deducted but the portal shows "Unpaid"?',
        answer:
          'Payment reconciliation usually resolves within 15 minutes. If your status does not update, navigate to the Fees section and click "Re-verify Payment" using your TrxID or contact our billing desk.',
      },
      {
        id: 'fee-3',
        question: 'Is the examination registration fee refundable?',
        answer:
          'Exam fees are non-refundable once the application is finalized and approved by the board, as per official examination circular terms.',
      },
      {
        id: 'fee-4',
        question: 'How do I get an official invoice or fee receipt?',
        answer:
          'Immediately after successful payment, a digitally signed invoice with QR code verification is available for download in your student dashboard.',
      },
      {
        id: 'fee-5',
        question: 'Are there any quota or concession fee waivers available?',
        answer:
          'Fee concessions for eligible freedom fighter quotas or disadvantaged categories are processed according to government policy with valid uploaded documentation.',
      },
    ],
  },
];
