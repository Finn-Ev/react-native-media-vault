import * as FileSystem from "expo-file-system";
const { documentDirectory, getInfoAsync } = FileSystem;
import "react-native-get-random-values";
import * as MediaLibrary from "expo-media-library";
import { v4 as uuidv4 } from "uuid";

export const initMediaRoot = async () => {
  try {
    const mediaDirectoryPath = getFullDirectoryPath("media/");
    const directoryExists = (await getInfoAsync(mediaDirectoryPath)).exists;

    if (directoryExists) return;

    await FileSystem.makeDirectoryAsync(mediaDirectoryPath);
    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

export const createAlbumInFS = async (albumName: string) => {
  if (!documentDirectoryExists()) return false;
  try {
    const newDirectoryPath = getFullDirectoryPath(
      "media/" + encodeURIComponent(albumName) // deal with " " and "/" etc.
    );

    const directoryExists = (await getInfoAsync(newDirectoryPath)).exists;

    if (directoryExists) return false;

    await FileSystem.makeDirectoryAsync(newDirectoryPath);

    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

export const deleteAlbumFromFS = async (albumName: string) => {
  if (!documentDirectoryExists()) return false;
  try {
    await FileSystem.deleteAsync(getFullDirectoryPath("media/" + albumName));
    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

export const renameAlbumInFS = async (
  albumName: string,
  newAlbumName: string
) => {
  if (!documentDirectoryExists()) return false;
  try {
    await FileSystem.moveAsync({
      from: getFullDirectoryPath("media/" + albumName),
      to: getFullDirectoryPath("media/" + newAlbumName),
    });
    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

export const getAllAlbumsFromFS = async () => {
  if (!documentDirectoryExists()) return false;
  try {
    const directories = await FileSystem.readDirectoryAsync(
      getFullDirectoryPath("media")
    );

    return directories.filter((dirName) => dirName !== ".DS_Store");
  } catch (e) {
    console.warn(e);
  }
};

export const importAssetIntoFSAlbum = async (
  uri: string,
  albumName: string
) => {
  const fileName = uuidv4() + "." + getFileExtension(uri);

  await FileSystem.copyAsync({
    from: uri,
    to: getFullDirectoryPath("media/" + albumName) + fileName,
  });
};

export const getAssetUriFromFSByAlbumAndFileName = (
  albumName: string,
  imageName: string
) => {
  if (!documentDirectoryExists()) return false;

  imageName = imageName.replace(/\s/g, "%20");
  return getFullDirectoryPath("media/" + albumName) + imageName;
};

export const getAlbumAssetsFromFS = async (albumName: string) => {
  if (!documentDirectoryExists()) return false;
  try {
    const directories = await FileSystem.readDirectoryAsync(
      getFullDirectoryPath("media/" + decodeURIComponent(albumName))
    );

    return directories.filter((dirName) => dirName !== ".DS_Store");
  } catch (e) {
    console.warn(e);
  }
};

export const deleteAssetFromFS = async (uri: string) => {
  if (!documentDirectoryExists()) return false;
  try {
    await FileSystem.deleteAsync(uri);
    return true;
  } catch (e) {
    console.warn(e.message);
    return false;
  }
};

// export const getFSAssetInfoByUri = async (uri: string) => {
//   try {
//     return FileSystem.getInfoAsync(uri);
//   } catch (e) {
//     console.warn(e.message);
//   }
// };

export const getFSAlbumInfo = async (albumName: string) => {
  try {
    const uri = getFullDirectoryPath("media/" + albumName);

    return FileSystem.getInfoAsync(uri);
  } catch (e) {
    console.warn(e.message);
  }
};

export const getFSAssetInfo = async (albumName: string, fileName: string) => {
  try {
    const uri = getFullDirectoryPath("media/" + albumName) + fileName;

    return FileSystem.getInfoAsync(uri);
  } catch (e) {
    console.warn(e.message);
  }
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

export const hasMediaRootBeenCreated = async () => {
  try {
    const uri = getFullDirectoryPath("media");

    const album = await FileSystem.getInfoAsync(uri);
    return album.exists;
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

const documentDirectoryExists = () => {
  if (!documentDirectory) {
    console.error("documentDirectory is not available");
    return false;
  }
  return true;
};
