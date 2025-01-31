import { ChildCard } from '@/components/parent/ChildCard';
import { StudentStatus } from '@/lib/stores/driver-store';
import { useQuery } from '@tanstack/react-query';
import { View, Text } from 'react-native';
import nativewind from 'nativewind';

export default function ParentDashboard() {
  const fetchChildrenData = () => [{
    id: 1,
    name: 'John Doe',
    status: 'waiting' as StudentStatus,
    lastUpdated: '2023-09-01T10:00:00Z',
  }];

  const handleChildPress = (childId: number) => {};

//   const { data: children } = useQuery({
//     queryKey: ['children'],
//     queryFn: fetchChildrenData
//   });

  const children = fetchChildrenData();
  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4 text-white">Child Status</Text>
      
      {children?.map(child => (
        // <Text className='text-lg font-bold mb-2 text-white'  key={child.id}>{ child.name }</Text>
        <ChildCard
          key={child.id}
          name={child.name}
          status={child.status}
          lastUpdated={child.lastUpdated}
          onPress={() => handleChildPress(child.id)}
        />
      ))}
    </View>
  );
}