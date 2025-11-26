import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateAlphanumeric = (text: string) => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    return alphanumericRegex.test(text);
  };

  const handleRegister = async () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
      valid = false;
    } else if (!validateAlphanumeric(formData.name)) {
      newErrors.name = 'Solo caracteres alfanuméricos';
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
      valid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsSubmitting(true);
      try {
        await register(formData.name, formData.email, formData.password);
        // La navegación se maneja automáticamente en el Context
      } catch (error) {
        Alert.alert('Error', 'No se pudo completar el registro');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8">
        <View className="w-full max-w-md mx-auto">
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Crear cuenta
            </Text>
            <Text className="text-base text-gray-500">
              Completa tus datos para comenzar
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Nombre completo</Text>
              <TextInput
                className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 ${
                  errors.name ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="Juan Pérez"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  setErrors({ ...errors, name: '' });
                }}
                editable={!isSubmitting}
              />
              {errors.name ? (
                <Text className="text-xs text-red-500 mt-1.5">{errors.name}</Text>
              ) : null}
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Correo electrónico</Text>
              <TextInput
                className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="tu@email.com"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  setErrors({ ...errors, email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSubmitting}
              />
              {errors.email ? (
                <Text className="text-xs text-red-500 mt-1.5">{errors.email}</Text>
              ) : null}
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Contraseña</Text>
              <TextInput
                className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 ${
                  errors.password ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  setErrors({ ...errors, password: '' });
                }}
                secureTextEntry
                editable={!isSubmitting}
              />
              {errors.password ? (
                <Text className="text-xs text-red-500 mt-1.5">{errors.password}</Text>
              ) : null}
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</Text>
              <TextInput
                className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 ${
                  errors.confirmPassword ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData({ ...formData, confirmPassword: text });
                  setErrors({ ...errors, confirmPassword: '' });
                }}
                secureTextEntry
                editable={!isSubmitting}
              />
              {errors.confirmPassword ? (
                <Text className="text-xs text-red-500 mt-1.5">{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              className={`w-full py-4 rounded-xl mt-2 ${
                isSubmitting ? 'bg-gray-400' : 'bg-gray-900'
              }`}
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Text className="text-white text-center font-semibold text-base">
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-sm">¿Ya tienes cuenta? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity disabled={isSubmitting}>
                  <Text className="text-gray-900 font-semibold text-sm">Inicia sesión</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}