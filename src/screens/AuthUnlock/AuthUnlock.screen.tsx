import {
  Alert,
  AppState,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthContext } from "../../context/AuthContext";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const AuthUnlockScreen: React.FC = ({}) => {
  const insets = useSafeAreaInsets();
  const appState = useRef(AppState.currentState);

  const [pinInput, setPinInput] = useState("");

  const authContext = useAuthContext();

  const pinFields = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""];

  const checkPin = async (pin: string) => {
    const selectedPinCode = authContext?.selectedPinCode;
    if (selectedPinCode === pin) {
      return setTimeout(() => {
        authContext?.setAuthenticated(true);
      }, 200);
      // without the timeout-delay, the user might get confused because he/she never sees the entered PIN completly
    } else {
      Alert.alert("Fehler", "Falsche PIN.", [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              setPinInput("");
            }, 200);
          },
        },
      ]);
    }
  };

  const authenticateLocally = async () => {
    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      return authContext?.setAuthenticated(true);
    }
  };

  const onPinInput = async (value: number) => {
    let strValue = value.toString();
    if (strValue === "11") {
      // means index 10 + 1 was pressed
      strValue = "0";
    }

    const newPinInput = pinInput + strValue;
    setPinInput(newPinInput);
    if (newPinInput.length === 4) return checkPin(newPinInput);
  };

  const onPinDelete = () => {
    setPinInput(pinInput.slice(0, -1));
  };

  return (
    <View style={styles.root}>
      <View style={styles.root}>
        <Text style={[styles.heading, { marginTop: -insets.top - 25 }]}>
          Willkommen zurück!
        </Text>
        <Text style={[styles.heading, { fontSize: 16 }]}>
          Gib zum entsperren deine PIN ein.
        </Text>
        <Text style={styles.pinInput}>{pinInput}</Text>
        <View style={styles.pinNumPadContainer}>
          {pinFields.map((pinField, index) => {
            if (index === 9) {
              return (
                <Pressable
                  onPress={authenticateLocally}
                  key={index}
                  style={[styles.pinNumField, { padding: 0 }]}
                >
                  <Ionicons name="finger-print" size={26} color="white" />
                </Pressable>
              );
            } else if (index === 11) {
              return (
                <Pressable
                  onPress={onPinDelete}
                  key={index}
                  style={[styles.pinNumField, { padding: 0 }]}
                >
                  <FontAwesome5 name="backspace" size={24} color="lightgrey" />
                </Pressable>
              );
            } else {
              return (
                <Pressable
                  onPress={() => onPinInput(index + 1)}
                  key={index}
                  style={styles.pinNumField}
                >
                  <Text style={styles.pinNumFieldText}>{pinField}</Text>
                </Pressable>
              );
            }
          })}
        </View>
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
  pinInput: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
    height: 30,
  },
  pinNumPadContainer: {
    maxWidth: "66.66%",
    // paddingHorizontal: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // borderRadius: 10,
  },
  pinNumField: {
    height: 50,
    width: "30%",
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 100,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  pinNumFieldText: {
    color: "#fff",
    fontSize: 20,
  },
});

export default AuthUnlockScreen;
