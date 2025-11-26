import { TextInput } from "react-native";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  className,
}: InputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
      className={`border border-gray-300 rounded-xl p-3 text-base ${multiline ? "h-24" : ""} ${className}`}
      placeholderTextColor="#999"
    />
  );
}
