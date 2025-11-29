import { View } from "react-native";
import { useTheme } from "@/lib/context/ThemeContext";

interface Props {
  progress: number;
}

export default function ProgressBar({ progress }: Props) {
  const { currentTheme } = useTheme();
  const percentage = Math.round(progress * 100);

  return (
    <View
      style={{ backgroundColor: currentTheme.colors.surface }}
      className="w-full h-4 rounded-full overflow-hidden"
    >
      <View
        style={{
          backgroundColor: currentTheme.colors.progress,
          width: `${percentage}%`,
        }}
        className="h-full rounded-full"
      />
    </View>
  );
}