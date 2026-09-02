'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Building2,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  DoorOpen,
  RotateCw,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  examCentreFormSchema,
  ExamCentreFormValues,
  examRoomFormSchema,
  ExamRoomFormValues,
} from '@/features/admin/exams/schemas/exam-admin.schema';
import {
  getExamCentresAction,
  addExamCentreAction,
  deleteExamCentreAction,
  addExamRoomAction,
  deleteExamRoomAction,
  autoAssignSeatsAction,
} from '@/features/admin/exams/actions/examCentreActions';
import { Exam, ExamCentre } from '@/types/exam.types';

interface ExamCentresModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  onSuccess?: () => void;
}

export function ExamCentresModal({
  isOpen,
  onClose,
  exam,
  onSuccess,
}: ExamCentresModalProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoadingCentres, setIsLoadingCentres] = useState(false);
  const [centres, setCentres] = useState<ExamCentre[]>(exam?.centres || []);
  const [showAddCentre, setShowAddCentre] = useState(false);
  const [selectedCentreForRoom, setSelectedCentreForRoom] = useState<string | null>(null);

  const reloadCentres = (examId: string) => {
    setIsLoadingCentres(true);
    getExamCentresAction(examId)
      .then((res) => {
        if (res.success && res.centres) {
          setCentres(res.centres);
        }
      })
      .finally(() => {
        setIsLoadingCentres(false);
      });
  };

  useEffect(() => {
    let active = true;
    if (isOpen && exam?.id) {
      getExamCentresAction(exam.id)
        .then((res) => {
          if (active && res.success && res.centres) {
            setCentres(res.centres);
          }
        })
        .finally(() => {
          if (active) setIsLoadingCentres(false);
        });
    }
    return () => {
      active = false;
    };
  }, [isOpen, exam?.id]);

  // Centre Form
  const {
    register: registerCentre,
    handleSubmit: handleSubmitCentre,
    reset: resetCentre,
    formState: { errors: centreErrors },
  } = useForm<ExamCentreFormValues>({
    resolver: zodResolver(examCentreFormSchema) as Resolver<ExamCentreFormValues>,
    defaultValues: {
      name: 'Shafipur Educare Coaching Center',
      address: 'Shafipur Bazaar Main Road, Gazipur',
      venue: 'Main Academic Building',
      capacity: 240,
    },
  });

  // Room Form
  const {
    register: registerRoom,
    handleSubmit: handleSubmitRoom,
    reset: resetRoom,
  } = useForm<ExamRoomFormValues>({
    resolver: zodResolver(examRoomFormSchema) as Resolver<ExamRoomFormValues>,
    defaultValues: {
      roomNumber: 'Room 101',
      capacity: 60,
    },
  });

  if (!isOpen || !exam) return null;

  const onAddCentreSubmit = (values: ExamCentreFormValues) => {
    startTransition(async () => {
      const res = await addExamCentreAction(exam.id, values);
      if (res.success && res.centre) {
        toast.success('Centre Added', { description: res.message });
        setCentres((prev) => [...prev, res.centre]);
        resetCentre();
        setShowAddCentre(false);
        reloadCentres(exam.id);
        onSuccess?.();
      } else {
        toast.error('Failed to Add Centre', { description: res.error });
      }
    });
  };

  const onAddRoomSubmit = (values: ExamRoomFormValues) => {
    if (!selectedCentreForRoom) return;
    startTransition(async () => {
      const res = await addExamRoomAction(selectedCentreForRoom, values);
      if (res.success) {
        toast.success('Room Added', { description: res.message });
        resetRoom();
        setSelectedCentreForRoom(null);
        reloadCentres(exam.id);
        onSuccess?.();
      } else {
        toast.error('Failed to Add Room', { description: res.error });
      }
    });
  };

  const handleDeleteCentre = (centreId: string) => {
    startTransition(async () => {
      const res = await deleteExamCentreAction(centreId);
      if (res.success) {
        toast.success('Centre Removed', { description: res.message });
        setCentres((prev) => prev.filter((c) => c.id !== centreId));
        reloadCentres(exam.id);
        onSuccess?.();
      } else {
        toast.error('Deletion Failed', { description: res.error });
      }
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    startTransition(async () => {
      const res = await deleteExamRoomAction(roomId);
      if (res.success) {
        toast.success('Room Removed', { description: res.message });
        reloadCentres(exam.id);
        onSuccess?.();
      } else {
        toast.error('Deletion Failed', { description: res.error });
      }
    });
  };

  const handleAutoAssign = () => {
    startTransition(async () => {
      const res = await autoAssignSeatsAction(exam.id);
      if (res.success) {
        toast.success('Smart Seat Allocation Complete', {
          description: res.message,
        });
        onSuccess?.();
      } else {
        toast.error('Seat Allocation Failed', { description: res.error });
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] border border-slate-100 p-6 flex flex-col gap-5 select-none">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* 1. Header with Auto-Assign Seat Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-indigo-50 text-[#37447E] flex items-center justify-center">
                <Building2 className="size-4" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900">
                Exam Centres & Seat Plan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configuring examination halls for [<strong>{exam.code}</strong>] {exam.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => reloadCentres(exam.id)}
              disabled={isLoadingCentres}
              title="Refresh Centres"
              className="size-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-all cursor-pointer"
            >
              <RotateCw className={`size-3.5 ${isLoadingCentres ? 'animate-spin text-teal-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleAutoAssign}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer shrink-0"
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin text-white" />
              ) : (
                <Sparkles className="size-3.5 text-white" />
              )}
              <span>Auto Assign Seats</span>
            </button>
          </div>
        </div>

        {/* 2. Existing Centres List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Configured Centres ({centres.length})
            </span>
            <button
              type="button"
              onClick={() => setShowAddCentre(!showAddCentre)}
              className="inline-flex items-center gap-1 text-teal-600 font-bold hover:underline cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add New Centre</span>
            </button>
          </div>

          {showAddCentre && (
            <form
              onSubmit={handleSubmitCentre(onAddCentreSubmit)}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col gap-3 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Centre Name *</label>
                  <input
                    type="text"
                    placeholder="Shafipur Educare Coaching Center"
                    {...registerCentre('name')}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {centreErrors.name && (
                    <p className="text-rose-500 text-[10px] mt-0.5">{centreErrors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Venue / Building *</label>
                  <input
                    type="text"
                    placeholder="Academic Building 1"
                    {...registerCentre('venue')}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                  {centreErrors.venue && (
                    <p className="text-rose-500 text-[10px] mt-0.5">{centreErrors.venue.message}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Address *</label>
                  <input
                    type="text"
                    placeholder="Shafipur Bazaar Road, Gazipur"
                    {...registerCentre('address')}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Capacity *</label>
                  <input
                    type="number"
                    placeholder="240"
                    {...registerCentre('capacity')}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCentre(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold cursor-pointer"
                >
                  Save Centre
                </button>
              </div>
            </form>
          )}

          {isLoadingCentres && centres.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center gap-2">
              <Loader2 className="size-6 animate-spin text-teal-600" />
              <span className="text-xs text-slate-500">Loading configured exam venues...</span>
            </div>
          ) : centres && centres.length > 0 ? (
            <div className="space-y-3">
              {centres.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="font-bold text-slate-900 text-sm">{c.name}</strong>
                      <span className="text-slate-500 text-[11px] block">{c.address} ({c.venue})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-[#37447E] font-bold text-[11px]">
                        {c.capacity} Seats
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCentre(c.id)}
                        className="size-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer"
                        title="Remove Centre"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rooms List */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5 text-[11px]">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <DoorOpen className="size-3 text-slate-400" />
                        <span>Examination Rooms ({c.rooms?.length || 0})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCentreForRoom(selectedCentreForRoom === c.id ? null : c.id)
                        }
                        className="text-teal-600 font-bold hover:underline cursor-pointer"
                      >
                        + Add Room
                      </button>
                    </div>

                    {selectedCentreForRoom === c.id && (
                      <form
                        onSubmit={handleSubmitRoom(onAddRoomSubmit)}
                        className="my-2 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs"
                      >
                        <input
                          type="text"
                          placeholder="Room 101"
                          {...registerRoom('roomNumber')}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Capacity (60)"
                          {...registerRoom('capacity')}
                          className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                        <button
                          type="submit"
                          disabled={isPending}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold cursor-pointer"
                        >
                          Add
                        </button>
                      </form>
                    )}

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {c.rooms && c.rooms.length > 0 ? (
                        c.rooms.map((r) => (
                          <div
                            key={r.id}
                            className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[11px] font-semibold"
                          >
                            <span>{r.roomNumber}</span>
                            <span className="text-slate-400 text-[10px]">({r.capacity} seats)</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteRoom(r.id)}
                              className="size-4 rounded hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer ml-1"
                              title="Delete Room"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">No rooms created yet. Click &quot;+ Add Room&quot;</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              <Building2 className="size-8 mx-auto text-slate-300 mb-1" />
              <span>No exam venues configured yet. Click &quot;Add New Centre&quot; to begin.</span>
            </div>
          )}
        </div>

        {/* 3. Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
