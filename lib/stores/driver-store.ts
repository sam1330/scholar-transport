// lib/stores/driver-store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// lib/stores/driver-store.ts
export type StudentStatus = 'waiting' | 'picked-up' | 'dropped-off' | 'in-transit';

interface Student {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: StudentStatus;
}

interface DriverStore {
  currentLocation: { latitude: number; longitude: number } | null;
  students: Student[];
  currentStatus: StudentStatus;
  setCurrentLocation: (location: { latitude: number; longitude: number }) => void;
  updateStudentStatus: (studentId: string, newStatus: StudentStatus) => void;
  loadStudents: (students: Student[]) => void;
  updateOverallStatus: (newStatus: StudentStatus) => void;
}

export const useDriverStore = create<DriverStore>()(
  immer((set) => ({
    currentLocation: null,
    students: [],
    currentStatus: 'waiting',
    setCurrentLocation: (location) => set({ currentLocation: location }),
    updateStudentStatus: (studentId, newStatus) =>
      set((state) => {
        const student = state.students.find((s: any) => s.id === studentId);
        if (student) student.status = newStatus;
        return state;
      }),
    loadStudents: (students) => set({ students }),
    updateOverallStatus: (newStatus) => set({ currentStatus: newStatus }),
  }))
);