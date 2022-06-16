import { createContext, useContext, useEffect, useState } from "react";
import {
  createAlbumInFS,
  deleteAlbumFromFS,
  renameAlbumInFS,
} from "../../util/MediaHelper";
import { getMetaAlbumsFromStorage, saveMetaAlbumsToStorage } from "./storage";

// The purpose of this context is to create and sync FileSystem Albums with Meta-Albums.
// Meta-Albums are stored in the app's state and get persisted in asyncStorage.
// They are needed to display the albums by creation-time and to store values like the selected sort direction for each album
// FS (file system) albums are stored in the device's file system and store the assets themselves.
// FS Albums and Meta-Albums are synced and connected by a 1..1 relation, album name is so to say the primary-key
export interface IMetaAlbum {
  name: string;
  selectedSortDirection: "asc" | "desc";
  createdAt: number;
  updatedAt: number;
}

export interface IAlbumContext {
  metaAlbums: IMetaAlbum[];
  addAlbum: (albumName: string) => Promise<boolean>;
  deleteAlbum: (albumName: string) => Promise<boolean>;
  editAlbumName: (
    currentAlbumName: string,
    newAlbumName: string
  ) => Promise<boolean>;
  getMetaAlbum: (albumId: string) => IMetaAlbum | undefined;
  toggleAlbumSortDirection: (albumName: string) => void;
}

const AlbumContext = createContext<IAlbumContext | null>(null);

export const useAlbumContext = () => useContext(AlbumContext);

export const AlbumContextProvider: React.FC = ({ children }) => {
  const [metaAlbums, setMetaAlbums] = useState<IMetaAlbum[]>([]);

  useEffect(() => {
    (async () => {
      const metaAlbums = await getMetaAlbumsFromStorage();
      setMetaAlbums(metaAlbums);
    })();
  }, []);

  const addAlbum = async (albumName: string) => {
    const successful = await createAlbumInFS(albumName);
    if (successful) {
      const newMetaAlbum: IMetaAlbum = {
        name: albumName,
        selectedSortDirection: "desc",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const newMetaAlbums = sorted([...metaAlbums, newMetaAlbum]);
      setMetaAlbums(newMetaAlbums);
      await saveMetaAlbumsToStorage(newMetaAlbums);
      return true;
    }
    return false;
  };
  const deleteAlbum = async (albumName: string) => {
    const successful = await deleteAlbumFromFS(albumName);
    if (successful) {
      const newMetaAlbums = metaAlbums.filter(
        (metaAlbum) => metaAlbum.name !== albumName
      );
      setMetaAlbums(newMetaAlbums);
      await saveMetaAlbumsToStorage(newMetaAlbums);
      return true;
    } else return false;
  };

  const editAlbumName = async (
    currentAlbumName: string,
    newAlbumName: string
  ) => {
    const currentAlbumVersion = metaAlbums.find(
      (album) => album.name === currentAlbumName
    );

    if (!currentAlbumVersion || !newAlbumName) return false;

    const editedAlbum: IMetaAlbum = {
      ...currentAlbumVersion,
      name: newAlbumName,
    };

    let successful: boolean;
    if (editedAlbum.name !== currentAlbumVersion.name) {
      successful = await renameAlbumInFS(
        currentAlbumVersion.name,
        editedAlbum.name
      );
    } else successful = true;

    if (successful) {
      const newMetaAlbums = [
        ...metaAlbums.filter((album) => album.name !== currentAlbumName),
        editedAlbum,
      ];
      setMetaAlbums(sorted(newMetaAlbums));
      await saveMetaAlbumsToStorage(sorted(newMetaAlbums));
      return true;
    } else return false;
  };

  const getMetaAlbum = (albumName: string) => {
    return metaAlbums.find((album) => album.name === albumName);
  };

  const toggleAlbumSortDirection = async (albumName: string) => {
    const album = getMetaAlbum(albumName);
    if (!album) return;

    const editedAlbum: IMetaAlbum = {
      ...album,
      selectedSortDirection:
        album.selectedSortDirection === "asc" ? "desc" : "asc",
    };
    const newMetaAlbums = [
      ...metaAlbums.filter((album) => album.name !== albumName),
      editedAlbum,
    ];

    setMetaAlbums(sorted(newMetaAlbums));
    await saveMetaAlbumsToStorage(sorted(newMetaAlbums));
  };

  return (
    <AlbumContext.Provider
      value={{
        metaAlbums,
        addAlbum,
        editAlbumName,
        deleteAlbum,
        getMetaAlbum,
        toggleAlbumSortDirection,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

const sorted = (metaAlbums: IMetaAlbum[]) => {
  return metaAlbums.sort((a, b) => {
    if (a.createdAt > b.createdAt) return 1;
    if (a.createdAt < b.createdAt) return -1;
    return 0;
  });
};
