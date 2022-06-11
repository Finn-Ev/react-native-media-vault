import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform } from "react-native";
import AlbumListScreen from "../screens/Gallery/AlbumList.screen";
import AlbumDetailScreen from "../screens/Gallery/AlbumDetail.screen";
import AssetsDetailScreen from "../screens/Gallery/AssetsDetail.screen";

export type GalleryStackParamList = {
  AlbumList: undefined;
  AlbumDetail: { albumName: string };
  AssetsDetail: {
    assetUris: string[];
    startIndex: number;
    refreshCarousel?: boolean;
  };
};

const Stack = createNativeStackNavigator<GalleryStackParamList>();

const GalleryStackNavigator: React.FC = ({}) => {
  return (
    <Stack.Navigator
      initialRouteName={"AlbumList"}
      screenOptions={{
        headerLargeTitle: Platform.OS === "ios",
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: { color: "white" },
      }}
    >
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
      <Stack.Screen
        name={"AssetsDetail"}
        options={{
          headerTitle: "",
          headerBackVisible: false,
          headerLargeTitle: false,
          animation: "slide_from_bottom",
        }}
        component={AssetsDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default GalleryStackNavigator;
