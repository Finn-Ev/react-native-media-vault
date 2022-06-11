import {
  Alert,
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
} from "../../navigation/types";
import { useEffect, useState } from "react";
import {
  deleteAssetFromFS,
  exportAssetsIntoMediaLibrary,
  getFSAssetInfo,
  getAlbumAssetsFromFS,
} from "../../util/MediaHelper";
import ImagePreview from "../../components/ImagePreview";
import * as Haptics from "expo-haptics";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAlbumContext } from "../../context/AlbumContext";
import { useImportAssetsContext } from "../../context/ImportAssetsContext";

interface AlbumDetailProps {}

const AlbumDetail: React.FC<AlbumDetailProps> = ({}) => {
  const route = useRoute<AlbumDetailScreenRouteProps>();

  const albumContext = useAlbumContext();
  const metaAlbumInfo = albumContext?.getMetaAlbum(route.params.albumName);
  if (!metaAlbumInfo) throw new Error("AlbumMetaInfo not found");

  const importAssetsContext = useImportAssetsContext();

  const navigation = useNavigation<AlbumDetailScreenNavigationProps>();

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSelectModeActive, setIsSelectModeActive] = useState(false);

  const [assets, setAssets] = useState<string[]>([]);

  useEffect(() => {
    navigation.setOptions({ headerTitle: route.params.albumName });

    fetchAssets();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAssets();
    });

    return unsubscribe;
  }, [navigation]);

  // change headerRight when selectMode is active or images have changed
  useEffect(() => {
    if (assets.length === 0) {
      navigation.setOptions({
        headerRight: () => null,
      });
      return;
    }

    if (isSelectModeActive) {
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerRight}>
            <Pressable onPress={selectAllAssets} hitSlop={10}>
              <Text style={[styles.headerRightButton, { marginLeft: 5 }]}>
                Alle auswählen
              </Text>
            </Pressable>
            <Pressable onPress={disableSelectMode} hitSlop={10}>
              <Text style={styles.headerRightButton}>Abbrechen</Text>
            </Pressable>
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={() => enableSelectMode()} hitSlop={20}>
            <Text style={styles.headerRightButton}>Auswählen</Text>
          </Pressable>
        ),
        // headerRight: () => null,
      });
    }
  }, [isSelectModeActive, assets]);

  const viewInAssetCarousel = (startIndex: number) => {
    navigation.navigate("AssetsDetail", {
      assetUris: assets,
      startIndex,
    });
  };

  const toggleSortDirection = () => {
    // setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    albumContext?.toggleAlbumSortDirection(metaAlbumInfo.name);

    fetchAssets();
  };

  const toggleSelect = (uri: string) => {
    if (selectedAssets.includes(uri)) {
      setSelectedAssets(selectedAssets.filter((a) => a !== uri));
    } else {
      setSelectedAssets([...selectedAssets, uri]);
    }
  };

  const selectAllAssets = () => {
    setSelectedAssets(assets);
  };

  const enableSelectMode = (firstItemUri?: string) => {
    setIsSelectModeActive(true);
    if (firstItemUri) setSelectedAssets([firstItemUri]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const disableSelectMode = () => {
    setSelectedAssets([]);
    setIsSelectModeActive(false);
    fetchAssets();
  };

  useEffect(() => {
    fetchAssets();
  }, [metaAlbumInfo.selectedSortDirection]);

  const fetchAssets = async () => {
    const fileNames = await getAlbumAssetsFromFS(route.params.albumName);

    if (fileNames && fileNames.length) {
      const metaInfoImages = [];

      for (const fileName of fileNames) {
        const info = await getFSAssetInfo(route.params.albumName, fileName);
        if (info) metaInfoImages.push(info);
      }

      if (metaInfoImages.length) {
        if (metaAlbumInfo.selectedSortDirection === "desc") {
          metaInfoImages.sort((a, b) => {
            if (a && b) {
              if (a.modificationTime! <= b.modificationTime!) return 1;
              else return -1;
            }
            return 0;
          });
        } else {
          metaInfoImages.sort((a, b) => {
            if (a && b) {
              if (a.modificationTime! > b.modificationTime!) return 1;
              else return -1;
            }
            return 0;
          });
        }

        const imageUris = metaInfoImages.map((info) => info.uri);

        setAssets(imageUris);
      }
    } else setAssets([]);
  };

  const importAssets = async () => {
    importAssetsContext?.setSelectedAlbum(metaAlbumInfo.name);
    // @ts-ignore
    navigation.navigate("ImportAssets");
  };

  const exportSelectedAssets = async () => {
    if (loading || !selectedAssets.length) return;

    setLoading(true);

    await exportAssetsIntoMediaLibrary(selectedAssets);
    Alert.alert(
      "Export erfolgreich",
      "Sollen die Kopien der exportierten Dateien gelöscht werden?",
      [
        {
          text: "Abbrechen",
          style: "cancel",
          onPress: () => setLoading(false),
        },
        {
          text: "Löschen",
          onPress: async () => {
            for (const uri of selectedAssets) {
              await deleteAssetFromFS(uri);
            }
            disableSelectMode();
            await fetchAssets();
            setLoading(false);
          },
        },
      ]
    );
  };

  const deleteSelectedAssets = async () => {
    if (loading || !selectedAssets.length) return;
    Alert.alert(
      "Löschen",
      "Sollen die ausgewählten Dateien wirklich gelöscht werden?",
      [
        {
          text: "Abbrechen",
          style: "cancel",
          onPress: () => setLoading(false),
        },
        {
          text: "Löschen",
          onPress: async () => {
            for (const uri of selectedAssets) {
              await deleteAssetFromFS(uri);
            }
            await fetchAssets();
            disableSelectMode();
            setLoading(false);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      {assets.length > 0 ? (
        <>
          <FlatList
            numColumns={3}
            data={assets}
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
          <View style={styles.footer}>
            {isSelectModeActive ? (
              <>
                <Pressable onPress={exportSelectedAssets} hitSlop={15}>
                  <View style={styles.buttonContainer}>
                    <Feather name="share" size={24} color="white" />
                    <Text style={styles.buttonText}>Exportieren</Text>
                  </View>
                </Pressable>
                <Text style={{ color: "white", fontSize: 16 }}>
                  {selectedAssets.length} ausgewählt
                </Text>
                <Pressable onPress={deleteSelectedAssets} hitSlop={15}>
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
                        metaAlbumInfo.selectedSortDirection === "asc"
                          ? "sort-clock-descending-outline"
                          : "sort-clock-ascending-outline"
                      }
                      size={28}
                      color="white"
                    />
                    <Text style={styles.buttonText}>
                      {metaAlbumInfo.selectedSortDirection === "asc"
                        ? "Älteste zuerst"
                        : "Neueste zuerst"}
                    </Text>
                  </View>
                </Pressable>
                <Pressable onPress={importAssets} hitSlop={15}>
                  <View style={styles.buttonContainer}>
                    {/*<AntDesign name="addfile" size={28} color="white" />*/}
                    <Text style={styles.buttonText}>
                      Bilder/Videos hinzufügen
                    </Text>
                  </View>
                </Pressable>
              </>
            )}
          </View>
        </>
      ) : (
        <View style={styles.emptyAlbum}>
          <Text style={styles.emptyAlbumText}>Dieses Album ist leer</Text>
          <Text />
          <Text style={styles.emptyAlbumButton} onPress={importAssets}>
            Bilder & Videos hinzufügen
          </Text>
        </View>
      )}
      {/* Footer */}
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
    fontSize: 15,
  },
  emptyAlbum: {
    marginTop: 30,
    alignItems: "center",
  },
  emptyAlbumText: {
    marginTop: 15,
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  emptyAlbumButton: {
    marginTop: 10,
    color: "white",
    textAlign: "center",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default AlbumDetail;
