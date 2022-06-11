import { createContext, useContext, useState } from "react";
import { importAssetsIntoFSAlbum } from "../../util/MediaHelper";

export interface IImportAssetsContext {
  assetsToImport: string[];
  toggleAsset: (asset: string) => void;
  selectedAlbum: string | null;
  setSelectedAlbum: (album: string) => void;
  importSelectedAssetsIntoFS: () => Promise<void>;
}

const ImportAssetsContext = createContext<IImportAssetsContext | null>(null);

export const useImportAssetsContext = () => useContext(ImportAssetsContext);

export const ImportAssetsContextProvider: React.FC = ({ children }) => {
  const [assetsToImport, setAssetsToImport] = useState<string[]>([]);
  const [selectedAlbum, _setSelectedAlbum] = useState<string | null>("");

  const setSelectedAlbum = (album: string) => {
    _setSelectedAlbum(album);
  };

  const toggleAsset = (asset: string) => {
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
    setAssetsToImport([]);
  };

  return (
    <ImportAssetsContext.Provider
      value={{
        assetsToImport,
        toggleAsset,
        selectedAlbum: null,
        setSelectedAlbum,
        importSelectedAssetsIntoFS,
      }}
    >
      {children}
    </ImportAssetsContext.Provider>
  );
};
