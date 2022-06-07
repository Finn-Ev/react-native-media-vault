import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  AlbumDetailScreenNavigationProps,
  AlbumDetailScreenRouteProps,
} from "../navigation/types";
import { useEffect, useState } from "react";
import { getImageInfo, readDirectory } from "../util/MediaHelper";
import ImagePreview from "../components/ImagePreview";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";

interface AlbumDetailProps {}

const AlbumDetail: React.FC<AlbumDetailProps> = ({}) => {
  const route = useRoute<AlbumDetailScreenRouteProps>();
  const { albumName } = route.params;
  const navigation = useNavigation<AlbumDetailScreenNavigationProps>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSelectModeActive, setIsSelectModeActive] = useState(false);

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    navigation.setOptions({ headerTitle: albumName });

    getMediaFiles();
  }, []);

  useEffect(() => {
    getMediaFiles();
  }, [route.params.assetsHaveBeenImported]);

  useEffect(() => {
    if (isSelectModeActive) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerRight}>
            <Text
              onPress={selectAllAssets}
              style={[styles.headerRightButton, { marginLeft: 5 }]}
            >
              Alle auswählen
            </Text>
            <Text onPress={disableSelectMode} style={styles.headerRightButton}>
              Abbrechen
            </Text>
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <Text
            onPress={() => enableSelectMode()}
            style={styles.headerRightButton}
          >
            Auswählen
          </Text>
        ),
      });
    }
  }, [isSelectModeActive]);

  const viewInAssetCarousel = (startIndex: number) => {
    navigation.navigate("AssetsDetail", {
      assetUris: images,
      startIndex,
    });
  };

  const toggleSortDirection = () => {
    setImages(images.reverse());
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const toggleSelect = (uri: string) => {
    if (selectedAssets.includes(uri)) {
      setSelectedAssets(selectedAssets.filter((a) => a !== uri));
    } else {
      setSelectedAssets([...selectedAssets, uri]);
    }
  };

  const selectAllAssets = () => {
    setSelectedAssets(images);
  };

  const enableSelectMode = (firstItemUri?: string) => {
    setIsSelectModeActive(true);
    if (firstItemUri) setSelectedAssets([firstItemUri]);
  };

  const disableSelectMode = () => {
    setSelectedAssets([]);
    setIsSelectModeActive(false);
  };

  const getMediaFiles = async () => {
    const fileNames = await readDirectory("media/" + albumName);

    if (fileNames && fileNames.length) {
      const metaInfoImages = [];

      for (const fileName of fileNames) {
        const info = await getImageInfo(albumName, fileName);
        if (info) metaInfoImages.push(info);
      }

      if (metaInfoImages) {
        // default is ascending; the oldest file first
        metaInfoImages.sort((a, b) => {
          if (a && b) {
            if (a.modificationTime! <= b.modificationTime!) return -1;
            else return 1;
          }
          return 0;
        });

        const imageUris = metaInfoImages.map((info) => info.uri);

        setImages(imageUris);
      }
    }
  };

  const importAssets = async () => {
    navigation.navigate("AssetSelector", { albumName });
    navigation.setParams({ assetsHaveBeenImported: false }); // in case someone imports something back to back
  };

  const exportAssets = async () => {
    // todo loop over assets and add them to (default) album via MediaLibrary
  };

  const deleteAssets = async () => {
    // todo loop over assets and remove them from this album
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        numColumns={3}
        data={images}
        renderItem={({ item, index }) => {
          return (
            <ImagePreview
              onLongPress={() => enableSelectMode(item)}
              onPress={
                isSelectModeActive
                  ? () => toggleSelect(item)
                  : () => viewInAssetCarousel(index)
              }
              isSelected={selectedAssets.includes(item)}
              uri={item}
            />
          );
        }}
      />
      {/* Footer */}
      <View style={styles.footer}>
        {isSelectModeActive ? (
          <>
            <Pressable onPress={exportAssets} hitSlop={15}>
              <View style={styles.buttonContainer}>
                <Feather name="share" size={24} color="white" />
                <Text style={styles.buttonText}>Exportieren</Text>
              </View>
            </Pressable>
            <Text style={{ color: "white", fontSize: 16 }}>
              {selectedAssets.length} ausgewählt
            </Text>
            <Pressable onPress={deleteAssets} hitSlop={15}>
              <View style={styles.buttonContainer}>
                <Ionicons name="trash" size={24} color="white" />
              </View>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={toggleSortDirection} hitSlop={15}>
              <View style={styles.buttonContainer}>
                <MaterialCommunityIcons
                  name={
                    sortDirection === "asc"
                      ? "sort-clock-ascending-outline"
                      : "sort-clock-descending-outline"
                  }
                  size={28}
                  color="white"
                />
                <Text style={styles.buttonText}>
                  {sortDirection === "asc"
                    ? "Älteste zuerst"
                    : "Neueste zuerst"}
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={importAssets} hitSlop={15}>
              <View style={styles.buttonContainer}>
                {/*<AntDesign name="addfile" size={28} color="white" />*/}
                <Text style={styles.buttonText}>Bilder/Videos hinzufügen</Text>
              </View>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
  headerRight: {
    flexDirection: "row",
  },
  headerRightButton: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 5,
    color: "white",
  },
});

export default AlbumDetail;
