import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import AuthSetupScreen from "../screens/AuthSetup/AuthSetup.screen";
import AuthUnlockScreen from "../screens/AuthUnlock/AuthUnlock.screen";
import { useAuthContext } from "../context/AuthContext";

export type AuthStackParamList = {
  Unlock: undefined;
  SetupAuth: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = ({}) => {
  const hasSetPinCode = useAuthContext()?.selectedPinCode;
  return (
    <Stack.Navigator
      screenOptions={{
        // headerLargeTitle: Platform.OS === "ios",
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: { color: "white" },
      }}
    >
      {!hasSetPinCode ? (
        <Stack.Screen
          name={"SetupAuth"}
          options={{
            headerTitle: "",
          }}
          component={AuthSetupScreen}
        />
      ) : (
        <Stack.Screen
          name={"Unlock"}
          options={{
            headerTitle: "App ist gesperrt",
          }}
          component={AuthUnlockScreen}
        />
      )}
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
