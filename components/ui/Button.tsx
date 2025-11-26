import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export default function Button({ label, onPress, variant = "primary", className }: ButtonProps) {
  const base = "px-4 py-2 rounded-xl";
  const variants = {
    primary: "bg-blue-600",
    secondary: "bg-gray-500",
    danger: "bg-red-600",
  };

  return (
    <TouchableOpacity onPress={onPress} className={`${base} ${variants[variant]} ${className}`}>
      <Text className="text-white font-semibold text-center">{label}</Text>
    </TouchableOpacity>
  );
}
