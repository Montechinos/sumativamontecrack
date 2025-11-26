import { Modal, View } from "react-native";
import React from "react";

interface ModalProps {
  visible: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export default function ModalWrapper({ visible, children }: ModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40 p-4">
        <View className="bg-white w-full p-5 rounded-xl">
          {children}
        </View>
      </View>
    </Modal>
  );
}
