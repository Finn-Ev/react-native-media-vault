import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { Platform } from "react-native";
import AlbumListScreen from "../screens/Gallery/AlbumList.screen";
import AlbumDetailScreen from "../screens/Gallery/AlbumDetail.screen";
import AssetsDetailScreen from "../screens/Gallery/AssetsDetail.screen";
import AuthUnlockScreen from "../screens/Auth/AuthUnlock.screen";

export type AuthStackParamList = {
  Unlock: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStackNavigator: React.FC = ({}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: Platform.OS === "ios",
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: { color: "white" },
      }}
    >
      <Stack.Screen
        name={"Unlock"}
        options={{
          headerTitle: "Unlock",
        }}
        component={AuthUnlockScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
