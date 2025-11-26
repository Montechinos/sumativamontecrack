import { View } from "react-native";

interface Props {
  progress: number; // valor entre 0 y 1
}

export default function ProgressBar({ progress }: Props) {
  return (
    <View className="w-full bg-gray-300 h-3 rounded-xl mt-4">
      <View
        className="bg-green-500 h-3 rounded-xl"
        style={{ width: `${progress * 100}%` }}
      />
    </View>
  );
}
