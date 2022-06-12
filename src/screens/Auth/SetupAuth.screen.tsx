import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { AuthenticationType } from "expo-local-authentication";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthMethod, useAuthContext } from "../../context/AuthContext";

interface AuthUnlockScreenProps {}

const SetupAuthScreen: React.FC<AuthUnlockScreenProps> = ({}) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const insets = useSafeAreaInsets();

  const authContext = useAuthContext();

  const [availableAuthMethods, setAvailableAuthMethods] = useState<
    AuthenticationType[]
  >([]);

  const getAuthMethods = async () => {
    const methods =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    setAvailableAuthMethods(methods);
  };

  const getIsEnrolled = async () => {
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setIsEnrolled(isEnrolled);
  };

  const setAuthMethod = async (authMethod: AuthMethod) => {
    authContext?.setSelectedAuthMethod(authMethod);
    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      return authContext?.setAuthenticated(true);
    }
    Alert.alert(
      "Authentifizierung fehlgeschlagen",
      "Bitte versuche es erneut."
    );
  };

  useEffect(() => {
    getAuthMethods();
    getIsEnrolled();
  }, []);

  useEffect(() => {
    console.log("selectedAuthMethod", authContext?.selectedAuthMethod);
  }, [authContext?.selectedAuthMethod]);

  return (
    <View style={styles.root}>
      <Text style={[styles.heading, { marginTop: -insets.top - 25 }]}>
        Willkommen beim MediaVault!
      </Text>
      <Text style={[styles.heading, { fontSize: 16 }]}>
        Wähle hier aus, wie du die App zukünftig entsperren möchtest
      </Text>
      <View style={styles.availableAuthMethods}>
        {availableAuthMethods.includes(AuthenticationType.FACIAL_RECOGNITION) &&
          isEnrolled &&
          Platform.OS === "ios" && (
            <Text
              onPress={() => setAuthMethod("biometric")}
              style={styles.authMethodButton}
            >
              Biometrisch (FaceID)
            </Text>
          )}

        {availableAuthMethods.includes(AuthenticationType.FINGERPRINT) &&
          isEnrolled && (
            <Text
              onPress={() => setAuthMethod("biometric")}
              style={styles.authMethodButton}
            >
              {Platform.OS === "ios"
                ? "Biometrisch (TouchID)"
                : "Fingerabdruck"}
            </Text>
          )}

        <Text
          onPress={() => setAuthMethod("pin")}
          style={styles.authMethodButton}
        >
          PIN
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  availableAuthMethods: {
    // borderRadius: 10,
  },
  authMethodButton: {
    backgroundColor: "#333",
    fontSize: 16,
    marginBottom: 10,
    paddingVertical: 12.5,
    paddingHorizontal: 25,
    color: "#fff",
    textAlign: "center",
  },
});

export default SetupAuthScreen;
