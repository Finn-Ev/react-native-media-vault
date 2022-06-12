import {
  Alert,
  AppState,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { AuthenticationType } from "expo-local-authentication";
import React, { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthMethod, useAuthContext } from "../../context/AuthContext";

interface AuthUnlockScreenProps {}

const UnlockScreen: React.FC<AuthUnlockScreenProps> = ({}) => {
  const insets = useSafeAreaInsets();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const authContext = useAuthContext();

  const [availableAuthMethods, setAvailableAuthMethods] = useState<
    AuthenticationType[]
  >([]);

  const authenticate = async () => {
    if (authContext?.selectedAuthMethod === "pin") {
      // todo
      Alert.alert("PIN-Authentifizierung");
      console.log("PIN-Authentifizierung");
    } else {
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        return authContext?.setAuthenticated(true);
      }
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        authenticate();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <View style={styles.root}></View>;
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

export default UnlockScreen;
