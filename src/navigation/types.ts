import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  AlbumList: undefined;
  AlbumDetail: { albumName: string };
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

// route prop types
export type AlbumDetailScreenRouteProps = RouteProp<
  RootStackParamList,
  "AlbumDetail"
>;
