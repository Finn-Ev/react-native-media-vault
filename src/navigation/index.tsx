import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AlbumListScreen from "../screens/AlbumList.screen";
import AuthScreen from "../screens/Auth.screen";
import { Platform } from "react-native";
import { RootStackParamList } from "./types";
import AlbumDetailScreen from "../screens/AlbumDetail.screen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: React.FC = ({}) => {
  const isAuthenticated = true;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={"Auth"}
        screenOptions={{
          headerLargeTitle: Platform.OS === "ios",
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: { color: "white" },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name={"AlbumList"}
              options={{
                headerTitle: "Alben",
              }}
              component={AlbumListScreen}
            />
            <Stack.Screen
              name={"AlbumDetail"}
              options={{ headerTitle: "" }}
              component={AlbumDetailScreen}
            />
          </>
        ) : (
          <Stack.Screen name={"Auth"} component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
