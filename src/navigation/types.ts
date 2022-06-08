import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  AlbumList: undefined;
  AlbumDetail: { albumName: string };
  AssetsDetail: {
    assetUris: string[];
    startIndex: number;
    refreshCarousel?: boolean;
  };
  AssetSelector: { albumName: string };
  Auth: undefined;
};

// navigation prop types
export type AlbumListScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "AlbumList"
>;

export type AlbumDetailScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "AlbumDetail"
>;

export type AssetsDetailScreenScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "AssetsDetail"
>;

export type AssetSelectorScreenNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "AssetSelector"
>;

// route prop types
export type AlbumListScreenRouteProps = RouteProp<
  RootStackParamList,
  "AlbumList"
>;

export type AlbumDetailScreenRouteProps = RouteProp<
  RootStackParamList,
  "AlbumDetail"
>;

export type AssetsDetailScreenRouteProps = RouteProp<
  RootStackParamList,
  "AssetsDetail"
>;

export type AssetSelectorScreenRouteProps = RouteProp<
  RootStackParamList,
  "AssetSelector"
>;
