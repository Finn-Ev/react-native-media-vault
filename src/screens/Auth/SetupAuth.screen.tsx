import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthContext } from "../../context/AuthContext";
import { FontAwesome5 } from "@expo/vector-icons";

interface AuthUnlockScreenProps {}

const SetupAuthScreen: React.FC<AuthUnlockScreenProps> = ({}) => {
  const insets = useSafeAreaInsets();
  const authContext = useAuthContext();

  const [userIsSettingUpConfirmationPin, setUserIsSettingUpConfirmationPin] =
    useState(false);
  const [pinInput, setPinInput] = useState("");
  const [confirmPinInput, setConfirmedPinInput] = useState("");

  const pinFields = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", ""];

  const onPinInput = (value: number) => {
    if (userIsSettingUpConfirmationPin && confirmPinInput.length === 4) return;
    if (!userIsSettingUpConfirmationPin && pinInput.length === 4) return;

    let strValue = value.toString();
    if (strValue === "11") {
      // means index 10 + 1 was pressed
      strValue = "0";
    }

    if (userIsSettingUpConfirmationPin) {
      setConfirmedPinInput(confirmPinInput + strValue);
    } else setPinInput(pinInput + strValue);
  };

  const onPinDelete = () => {
    if (userIsSettingUpConfirmationPin) {
      setConfirmedPinInput(confirmPinInput.slice(0, -1));
    } else setPinInput(pinInput.slice(0, -1));
  };

  const onPinConfirm = async () => {
    if (userIsSettingUpConfirmationPin) {
      if (pinInput === confirmPinInput) {
        await authContext?.setSelectedPinCode(pinInput);
        authContext?.setAuthenticated(true);
      } else {
        Alert.alert("Fehler", "Die PINs stimmen nicht überein.");
      }
    } else {
      if (pinInput.length < 4) {
      } else setUserIsSettingUpConfirmationPin(true);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={[styles.heading, { marginTop: -insets.top - 25 }]}>
        Willkommen beim MediaVault!
      </Text>
      <Text style={[styles.heading, { fontSize: 16 }]}>
        {!userIsSettingUpConfirmationPin
          ? "Gib eine vierstellige PIN ein mit der du die App zukünftig entsperren möchtest."
          : "Bestätige die PIN."}
      </Text>
      <Text style={styles.pinInput}>
        {userIsSettingUpConfirmationPin ? confirmPinInput : pinInput}
      </Text>
      <View style={styles.pinNumPadContainer}>
        {pinFields.map((pinField, index) => {
          if (index === 11) {
            return (
              <Pressable
                key={index}
                style={[styles.pinNumField, { padding: 0 }]}
                onPress={onPinConfirm}
              >
                <FontAwesome5 name="check-circle" size={24} color="lightgrey" />
              </Pressable>
            );
          } else if (index === 9) {
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

export default SetupAuthScreen;
