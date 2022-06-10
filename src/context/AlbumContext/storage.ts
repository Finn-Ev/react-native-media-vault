import AsyncStorage from "@react-native-async-storage/async-storage";
import { IMetaAlbum } from "./index";

export const saveMetaAlbumsToStorage = async (value: IMetaAlbum[]) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("albumContext", jsonValue);
  } catch (e) {
    console.warn(e.message);
  }
};

export const getMetaAlbumsFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("albumContext");
    if (jsonValue) return JSON.parse(jsonValue) as IMetaAlbum[];
    else return [] as IMetaAlbum[];
  } catch (e) {
    console.warn(e.message);
    return [] as IMetaAlbum[];
  }
};

export const saveAlbumListSortDirectionToStorage = async (
  value: "asc" | "desc"
) => {
  try {
    await AsyncStorage.setItem("albumListSortDirection", value.toString());
    return true;
  } catch (e) {
    console.warn(e.message);
  }
};

export const getAlbumListSortDirectionFromStorage = async () => {
  // todo optimise
  try {
    const value = await AsyncStorage.getItem("albumListSortDirection");
    return value as "asc" | "desc";
  } catch (e) {
    console.warn(e.message);
    // return null;
  }
};
