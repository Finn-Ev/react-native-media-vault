import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import SetupAuthScreen from "../screens/Auth/SetupAuth.screen";
import UnlockScreen from "../screens/Auth/Unlock.screen";
import { useAuthContext } from "../context/AuthContext";

export type AuthStackParamList = {
  Unlock: undefined;
  SetupAuth: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = ({}) => {
  const hasSetAuthMethod = useAuthContext()?.selectedAuthMethod;
  return (
    <Stack.Navigator
      screenOptions={{
        // headerLargeTitle: Platform.OS === "ios",
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: { color: "white" },
      }}
    >
      {hasSetAuthMethod ? (
        <Stack.Screen
          name={"Unlock"}
          options={{
            headerTitle: "App ist gesperrt",
          }}
          component={UnlockScreen}
        />
      ) : (
        <Stack.Screen
          name={"SetupAuth"}
          options={{
            headerTitle: "",
          }}
          component={SetupAuthScreen}
        />
      )}
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
