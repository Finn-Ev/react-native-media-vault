import * as FileSystem from "expo-file-system";
const { documentDirectory, getInfoAsync } = FileSystem;
import "react-native-get-random-values";
import * as MediaLibrary from "expo-media-library";
import { v4 as uuidv4 } from "uuid";

export const createDirectory = async (dirName: string) => {
  if (!documentDirectoryExists()) return false;
  try {
    const newDirectoryPath = getFullDirectoryPath(dirName).replace(
      /\s/g,
      "%20"
    );

    const directoryExists = (await getInfoAsync(newDirectoryPath)).exists;

    if (directoryExists) return;

    await FileSystem.makeDirectoryAsync(newDirectoryPath);

    return true;
  } catch (e) {
    console.warn(e.message);
  }
};

export const importAssetIntoAlbum = async (uri: string, albumName: string) => {
  const fileName = uuidv4() + "." + getFileExtension(uri);

  await FileSystem.copyAsync({
    from: uri,
    to: getFullDirectoryPath("media/" + albumName) + fileName,
  });
};

export const exportAssetsIntoMediaLibrary = async (uris: string[]) => {
  try {
    const assets = [];
    for (const uri of uris) {
      assets.push(await MediaLibrary.createAssetAsync(uri));
    }

    await MediaLibrary.addAssetsToAlbumAsync(assets, "Media", false);
  } catch (e) {
    console.warn(e.message);
  }
};

export const readDirectory = async (dirName: string) => {
  if (!documentDirectoryExists()) return false;
  try {
    const directories = await FileSystem.readDirectoryAsync(
      getFullDirectoryPath(dirName)
    );

    return directories.filter((dirName) => dirName !== ".DS_Store");
  } catch (e) {
    console.warn(e);
  }
};

export const deleteDirectory = async (dirName: string) => {
  if (!documentDirectoryExists()) return false;
  try {
    await FileSystem.deleteAsync(getFullDirectoryPath(dirName));
    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

export const deleteAsset = async (uri: string) => {
  if (!documentDirectoryExists()) return false;
  try {
    await FileSystem.deleteAsync(uri);
    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

const documentDirectoryExists = () => {
  if (!documentDirectory) {
    console.error("documentDirectory is not available");
    return false;
  }
  return true;
};

export const getImageUriByAlbumAndFileName = (
  albumName: string,
  imageName: string
) => {
  if (!documentDirectoryExists()) return false;

  imageName = imageName.replace(/\s/g, "%20");
  return getFullDirectoryPath("media/" + albumName) + imageName;
};

export const getImageInfoByUri = async (uri: string) => {
  try {
    return FileSystem.getInfoAsync(uri);
  } catch (e) {
    console.warn(e.message);
  }
};

export const getImageInfo = async (albumName: string, fileName: string) => {
  try {
    const uri = getFullDirectoryPath("media/" + albumName) + fileName;

    return FileSystem.getInfoAsync(uri);
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
    extension === "png" ||
    extension === "heic" ||
    extension === "webp"
  );
};
