import { Text, TouchableOpacity } from "react-native";

interface IQuickActionButton {
  label: string;
  color: string;
  onPress: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}

const QuickActionButton = ({
  icon,
  label,
  color = "#4a90e2",
  disabled = false,
  onPress,
}: IQuickActionButton) => (
  <TouchableOpacity
    className={`w-[48%] py-4 rounded-xl items-center mb-4 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    style={{ backgroundColor: color}}
    onPress={onPress}
  >
    {icon}
    <Text className="text-white mt-2 text-sm font-medium">{label}</Text>
  </TouchableOpacity>
);

export default QuickActionButton;
