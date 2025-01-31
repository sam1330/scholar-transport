// components/driver/StatusButton.tsx
import { StudentStatus, useDriverStore } from '@/lib/stores/driver-store';
import { Pressable, Text } from 'react-native';

type StatusButtonProps = {
  studentId?: string; // Optional for individual student status
  currentStatus: 'waiting' | 'picked-up' | 'dropped-off' | 'in-transit';
  onStatusChange: (newStatus: StudentStatus) => void;
};

const statusConfig = {
  waiting: { label: 'Pick Up', color: 'bg-gray-500' },
  'picked-up': { label: 'Drop Off', color: 'bg-green-600' },
  'dropped-off': { label: 'Completed', color: 'bg-blue-600' },
  'in-transit': { label: 'In Transit', color: 'bg-yellow-600' },
};

export const StatusButton = ({ studentId, currentStatus }: StatusButtonProps) => {
  const { updateStudentStatus, updateOverallStatus } = useDriverStore();

  const handlePress = () => {
    const nextStatus = getNextStatus(currentStatus);
    
    if (studentId) {
      updateStudentStatus(studentId, nextStatus);
    } else {
      updateOverallStatus(nextStatus);
    }
  };

  const getNextStatus = (current: StudentStatus): StudentStatus => {
    const statusOrder: StudentStatus[] = ['waiting', 'picked-up', 'in-transit', 'dropped-off'];
    const currentIndex = statusOrder.indexOf(current);
    return statusOrder[(currentIndex + 1) % statusOrder.length];
  };

  return (
    <Pressable
      className={`p-4 rounded-lg ${statusConfig[currentStatus].color} active:opacity-75`}
      onPress={handlePress}
    >
      <Text className="text-white font-bold text-center">
        {statusConfig[currentStatus].label}
      </Text>
    </Pressable>
  );
};