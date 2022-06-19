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
  FSAssetListScreenNavigationProps,
  FSAssetListScreenRouteProps,
} from "../../navigation/types";
import { useEffect, useState } from "react";
import {
  deleteAssetsFromFS,
  exportAssetsIntoMediaLibrary,
} from "../../util/MediaHelper";
import ImagePreview from "../../components/ImagePreview";
import * as Haptics from "expo-haptics";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { IAlbumAsset, useAlbumContext } from "../../context/AlbumContext";
import { useImportAssetsContext } from "../../context/ImportAssetsContext";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useActionSheet } from "@expo/react-native-action-sheet";

// Although this component is very huge and rather complex, I decided to not split it up into multiple components
// or to create a context for it as all the state is used by multiple parts of the UI and thus cannot be
// separated appropriately. A context would be a waste as all the additional state is only used in this screen and
// not in any of the other part of the app.
const FSAssetListScreen: React.FC = ({}) => {
  const navigation = useNavigation<FSAssetListScreenNavigationProps>();
  const route = useRoute<FSAssetListScreenRouteProps>();
  const [loading, setLoading] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  const importAssetsContext = useImportAssetsContext();
  const albumContext = useAlbumContext();

  const metaAlbumInfo = albumContext?.getMetaAlbum(route.params.albumName);
  const assets = metaAlbumInfo?.assets!;

  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const [selectedAssets, setSelectedAssets] = useState<IAlbumAsset[]>([]);
  const [isSelectModeActive, setIsSelectModeActive] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerTitle: route.params.albumName });
  }, []);

  // fetch assets initially and when sortDirection or screenFocusState changes
  // to keep the assetList in sync with the state
  // useEffect(() => {
  //   fetchAssets();
  //   return navigation.addListener("focus", () => {
  //     fetchAssets();
  //   });
  // }, [metaAlbumInfo?.selectedSortDirection, navigation]);

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
            <Pressable onPress={() => setSelectedAssets(assets)} hitSlop={10}>
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
      });
    }
  }, [isSelectModeActive, assets]);

  const toggleSelect = (assetToToggle: IAlbumAsset) => {
    if (selectedAssets.some((asset) => asset.id === assetToToggle.id)) {
      setSelectedAssets(
        selectedAssets.filter((a) => a.id !== assetToToggle.id)
      );
    } else {
      setSelectedAssets([...selectedAssets, assetToToggle]);
    }
  };

  const enableSelectMode = (firstItem?: IAlbumAsset) => {
    setIsSelectModeActive(true);
    if (firstItem) setSelectedAssets([firstItem]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const disableSelectMode = () => {
    setSelectedAssets([]);
    setIsSelectModeActive(false);
  };

  const exportSelectedAssets = async () => {
    if (loading || !selectedAssets.length) return;

    setLoading(true);

    await exportAssetsIntoMediaLibrary(selectedAssets);
    disableSelectMode();
    setLoading(false);
    Alert.alert(
      "Export erfolgreich",
      "Sollen die Kopien der exportierten Dateien gelöscht werden?",
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Löschen",
          onPress: async () => {
            await albumContext?.removeAssetsFromAlbum(
              route.params.albumName,
              selectedAssets.map((asset) => asset.id)
            );
            // await deleteAssetsFromFS(selectedAssets);
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
            await albumContext?.removeAssetsFromAlbum(
              route.params.albumName,
              selectedAssets.map((asset) => asset.id)
            );
            // await deleteAssetsFromFS(selectedAssets);
            disableSelectMode();
            setLoading(false);
          },
        },
      ]
    );
  };

  const openAssetPicker = async () => {
    importAssetsContext?.setSelectedAlbum(metaAlbumInfo!.name);
    // @ts-ignore
    navigation.navigate("ImportAssets");
    disableSelectMode();
  };

  const openMoveAssetsScreen = (copy = false) => {
    if (loading || !selectedAssets.length) return;
    navigation.navigate("FSMoveAssets", {
      assetIds: selectedAssets.map((asset) => asset.id),
      sourceAlbumName: route.params.albumName,
      copy,
    });
    disableSelectMode();
  };

  const openActionSheet = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const options = [
      "Dateien in anderes Album verschieben",
      "Dateien in anderes Album kopieren",
      "Ausgewähle Dateien exportieren",
      "Abbrechen",
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          openMoveAssetsScreen(false);
        }
        if (buttonIndex === 1) {
          openMoveAssetsScreen(true);
        }
        if (buttonIndex === 2) {
          exportSelectedAssets();
        }
      }
    );
  };

  if (loading) return <LoadingIndicator />;

  return (
    <SafeAreaView style={styles.root}>
      {assets.length > 0 ? (
        <>
          <FlatList
            numColumns={3}
            data={albumContext?.getAssetsByAlbum(route.params.albumName)}
            renderItem={({ item, index }) => {
              return (
                <ImagePreview
                  onLongPress={() => enableSelectMode(item)}
                  onPress={
                    isSelectModeActive
                      ? () => toggleSelect(item)
                      : () =>
                          navigation.navigate("FSAssetCarousel", {
                            assetIds: assets.map((a) => a.id),
                            startIndex: index,
                            albumName: route.params.albumName,
                          })
                  }
                  isSelected={selectedAssets.includes(item)}
                  uri={item.localUri}
                />
              );
            }}
          />
          <View style={styles.footer}>
            {isSelectModeActive ? (
              <>
                {!!selectedAssets.length && (
                  <Pressable onPress={deleteSelectedAssets} hitSlop={15}>
                    <View style={styles.buttonContainer}>
                      <Ionicons name="trash" size={24} color="white" />
                    </View>
                  </Pressable>
                )}
                <Text style={{ color: "white", fontSize: 16 }}>
                  {selectedAssets.length} ausgewählt
                </Text>

                {!!selectedAssets.length && (
                  <Pressable onPress={openActionSheet} hitSlop={15}>
                    <View style={styles.buttonContainer}>
                      <Entypo
                        name="dots-three-horizontal"
                        size={24}
                        color="white"
                      />
                    </View>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                <Pressable
                  onPress={() =>
                    albumContext?.toggleAlbumSortDirection(metaAlbumInfo!.name)
                  }
                  hitSlop={15}
                >
                  <View style={styles.buttonContainer}>
                    <MaterialCommunityIcons
                      name={
                        metaAlbumInfo?.selectedSortDirection === "asc"
                          ? "sort-clock-descending-outline"
                          : "sort-clock-ascending-outline"
                      }
                      size={28}
                      color="white"
                    />
                    <Text style={styles.buttonText}>
                      {metaAlbumInfo?.selectedSortDirection === "asc"
                        ? "Älteste zuerst"
                        : "Neueste zuerst"}
                    </Text>
                  </View>
                </Pressable>
                <Pressable onPress={openAssetPicker} hitSlop={15}>
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
        !loading && (
          // null
          <View style={styles.emptyAlbum}>
            <Text style={styles.emptyAlbumText}>Dieses Album ist leer</Text>
            <Text />
            <Text style={styles.emptyAlbumButton} onPress={openAssetPicker}>
              Bilder & Videos hinzufügen
            </Text>
          </View>
        )
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
    marginRight: 5,
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

export default FSAssetListScreen;
