import React, { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/Input";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [formData, setFormData] = useState<IFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<keyof IFormData, string>>({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
  });

  const [role, setRole] = useState<string>("driver");

  const validateForm = () => {
    let newErrors: Record<keyof IFormData, string> = {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Additional sign up validations
    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone number is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);

    if (compatible) {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricEnrolled(enrolled);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        fallbackLabel: "Use password",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Here you would typically authenticate the user
        console.log("Autenticación biométrica exitosamente");
        if(role === "driver") {
          router.push("/(driver)");
        } else {
          router.push("/(parent)");
        }
        // You can add your authentication logic here
      } else {
        console.log("Autenticación biométrica cancelada");
      }
    } catch (error) {
      console.log("Error al realizar la autenticación biométrica:", error);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle authentication logic here
      console.log("Form submitted:", formData);
    }
    if (formData.email === "parent") {
      router.navigate("/(parent)");
    } else if (formData.email === "driver") {
      router.navigate("/(driver)");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient colors={["#4a90e2", "#357abd"]} className="p-10 items-center rounded-b-3xl">
            <FontAwesome5 name="bus-alt" size={50} color="white" />
            <Text className="text-white text-2xl font-bold mt-4">Transporte escolar</Text>
            <Text className="text-white text-lg opacity-90 mt-2">Viaje seguro, Paz mental</Text>
          </LinearGradient>

          <View className="p-5 mt-5">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-5">{isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}</Text>
            {!isLogin && (
              <Input
                placeholder="Nombre completo"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                error={errors.fullName}
                icon={<MaterialIcons name="person" size={20} color="#666" className="mr-2" />}
              />
            )}
            <Input
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              error={errors.email}
              icon={<MaterialIcons name="email" size={20} color="#666" className="mr-2" />}
            />
            {!isLogin && (
              <Input
                placeholder="Número de teléfono"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                error={errors.phone}
                icon={<MaterialIcons name="phone" size={20} color="#666" className="mr-2" />}
              />
            )}
            <Input
              placeholder="Contraseña"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
              error={errors.password}
              icon={<MaterialIcons name="lock" size={20} color="#666" className="mr-2" />}
            />
            {!isLogin && (
              <Input
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry
                error={errors.confirmPassword}
                icon={<MaterialIcons name="lock" size={20} color="#666" className="mr-2" />}
              />
            )}
            <TouchableOpacity className="bg-blue-500 py-4 rounded-xl items-center mt-5" onPress={handleSubmit}>
              <Text className="text-white text-lg font-bold">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</Text>
            </TouchableOpacity>
            {isLogin && isBiometricSupported && isBiometricEnrolled && (
              <TouchableOpacity className="flex-row items-center justify-center mt-5 p-3 bg-gray-100 rounded-xl border border-blue-500" onPress={handleBiometricAuth}>
                <MaterialIcons name="fingerprint" size={32} color="#4a90e2" />
                <Text className="ml-2 text-lg text-blue-500 font-semibold">Usar autenticación biométrica</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="mt-5 items-center"
              onPress={() => {
                setIsLogin(!isLogin);
                setErrors({ email: "", password: "", confirmPassword: "", fullName: "", phone: "" });
                setFormData({ email: "", password: "", confirmPassword: "", fullName: "", phone: "" });
              }}
            >
              <Text className="text-blue-500 text-lg">
                {isLogin ? "No tienes una cuenta? Regístrate" : "Ya tienes una cuenta? Inicia Sesión"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  biometricButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4a90e2",
  },
  biometricText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#4a90e2",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  headerSubtitle: {
    color: "white",
    fontSize: 16,
    opacity: 0.9,
    marginTop: 8,
  },
  formContainer: {
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: "#4a90e2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchButton: {
    marginTop: 20,
    alignItems: "center",
  },
  switchButtonText: {
    color: "#4a90e2",
    fontSize: 16,
  },
});

export default AuthScreen;
