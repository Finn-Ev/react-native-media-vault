import * as FileSystem from "expo-file-system";
const { documentDirectory, getInfoAsync } = FileSystem;
import "react-native-get-random-values";
import * as MediaLibrary from "expo-media-library";
import { v4 as uuidv4 } from "uuid";
import { IAlbumAsset } from "../context/AlbumContext";

export const initMediaRoot = async () => {
  try {
    const mediaDirectoryPath = getFullDirectoryPath("assets");
    const directoryExists = (await getInfoAsync(mediaDirectoryPath)).exists;

    if (directoryExists) return;

    await FileSystem.makeDirectoryAsync(mediaDirectoryPath);
    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

export const importAssetsIntoFS = async (assets: IAlbumAsset[]) => {
  const localUris = assets.map((asset) => asset.localUri);
  for (const uri of localUris) {
    const fileName = uuidv4() + "." + getFileExtension(uri);

    await FileSystem.copyAsync({
      from: uri,
      to: getFullDirectoryPath("assets/") + fileName,
    });
  }
};

export const deleteAssetsFromFS = async (assetsToRemove: IAlbumAsset[]) => {
  if (!documentDirectoryExists()) return false;
  const localUris = assetsToRemove.map((asset) => asset.localUri);
  try {
    for (const uri of localUris) {
      await FileSystem.deleteAsync(uri);
    }
    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

export const exportAssetsIntoMediaLibrary = async (assets: IAlbumAsset[]) => {
  const localUris = assets.map((asset) => asset.localUri);
  try {
    const assets = [];
    for (const uri of localUris) {
      assets.push(await MediaLibrary.createAssetAsync(uri));
    }

    await MediaLibrary.addAssetsToAlbumAsync(assets, "Media", false);
  } catch (e) {
    console.warn(e.message);
  }
};

export const getFullDirectoryPath = (dirName: string) => {
  // console.log("getFullDirectoryPath:", documentDirectory! + dirName + "/");
  // console.log(documentDirectory!);
  return documentDirectory! + dirName + "/";
};

export const getFileExtension = (fileName: string) => {
  return fileName.split(".").pop();
};

export const getIsImage = (fileName: string) => {
  const extension = getFileExtension(fileName)?.toLowerCase();

  return (
    extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "heic" ||
    extension === "heif" ||
    extension === "webp"
  );
};

const documentDirectoryExists = () => {
  if (!documentDirectory) {
    console.error("documentDirectory is not available");
    return false;
  }
  return true;
};
