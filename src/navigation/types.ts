import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./index";
import { GalleryStackParamList } from "./GalleryStackNavigator";
import { ImportAssetsStackParamList } from "./ImportAssetsStackNavigator";

// navigation prop types
export type AlbumListScreenNavigationProps = NativeStackNavigationProp<
  GalleryStackParamList,
  "AlbumList"
>;

export type AlbumDetailScreenNavigationProps = NativeStackNavigationProp<
  GalleryStackParamList,
  "AlbumDetail"
>;

export type AssetsDetailScreenScreenNavigationProps = NativeStackNavigationProp<
  GalleryStackParamList,
  "AssetsDetail"
>;

export type MediaAlbumListScreenNavigationProps = NativeStackNavigationProp<
  ImportAssetsStackParamList,
  "MediaAlbumList"
>;

export type MediaAlbumDetailScreenNavigationProps = NativeStackNavigationProp<
  ImportAssetsStackParamList,
  "MediaAlbumDetail"
>;

// route prop types
export type AlbumListScreenRouteProps = RouteProp<
  GalleryStackParamList,
  "AlbumList"
>;

export type AlbumDetailScreenRouteProps = RouteProp<
  GalleryStackParamList & RootStackParamList,
  "AlbumDetail"
>;
export type AssetsDetailScreenRouteProps = RouteProp<
  GalleryStackParamList & RootStackParamList,
  "AssetsDetail"
>;

export type MediaAlbumListScreenRouteProps = RouteProp<
  ImportAssetsStackParamList,
  "MediaAlbumList"
>;

export type MediaAlbumDetailScreenRouteProps = RouteProp<
  ImportAssetsStackParamList,
  "MediaAlbumDetail"
>;
