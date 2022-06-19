import AsyncStorage from "@react-native-async-storage/async-storage";
import { IAlbum } from "./index";

export const saveMetaAlbumsToStorage = async (value: IAlbum[]) => {
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
    if (jsonValue) return JSON.parse(jsonValue) as IAlbum[];
    else return [] as IAlbum[];
  } catch (e) {
    console.warn(e.message);
    return [] as IAlbum[];
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
