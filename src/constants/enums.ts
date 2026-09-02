export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PASSED: 'bg-emerald-100 text-emerald-700',
  GENERATED: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  
  PENDING: 'bg-amber-100 text-amber-700',
  ENROLLED: 'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-amber-100 text-amber-700',
  REGENERATING: 'bg-amber-100 text-amber-700',
  
  SUSPENDED: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
  REVOKED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-slate-100 text-slate-600',
  
  DRAFT: 'bg-gray-100 text-gray-600',
  PUBLISHED: 'bg-teal-100 text-teal-700',
  AVAILABLE: 'bg-teal-100 text-teal-700',
  ARCHIVED: 'bg-slate-100 text-slate-600',
  
  REGISTRATION_OPEN: 'bg-blue-100 text-blue-700',
  REGISTRATION_CLOSED: 'bg-gray-100 text-gray-600',
  UPCOMING: 'bg-blue-100 text-blue-700',
  ONGOING: 'bg-blue-100 text-blue-700',
  RESULT_PUBLISHED: 'bg-teal-100 text-teal-700',
};

export const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
  SUSPENDED: 'Suspended',
  COMPLETED: 'Completed',
  VERIFIED: 'Verified',
  
  DRAFT: 'Draft',
  REGISTRATION_OPEN: 'Registration Open',
  REGISTRATION_CLOSED: 'Registration Closed',
  UPCOMING: 'Upcoming',
  ONGOING: 'Ongoing',
  RESULT_PUBLISHED: 'Result Published',
  CANCELLED: 'Cancelled',
  
  ENROLLED: 'Enrolled',
  DISQUALIFIED: 'Disqualified',
  
  GENERATED: 'Generated',
  REVOKED: 'Revoked',
  REGENERATING: 'Regenerating',
  
  PASSED: 'Passed',
  FAILED: 'Failed',
  
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};
