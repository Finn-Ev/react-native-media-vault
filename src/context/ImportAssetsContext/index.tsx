import { createContext, useContext, useState } from "react";
import { importAssetsIntoFSAlbum } from "../../util/MediaHelper";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

// The purpose of this context is to manage the selection and import of assets from the media library
// into the app's filesystem.
export interface IImportAsset {
  localUri: string;
  id: string;
}

export interface IImportAssetsContext {
  assetsToImport: IImportAsset[];
  toggleAsset: (asset: IImportAsset) => void;
  setSelectedAlbum: (album: string) => void;
  importSelectedAssetsIntoFS: () => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const ImportAssetsContext = createContext<IImportAssetsContext | null>(null);

export const useImportAssetsContext = () => useContext(ImportAssetsContext);

export const ImportAssetsContextProvider: React.FC = ({ children }) => {
  const [assetsToImport, setAssetsToImport] = useState<IImportAsset[]>([]);
  const [selectedAlbum, _setSelectedAlbum] = useState<string | null>("");
  const [loading, _setLoading] = useState<boolean>(false);

  const setSelectedAlbum = (album: string) => {
    _setSelectedAlbum(album);
  };

  const setLoading = (loading: boolean) => {
    _setLoading(loading);
  };

  const toggleAsset = (asset: IImportAsset) => {
    if (assetsToImport.includes(asset))
      setAssetsToImport(assetsToImport.filter((a) => a !== asset));
    else setAssetsToImport([...assetsToImport, asset]);
  };

  const importSelectedAssetsIntoFS = async () => {
    if (!selectedAlbum) return console.error("No album selected");
    await importAssetsIntoFSAlbum(assetsToImport, selectedAlbum);

    const assetIds = assetsToImport.map((asset) => asset.id);

    Alert.alert(
      "Duplikate löschen?",
      "Wenn sie die importierten Dateien aus ihrer Galerie löschen wollen, drücken sie im nächsten Schritt auf 'Löschen'",
      [
        {
          text: "Ja, weiter",
          onPress: async () => await MediaLibrary.deleteAssetsAsync(assetIds),
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
