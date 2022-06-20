import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform } from "react-native";
import FSAlbumListScreen from "../screens/FSAlbumList/FSAlbumList.screen";
import FSAssetListScreen from "../screens/FSAssetList/FSAssetList.screen";
import FSAssetCarouselScreen from "../screens/FSAssetCarousel/FSAssetCarousel.screen";
import FSMoveAssetsScreen from "../screens/FSMoveAssets/FSMoveAssets.screen";

export type GalleryStackParamList = {
  FSAlbumList: { assetsHaveChanged: boolean };
  FSAssetList: { albumName: string };
  FSAssetCarousel: {
    assetIds: string[];
    startIndex: number;
    albumName: string;
  };
  FSMoveAssets: {
    assetIds: string[];
    sourceAlbumName: string;
  };
};

const Stack = createNativeStackNavigator<GalleryStackParamList>();

const GalleryStackNavigator: React.FC = ({}) => {
  return (
    <Stack.Navigator
      initialRouteName={"FSAlbumList"}
      screenOptions={{
        headerLargeTitle: Platform.OS === "ios",
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: { color: "white" },
      }}
    >
      <Stack.Screen
        name={"FSAlbumList"}
        options={{
          headerTitle: "Alben",
        }}
        component={FSAlbumListScreen}
      />
      <Stack.Screen
        name={"FSAssetList"}
        options={{ headerTitle: "" }}
        component={FSAssetListScreen}
      />
      <Stack.Screen
        name={"FSAssetCarousel"}
        options={{
          headerTitle: "",
          headerBackVisible: false,
          headerLargeTitle: false,
          animation: "slide_from_bottom",
        }}
        component={FSAssetCarouselScreen}
      />

      <Stack.Screen
        name={"FSMoveAssets"}
        options={{
          headerTitle: "",
          headerBackVisible: true,
          headerLargeTitle: false,
        }}
        component={FSMoveAssetsScreen}
      />
    </Stack.Navigator>
  );
};

export default GalleryStackNavigator;
