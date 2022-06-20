import { createContext, useContext, useEffect, useState } from "react";
import { deleteAssetsFromFS } from "../../util/MediaHelper";
import { getMetaAlbumsFromStorage, saveMetaAlbumsToStorage } from "./storage";

// The purpose of this context is to create and sync FileSystem Albums with Meta-Albums.
// Meta-Albums are stored in the app's state and get persisted in asyncStorage.
// They are needed to display the albums by creation-time and to store values like the selected sort direction for each album
// FS (file system) albums are stored in the device's file system and store the assets themselves.
// FS Albums and Meta-Albums are synced and connected by a 1..1 relation, album name is so to say the primary-key

export interface IAlbumAsset {
  id: string;
  deviceGalleryId: string; // doesn't have to be unique
  localUri: string;
  addedAt: number;
  createdAt: number;
  type: "photo" | "video";
  duration?: number;
  height?: number;
  width?: number;
}

export interface IAlbum {
  name: string;
  selectedSortDirection: "asc" | "desc";
  createdAt: number;
  updatedAt: number;
  assets: IAlbumAsset[];
}

export interface IAlbumContext {
  metaAlbums: IAlbum[];
  addAlbum: (albumName: string) => Promise<boolean>;
  deleteAlbum: (albumName: string) => Promise<boolean>;
  editAlbumName: (
    currentAlbumName: string,
    newAlbumName: string
  ) => Promise<boolean>;
  getMetaAlbum: (albumId: string) => IAlbum | undefined;
  toggleAlbumSortDirection: (albumName: string) => void;

  getAssetsByAlbum: (albumName: string) => IAlbumAsset[];
  getAssetsByIdsFromAlbum: (albumName: string, ids: string[]) => IAlbumAsset[];
  addAssetsToAlbum: (
    albumName: string,
    assets: IAlbumAsset[]
  ) => Promise<boolean>;
  moveAssetsFromAlbumToAlbum: (
    sourceAlbum: string,
    destinationAlbum: string,
    assetIds: string[]
  ) => Promise<boolean>;
  // copyAssetsFromAlbumToAlbum: () => Promise<boolean>;
  removeAssetsFromAlbum: (
    albumName: string,
    assetsIdsToRemove: string[]
  ) => Promise<boolean>;
}

const AlbumContext = createContext<IAlbumContext | null>(null);

export const useAlbumContext = () => useContext(AlbumContext);

export const AlbumContextProvider: React.FC = ({ children }) => {
  const [metaAlbums, setMetaAlbums] = useState<IAlbum[]>([]);

  useEffect(() => {
    (async () => {
      const metaAlbums = await getMetaAlbumsFromStorage();
      setMetaAlbums(metaAlbums);
    })();
  }, []);

  const addAlbum = async (albumName: string) => {
    if (getMetaAlbum(albumName)) return false; // album already exists

    const newMetaAlbum: IAlbum = {
      name: albumName,
      selectedSortDirection: "desc",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      assets: [],
    };
    const newMetaAlbums = sortAlbums([...metaAlbums, newMetaAlbum]);
    setMetaAlbums(newMetaAlbums);
    await saveMetaAlbumsToStorage(newMetaAlbums);
    return true;
  };
  const deleteAlbum = async (albumName: string) => {
    const newMetaAlbums = metaAlbums.filter(
      (metaAlbum) => metaAlbum.name !== albumName
    );
    setMetaAlbums(newMetaAlbums);
    await saveMetaAlbumsToStorage(newMetaAlbums);
    return true;
  };

  const editAlbumName = async (
    currentAlbumName: string,
    newAlbumName: string
  ) => {
    const currentAlbumVersion = getMetaAlbum(currentAlbumName);

    if (!currentAlbumVersion || !newAlbumName) return false;

    const editedAlbum: IAlbum = {
      ...currentAlbumVersion,
      name: newAlbumName,
    };

    const newMetaAlbums = [
      ...metaAlbums.filter((album) => album.name !== currentAlbumName),
      editedAlbum,
    ];
    setMetaAlbums(sortAlbums(newMetaAlbums));
    await saveMetaAlbumsToStorage(sortAlbums(newMetaAlbums));
    return true;
  };

  const getMetaAlbum = (albumName: string) => {
    return metaAlbums.find((album) => album.name === albumName);
  };

  const toggleAlbumSortDirection = async (albumName: string) => {
    const album = getMetaAlbum(albumName);
    if (!album) return;

    const editedAlbum: IAlbum = {
      ...album,
      selectedSortDirection:
        album.selectedSortDirection === "asc" ? "desc" : "asc",
    };
    const newMetaAlbums = [
      ...metaAlbums.filter((album) => album.name !== albumName),
      editedAlbum,
    ];

    setMetaAlbums(sortAlbums(newMetaAlbums));
    await saveMetaAlbumsToStorage(sortAlbums(newMetaAlbums));
  };

  const getAssetsByAlbum = (albumName: string) => {
    const album = getMetaAlbum(albumName);
    // console.log(album);
    if (!album) return [];

    return sortedAssets(album);
  };

  const getAssetsByIdsFromAlbum = (albumName: string, ids: string[]) => {
    const album = getMetaAlbum(albumName);
    if (!album) return [];
    const assets: IAlbumAsset[] = [];
    for (const id of ids) {
      const asset = album.assets.find((asset) => asset.id === id);
      if (asset) assets.push(asset);
    }
    album.assets = assets;
    return sortedAssets(album);
  };

  const addAssetsToAlbum = async (
    albumName: string,
    assetsToAdd: IAlbumAsset[]
  ) => {
    const album = getMetaAlbum(albumName);
    if (!album) return false;

    const newAssets = [...album.assets, ...assetsToAdd];

    const editedAlbum: IAlbum = {
      ...album,
      assets: newAssets,
    };

    const newMetaAlbums = [
      ...metaAlbums.filter((album) => album.name !== albumName),
      editedAlbum,
    ];

    console.log("Adding " + assetsToAdd.length + " Assets to " + albumName);
    console.log("newMetaAlbums: ", newMetaAlbums);

    setMetaAlbums(sortAlbums(newMetaAlbums));
    await saveMetaAlbumsToStorage(sortAlbums(newMetaAlbums));

    return true;
  };

  const moveAssetsFromAlbumToAlbum = async (
    sourceAlbum: string,
    destinationAlbum: string,
    assetIds: string[]
  ) => {
    return true;
  };

  const removeAssetsFromAlbum = async (
    albumName: string,
    assetsIdsToRemove: string[]
  ) => {
    const album = getMetaAlbum(albumName);
    if (!album) return false;

    // console.log("removeAssetsBeforeFilter:", album.assets.length);

    const newAssets = album.assets.filter(
      (asset) => !assetsIdsToRemove.includes(asset.id)
    );
    // console.log("removeAssetsAfterFilter:", newAssets);

    const editedAlbum: IAlbum = {
      ...album,
      assets: newAssets,
    };

    const newMetaAlbums = [
      ...metaAlbums.filter((album) => album.name !== albumName),
      editedAlbum,
    ];

    setMetaAlbums(sortAlbums(newMetaAlbums));
    await saveMetaAlbumsToStorage(sortAlbums(newMetaAlbums));

    // TODO test if all assets with the uri are removed or just the first one
    // remove assets from fs, as they from now on don't belong to any album
    const assetsToRemove = getAssetsByIdsFromAlbum(
      albumName,
      assetsIdsToRemove
    );
    await deleteAssetsFromFS(assetsToRemove);

    return true;
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
        getAssetsByAlbum,
        addAssetsToAlbum,
        moveAssetsFromAlbumToAlbum,
        removeAssetsFromAlbum,
        getAssetsByIdsFromAlbum,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

const sortAlbums = (metaAlbums: IAlbum[]) => {
  return metaAlbums.sort((a, b) => {
    if (a.createdAt > b.createdAt) return 1;
    if (a.createdAt < b.createdAt) return -1;
    return 0;
  });
};

const sortedAssets = (album: IAlbum) => {
  let sortedAssets: IAlbumAsset[] = [];
  if (album.selectedSortDirection === "asc") {
    sortedAssets = album.assets.sort((a, b) => {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    });
  } else if (album.selectedSortDirection === "desc") {
    sortedAssets = album.assets.sort((a, b) => {
      if (a.createdAt > b.createdAt) return 1;
      if (a.createdAt < b.createdAt) return -1;
      return 0;
    });
  }
  return sortedAssets;
};
