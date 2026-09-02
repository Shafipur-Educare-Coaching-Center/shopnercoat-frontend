'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, User, Phone, Image as ImageIcon, Save, School } from 'lucide-react';
import { toast } from 'sonner';
import {
  studentAdminFormSchema,
  StudentAdminFormValues,
} from '@/features/admin/students/schemas/student-admin.schema';
import { createStudentAction } from '@/features/admin/students/actions/createStudentAction';
import { updateStudentAction } from '@/features/admin/students/actions/updateStudentAction';
import { Student } from '@/types/student.types';

interface StudentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null; // If provided, edit mode
  onSuccess?: () => void;
}

export function StudentFormDialog({
  isOpen,
  onClose,
  student,
  onSuccess,
}: StudentFormDialogProps) {
  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'GUARDIAN' | 'MEDIA'>('PERSONAL');
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(student);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentAdminFormValues>({
    resolver: zodResolver(studentAdminFormSchema) as Resolver<StudentAdminFormValues>,
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
      dateOfBirth: '2006-01-01',
      collegeName: '',
      fatherName: '',
      motherName: '',
      parentMobileNumber: '',
      guardianMobileNumber: '',
      presentAddress: '',
      permanentAddress: '',
      photoUrl: '',
      signatureUrl: '',
      registrationStatus: 'COMPLETED',
      userStatus: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName || '',
        mobileNumber: student.user?.mobileNumber || '',
        email: student.user?.email || '',
        password: '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '2006-01-01',
        collegeName: student.collegeName || '',
        fatherName: student.fatherName || '',
        motherName: student.motherName || '',
        parentMobileNumber: student.parentMobileNumber || '',
        guardianMobileNumber: student.guardianMobileNumber || '',
        presentAddress: student.presentAddress || '',
        permanentAddress: student.permanentAddress || '',
        photoUrl: student.photoUrl || '',
        signatureUrl: student.signatureUrl || '',
        registrationStatus: student.registrationStatus || 'COMPLETED',
        userStatus: student.user?.status || 'ACTIVE',
      });
    } else {
      reset({
        fullName: '',
        mobileNumber: '',
        email: '',
        password: '',
        dateOfBirth: '2006-01-01',
        collegeName: '',
        fatherName: '',
        motherName: '',
        parentMobileNumber: '',
        guardianMobileNumber: '',
        presentAddress: '',
        permanentAddress: '',
        photoUrl: '',
        signatureUrl: '',
        registrationStatus: 'COMPLETED',
        userStatus: 'ACTIVE',
      });
    }
  }, [student, reset]);

  if (!isOpen) return null;

  const onSubmit = (values: StudentAdminFormValues) => {
    startTransition(async () => {
      if (isEditMode && student) {
        const res = await updateStudentAction(student.id, values);
        if (res.success) {
          toast.success('Candidate Updated', { description: res.message });
          onSuccess?.();
          onClose();
        } else {
          toast.error('Update Failed', { description: res.error });
        }
      } else {
        const res = await createStudentAction(values);
        if (res.success) {
          toast.success('Candidate Registered', { description: res.message });
          onSuccess?.();
          onClose();
        } else {
          toast.error('Registration Failed', { description: res.error });
        }
      }
    });
  };

  const commonHSCColleges = [
    'Notre Dame College (NDC)',
    'Dhaka College',
    'Rajuk Uttara Model College (RUMC)',
    'Viqarunnisa Noon College (VNC)',
    'Holy Cross College (HCC)',
    'Adamjee Cantonment College (ACC)',
    'Govt. Science College',
    'Shafipur Educare Medical Academy',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] border border-slate-100 flex flex-col select-none">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-heading font-black text-lg text-slate-900">
              {isEditMode ? 'Edit Candidate Profile' : 'Register New Medical Candidate'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode
                ? `Updating credentials & academic info for Roll #${student?.rollNumber}`
                : 'Enroll examinee, record HSC institution, and issue 7-digit credentials.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-slate-50/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('PERSONAL')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'PERSONAL'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="size-3.5" />
            <span>1. Personal & HSC College</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GUARDIAN')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'GUARDIAN'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Phone className="size-3.5" />
            <span>2. Guardians & Address</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MEDIA')}
            className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'MEDIA'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ImageIcon className="size-3.5" />
            <span>3. Photos & Status</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          
          {/* TAB 1: Personal & Academic */}
          {activeTab === 'PERSONAL' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahim Uddin"
                    {...register('fullName')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.fullName && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.dateOfBirth.message}</p>
                  )}
                </div>
              </div>

              {/* HSC College Name with Quick Chips */}
              <div>
                <label className="font-semibold text-slate-700 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1">
                    <School className="size-3.5 text-teal-600" />
                    <span>HSC College Name *</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Higher Secondary Institution</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Notre Dame College (NDC)"
                  list="hsc-college-suggestions"
                  {...register('collegeName')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                <datalist id="hsc-college-suggestions">
                  {commonHSCColleges.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.collegeName && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.collegeName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Candidate Mobile */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Candidate Mobile Number *
                  </label>
                  <input
                    type="text"
                    placeholder="01712345678"
                    {...register('mobileNumber')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.mobileNumber && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.mobileNumber.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="candidate@example.com"
                    {...register('email')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {!isEditMode && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Initial Password (Min 8 chars)
                  </label>
                  <input
                    type="password"
                    placeholder="SecureP@ss123"
                    {...register('password')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.password && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.password.message}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Guardians & Address */}
          {activeTab === 'GUARDIAN' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Father's Name */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Father&apos;s Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Md. Mostafa Uddin"
                    {...register('fatherName')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.fatherName && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.fatherName.message}</p>
                  )}
                </div>

                {/* Mother's Name */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Mother&apos;s Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Rasheda Begum"
                    {...register('motherName')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.motherName && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.motherName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Parent Mobile */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Parent Mobile Number *
                  </label>
                  <input
                    type="text"
                    placeholder="01812345678"
                    {...register('parentMobileNumber')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.parentMobileNumber && (
                    <p className="text-rose-500 text-[11px] mt-1">{errors.parentMobileNumber.message}</p>
                  )}
                </div>

                {/* Guardian Mobile */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Emergency Guardian Mobile (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="01911223344"
                    {...register('guardianMobileNumber')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Present Address */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Present Residential Address *
                </label>
                <textarea
                  rows={2}
                  placeholder="House, Road, Area, Thana, District"
                  {...register('presentAddress')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                {errors.presentAddress && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.presentAddress.message}</p>
                )}
              </div>

              {/* Permanent Address */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Permanent Village / City Address *
                </label>
                <textarea
                  rows={2}
                  placeholder="Village, Post Office, Upazila, District"
                  {...register('permanentAddress')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
                {errors.permanentAddress && (
                  <p className="text-rose-500 text-[11px] mt-1">{errors.permanentAddress.message}</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Photos & Status */}
          {activeTab === 'MEDIA' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Candidate Passport Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/.../photo.webp"
                  {...register('photoUrl')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Candidate Signature Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/.../signature.webp"
                  {...register('signatureUrl')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Profile Registration Status
                  </label>
                  <select
                    {...register('registrationStatus')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="COMPLETED">COMPLETED (Verified)</option>
                    <option value="PENDING">PENDING (Review)</option>
                    <option value="REJECTED">REJECTED (Hold)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    User Account Status
                  </label>
                  <select
                    {...register('userStatus')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab === 'PERSONAL' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('GUARDIAN')}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Next: Guardians &rarr;
                </button>
              )}
              {activeTab === 'GUARDIAN' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('MEDIA')}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
                >
                  Next: Media & Status &rarr;
                </button>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5 text-white" />
                    <span>{isEditMode ? 'Save Changes' : 'Register Candidate'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
