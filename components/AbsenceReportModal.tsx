import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Student {
  id: string;
  name: string;
  grade: string;
}

interface AbsenceReportModalProps {
  visible: boolean;
  onClose: () => void;
  students: Student[];
}

const AbsenceReportModal = ({ visible, onClose, students }: AbsenceReportModalProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    if (!reason.trim()) {
      alert('Please provide a reason for absence');
      return;
    }

    setIsSubmitting(true);
    try {
      const absenceReport = {
        id: Date.now().toString(),
        date: selectedDate.toISOString(),
        reason,
        students: selectedStudents,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };

      // Get existing reports
      const existingReports = await AsyncStorage.getItem('absence_reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      
      // Add new report
      reports.unshift(absenceReport);
      
      // Save updated reports
      await AsyncStorage.setItem('absence_reports', JSON.stringify(reports));

      // Create notification for admin
      const notification = {
        id: Date.now().toString(),
        title: 'New Absence Report',
        message: `Absence reported for ${selectedStudents.length} student(s) on ${selectedDate.toLocaleDateString()}`,
        timestamp: new Date().toLocaleString(),
        read: false,
        type: 'absence' as const,
      };

      const existingNotifications = await AsyncStorage.getItem('admin_notifications');
      const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      notifications.unshift(notification);
      await AsyncStorage.setItem('admin_notifications', JSON.stringify(notifications));

      // Reset form and close modal
      setReason('');
      setSelectedStudents([]);
      setSelectedDate(new Date());
      onClose();
      alert('Absence report submitted successfully');
    } catch (error) {
      console.error('Error submitting absence report:', error);
      alert('Failed to submit absence report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">Report Absence</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Date Selection */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center justify-between p-3 bg-gray-100 rounded-lg"
              >
                <Text className="text-gray-800">
                  {selectedDate.toLocaleDateString()}
                </Text>
                <MaterialIcons name="calendar-today" size={20} color="#666" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setSelectedDate(date);
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Student Selection */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Select Students</Text>
              <View className="space-y-2">
                {students.map((student) => (
                  <TouchableOpacity
                    key={student.id}
                    onPress={() => toggleStudent(student.id)}
                    className={`flex-row items-center p-3 rounded-lg border ${
                      selectedStudents.includes(student.id)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      selectedStudents.includes(student.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-400'
                    }`}>
                      {selectedStudents.includes(student.id) && (
                        <MaterialIcons name="check" size={16} color="white" />
                      )}
                    </View>
                    <View>
                      <Text className="text-gray-800 font-medium">{student.name}</Text>
                      <Text className="text-gray-500 text-sm">Grade {student.grade}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reason Input */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Reason for Absence</Text>
              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Enter reason for absence"
                multiline
                numberOfLines={4}
                className="p-3 bg-gray-100 rounded-lg text-gray-800"
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`py-4 rounded-lg items-center ${
                isSubmitting ? 'bg-blue-300' : 'bg-blue-500'
              }`}
            >
              <Text className="text-white font-medium">
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AbsenceReportModal; 