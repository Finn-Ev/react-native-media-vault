import { StyleSheet, View, Text } from "react-native";

interface AuthUnlockScreenProps {}

const AuthUnlockScreen: React.FC<AuthUnlockScreenProps> = ({}) => {
  return (
    <View style={styles.root}>
      <Text style={{ color: "white" }}>Unlock Screen</Text>
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
});

export default AuthUnlockScreen;
