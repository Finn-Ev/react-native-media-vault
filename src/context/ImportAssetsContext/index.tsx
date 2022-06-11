import { createContext, useContext, useState } from "react";
import { importAssetsIntoFSAlbum } from "../../util/MediaHelper";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export interface IAssetToImport {
  localUri: string;
  id: string;
}

export interface IImportAssetsContext {
  assetsToImport: IAssetToImport[];
  toggleAsset: (asset: IAssetToImport) => void;
  setSelectedAlbum: (album: string) => void;
  importSelectedAssetsIntoFS: () => Promise<void>;
}

const ImportAssetsContext = createContext<IImportAssetsContext | null>(null);

export const useImportAssetsContext = () => useContext(ImportAssetsContext);

export const ImportAssetsContextProvider: React.FC = ({ children }) => {
  const [assetsToImport, setAssetsToImport] = useState<IAssetToImport[]>([]);
  const [selectedAlbum, _setSelectedAlbum] = useState<string | null>("");

  const setSelectedAlbum = (album: string) => {
    _setSelectedAlbum(album);
  };

  const toggleAsset = (asset: IAssetToImport) => {
    if (assetsToImport.includes(asset))
      setAssetsToImport(assetsToImport.filter((a) => a !== asset));
    else setAssetsToImport([...assetsToImport, asset]);
  };

  const clearAssets = () => {
    setAssetsToImport([]);
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

  return (
    <ImportAssetsContext.Provider
      value={{
        assetsToImport,
        toggleAsset,
        setSelectedAlbum,
        importSelectedAssetsIntoFS,
      }}
    >
      {children}
    </ImportAssetsContext.Provider>
  );
};
