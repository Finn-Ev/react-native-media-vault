import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  MGAssetListScreenNavigationProps,
  MediaAlbumDetailScreenRouteProps,
} from "../../navigation/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import ImagePreview from "../../components/ImagePreview";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useImportAssetsContext } from "../../context/ImportAssetsContext";
import FSFooterMenu from "../../components/FSFooterMenu";
import { Entypo } from "@expo/vector-icons";
import { IMPORT_ASSETS_PAGE_SIZE } from "../../constants";
import { IAlbumAsset } from "../../context/AlbumContext";
import { v4 as uuidv4 } from "uuid";

const MGAssetListScreen: React.FC = ({}) => {
  const navigation = useNavigation<MGAssetListScreenNavigationProps>();
  const route = useRoute<MediaAlbumDetailScreenRouteProps>();

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);

  const [totalAlbumCount, setTotalAlbumCount] = useState(0);
  const [startReached, setStartReached] = useState(true);
  const [endReached, setEndReached] = useState(false);

  const [allFetchedAssets, setAllFetchedAssets] = useState<IAlbumAsset[]>([]);
  const [visibleAssets, setVisibleAssets] = useState<IAlbumAsset[]>([]);

  const importAssetsContext = useImportAssetsContext();

  const getAssets = async (lastItemId?: string) => {
    setLoading(true);
    const items = await MediaLibrary.getAssetsAsync({
      album: route.params.albumId,
      first: IMPORT_ASSETS_PAGE_SIZE,
      after: lastItemId,
      mediaType: ["photo", "video"],
    });

    const allAssets = allFetchedAssets;
    for (const asset of items.assets) {
      const { localUri, id, duration, mediaType, creationTime, height, width } =
        await MediaLibrary.getAssetInfoAsync(asset);
      if (localUri) {
        allAssets.push({
          id: uuidv4(),
          deviceGalleryId: id,
          localUri,
          addedAt: Date.now(),
          createdAt: creationTime,
          type: mediaType === "photo" ? "photo" : "video",
          duration: duration || undefined,
          height: height || undefined,
          width: width || undefined,
        });
      }
    }

    if (items.totalCount <= IMPORT_ASSETS_PAGE_SIZE) {
      setEndReached(true);
    }

    setAllFetchedAssets(allAssets);
    setTotalAlbumCount(items.totalCount);
    setLoading(false);

    return allAssets;
  };

  useEffect(() => {
    let startAtItem = currentPage * IMPORT_ASSETS_PAGE_SIZE;
    let endAtItem =
      currentPage * IMPORT_ASSETS_PAGE_SIZE + IMPORT_ASSETS_PAGE_SIZE;
    getAssets().then(() => {
      setVisibleAssets(allFetchedAssets.slice(startAtItem, endAtItem));
    });
    navigation.setOptions({ headerTitle: route.params.albumName });
  }, []);

  const nextPage = async () => {
    let startAtItem = currentPage * IMPORT_ASSETS_PAGE_SIZE;
    let endAtItem =
      currentPage * IMPORT_ASSETS_PAGE_SIZE + IMPORT_ASSETS_PAGE_SIZE;

    if (loading && totalAlbumCount <= endAtItem) return;

    if (startReached) setStartReached(false);

    if (allFetchedAssets.length <= endAtItem) {
      const oldAssetsPlusNewAssets = await getAssets(
        allFetchedAssets.at(-1)?.id
      );
      startAtItem += IMPORT_ASSETS_PAGE_SIZE;
      endAtItem += IMPORT_ASSETS_PAGE_SIZE;
      setVisibleAssets(oldAssetsPlusNewAssets.slice(startAtItem, endAtItem));
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(currentPage + 1);
      startAtItem += IMPORT_ASSETS_PAGE_SIZE;
      endAtItem += IMPORT_ASSETS_PAGE_SIZE;
      setVisibleAssets(allFetchedAssets.slice(startAtItem, endAtItem));
    }

    if (totalAlbumCount <= endAtItem) {
      setEndReached(true);
      setVisibleAssets(allFetchedAssets.slice(startAtItem, totalAlbumCount));
    }
  };
  const previousPage = async () => {
    if (loading) return;

    if (endReached) setEndReached(false);

    let startAtItem = currentPage * IMPORT_ASSETS_PAGE_SIZE;
    let endAtItem =
      currentPage * IMPORT_ASSETS_PAGE_SIZE + IMPORT_ASSETS_PAGE_SIZE;

    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      startAtItem -= IMPORT_ASSETS_PAGE_SIZE;
      endAtItem -= IMPORT_ASSETS_PAGE_SIZE;
      setVisibleAssets(allFetchedAssets.slice(startAtItem, endAtItem));
    }
    if (startAtItem === 0) {
      setStartReached(true);
    }
  };

  if (!loading && totalAlbumCount === 0) {
    return (
      <View
        style={[
          styles.root,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={[styles.text, { fontSize: 22 }]}>
          Dieses Album ist leer
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          numColumns={3}
          data={visibleAssets}
          renderItem={({ item }) => (
            <ImagePreview
              uri={item.localUri}
              onPress={() => importAssetsContext?.toggleAsset(item)}
              isSelected={importAssetsContext!.assetsToImport.some(
                (asset) => asset.id === item.id
              )}
            />
          )}
        />
      )}
      {totalAlbumCount > IMPORT_ASSETS_PAGE_SIZE && (
        <View style={styles.pagination}>
          {!startReached ? (
            <Pressable hitSlop={8} onPress={previousPage}>
              <Entypo name="chevron-left" size={36} color="white" />
            </Pressable>
          ) : (
            <Entypo name="chevron-left" size={36} color="black" />
          )}

          {!loading && (
            <Text style={styles.paginationText}>
              {currentPage * IMPORT_ASSETS_PAGE_SIZE + 1} -{" "}
              {endReached
                ? totalAlbumCount
                : currentPage * IMPORT_ASSETS_PAGE_SIZE +
                  IMPORT_ASSETS_PAGE_SIZE}
            </Text>
          )}

          {!endReached ? (
            <Pressable hitSlop={8} onPress={nextPage}>
              <Entypo name="chevron-right" size={36} color="white" />
            </Pressable>
          ) : (
            <Entypo name="chevron-right" size={36} color="black" />
          )}
        </View>
      )}
      <FSFooterMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
  pagination: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "white",
  },
  paginationText: {
    color: "white",
    fontSize: 20,
  },
});

export default MGAssetListScreen;
