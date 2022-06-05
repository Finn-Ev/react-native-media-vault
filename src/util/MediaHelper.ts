import * as FileSystem from "expo-file-system";
const { documentDirectory, getInfoAsync } = FileSystem;

export const createDirectory = async (dirName: string) => {
  try {
    if (!documentDirectory) {
      console.error("documentDirectory ist available");
      return;
    }
    const newDirectoryPath = documentDirectory + dirName + "/";
    console.log(newDirectoryPath);

    const directoryExists = (await getInfoAsync(newDirectoryPath)).exists;

    if (directoryExists) return;

    await FileSystem.makeDirectoryAsync(newDirectoryPath);
  } catch (e) {
    console.log(e.message);
  }
};
