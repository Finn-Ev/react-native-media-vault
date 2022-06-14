import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, Pressable, Text } from "react-native";
import FSAlbumListScreen from "../screens/FSAlbumList/FSAlbumList.screen";
import AlbumDetailScreen from "../screens/FSAssetList/FSAssetList.screen";
import MGAlbumListScreen from "../screens/MGAlbumList/MGAlbumList.screen";
import MGAssetListScreen from "../screens/MGAssetList/MGAssetList.screen";

export type ImportAssetsStackParamList = {
  MediaAlbumList: undefined;
  MediaAlbumDetail: { albumId: string; albumName: string };
};

const Stack = createNativeStackNavigator<ImportAssetsStackParamList>();

const ImportAssetsStackNavigator: React.FC = ({}) => {
  return (
    <Stack.Navigator
      initialRouteName={"MediaAlbumList"}
      screenOptions={({ navigation }) => ({
        headerLargeTitle: Platform.OS === "ios",
        headerStyle: { backgroundColor: "black" },
        headerTitleStyle: { color: "white" },
        headerRight: () => (
          <Pressable
            hitSlop={16}
            onPress={() => navigation.navigate("Gallery")}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Abbrechen</Text>
          </Pressable>
        ),
      })}
    >
      <Stack.Screen
        name={"MediaAlbumList"}
        options={{
          headerTitle: "Meine Alben",
        }}
        component={MGAlbumListScreen}
      />
      <Stack.Screen
        name={"MediaAlbumDetail"}
        options={{ headerTitle: "" }}
        component={MGAssetListScreen}
      />
    </Stack.Navigator>
  );
};

export default ImportAssetsStackNavigator;
