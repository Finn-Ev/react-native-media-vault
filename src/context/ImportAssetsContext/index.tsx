import { createContext, useContext, useState } from "react";
import {
  getFileExtension,
  getFullDirectoryPath,
  importAssetsIntoFS,
} from "../../util/MediaHelper";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import { IAlbumAsset, useAlbumContext } from "../AlbumContext";
import { v4 as uuidv4 } from "uuid";
import * as FileSystem from "expo-file-system";

// The purpose of this context is to manage the selection and import of assets from the media library
// into the app's filesystem.
export interface IImportAssetsContext {
  assetsToImport: IAlbumAsset[];
  toggleAsset: (asset: IAlbumAsset) => void;
  setSelectedAlbum: (album: string) => void;
  importSelectedAssetsIntoFS: () => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const ImportAssetsContext = createContext<IImportAssetsContext | null>(null);

export const useImportAssetsContext = () => useContext(ImportAssetsContext);

export const ImportAssetsContextProvider: React.FC = ({ children }) => {
  const [assetsToImport, setAssetsToImport] = useState<IAlbumAsset[]>([]);
  const [selectedAlbum, _setSelectedAlbum] = useState<string | null>("");
  const [loading, _setLoading] = useState<boolean>(false);

  const albumContext = useAlbumContext();

  const setSelectedAlbum = (album: string) => {
    _setSelectedAlbum(album);
  };

  const setLoading = (loading: boolean) => {
    _setLoading(loading);
  };

  const toggleAsset = (asset: IAlbumAsset) => {
    if (assetsToImport.some((a) => a.id === asset.id)) {
      setAssetsToImport(assetsToImport.filter((a) => a !== asset));
    } else setAssetsToImport([...assetsToImport, asset]);
  };

  const importSelectedAssetsIntoFS = async () => {
    if (!selectedAlbum) return console.error("No album selected");

    for (const asset of assetsToImport) {
      const fileName = uuidv4() + "." + getFileExtension(asset.localUri);

      const newLocalUri = getFullDirectoryPath("assets") + fileName;

      await FileSystem.copyAsync({
        from: asset.localUri,
        to: newLocalUri,
      });

      asset.localUri = newLocalUri;
    }

    await albumContext?.addAssetsToAlbum(selectedAlbum, assetsToImport);

    const deviceGalleryIds = assetsToImport.map(
      (asset) => asset.deviceGalleryId
    );
    Alert.alert(
      "Duplikate löschen?",
      "Wenn sie die importierten Dateien aus ihrer Galerie löschen wollen, drücken sie im nächsten Schritt auf 'Löschen'",
      [
        {
          text: "Ja, weiter",
          onPress: async () =>
            await MediaLibrary.deleteAssetsAsync(deviceGalleryIds),
        },
        {
          text: "Nein, abbrechen",
          style: "cancel",
        },
      ]
    );

    setAssetsToImport([]);
  };

  const reset = () => {
    setAssetsToImport([]);
    _setSelectedAlbum(null);
    setLoading(false);
  };

  return (
    <ImportAssetsContext.Provider
      value={{
        assetsToImport,
        toggleAsset,
        setSelectedAlbum,
        importSelectedAssetsIntoFS,
        loading,
        setLoading,
        reset,
      }}
    >
      {children}
    </ImportAssetsContext.Provider>
  );
};
