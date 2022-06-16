import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./index";
import { GalleryStackParamList } from "./GalleryStackNavigator";
import { ImportAssetsStackParamList } from "./ImportAssetsStackNavigator";

// navigation prop types
export type FSAlbumListScreenNavigationProps = NativeStackNavigationProp<
  GalleryStackParamList,
  "FSAlbumList"
>;

export type FSAssetListScreenNavigationProps = NativeStackNavigationProp<
  GalleryStackParamList,
  "FSAssetList"
>;

export type FSAssetCarouselScreenNavigationProps = NativeStackNavigationProp<
  GalleryStackParamList,
  "FSAssetCarousel"
>;

export type FSMoveAssetsScreenNavigationProps = NativeStackNavigationProp<
  GalleryStackParamList,
  "FSMoveAssets"
>;

export type MGAlbumListScreenNavigationProps = NativeStackNavigationProp<
  ImportAssetsStackParamList,
  "MGAlbumList"
>;

export type MGAssetListScreenNavigationProps = NativeStackNavigationProp<
  ImportAssetsStackParamList,
  "MGAssetList"
>;

// route prop types
export type FSAlbumListScreenRouteProps = RouteProp<
  GalleryStackParamList,
  "FSAlbumList"
>;

export type FSAssetListScreenRouteProps = RouteProp<
  GalleryStackParamList & RootStackParamList,
  "FSAssetList"
>;
export type FSAssetCarouselScreenRouteProps = RouteProp<
  GalleryStackParamList & RootStackParamList,
  "FSAssetCarousel"
>;

export type FSMoveAssetsScreenRouteProps = RouteProp<
  GalleryStackParamList & RootStackParamList,
  "FSMoveAssets"
>;

export type MediaAlbumListScreenRouteProps = RouteProp<
  ImportAssetsStackParamList,
  "MGAlbumList"
>;

export type MediaAlbumDetailScreenRouteProps = RouteProp<
  ImportAssetsStackParamList,
  "MGAssetList"
>;
