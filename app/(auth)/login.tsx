import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'El correo es requerido';
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Correo electrónico inválido';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsSubmitting(true);
      try {
        await login(email, password);
        // La navegación se maneja automáticamente en el Context
      } catch (error) {
        Alert.alert('Error', 'Credenciales incorrectas');
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
          <View className="mb-10">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Bienvenido
            </Text>
            <Text className="text-base text-gray-500">
              Inicia sesión para continuar
            </Text>
          </View>

          <View className="space-y-5">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </Text>
              <TextInput
                className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 ${
                  errors.email ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="tu@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
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
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </Text>
              <TextInput
                className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 ${
                  errors.password ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                secureTextEntry
                editable={!isSubmitting}
              />
              {errors.password ? (
                <Text className="text-xs text-red-500 mt-1.5">{errors.password}</Text>
              ) : null}
            </View>

            <TouchableOpacity className="self-end">
              <Text className="text-sm text-gray-600">¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full py-4 rounded-xl mt-2 ${
                isSubmitting ? 'bg-gray-400' : 'bg-gray-900'
              }`}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Text className="text-white text-center font-semibold text-base">
                {isSubmitting ? 'Iniciando...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-600 text-sm">¿No tienes cuenta? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity disabled={isSubmitting}>
                  <Text className="text-gray-900 font-semibold text-sm">Regístrate</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}