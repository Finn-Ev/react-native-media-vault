import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import {
  FSAssetCarouselScreenNavigationProps,
  FSAssetCarouselScreenRouteProps,
} from "../../navigation/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  deleteAssetsFromFS,
  exportAssetsIntoMediaLibrary,
  getIsImage,
} from "../../util/MediaHelper";
import { Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageZoomView from "./components/ImageZoomView";
import { AntDesign, Entypo, Feather, Ionicons } from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-detect";
import * as Haptics from "expo-haptics";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { IAlbumAsset, useAlbumContext } from "../../context/AlbumContext";

const FSAssetCarouselScreen: React.FC = ({}) => {
  const { width } = useWindowDimensions();
  const route = useRoute<FSAssetCarouselScreenRouteProps>();
  const navigation = useNavigation<FSAssetCarouselScreenNavigationProps>();

  const albumContext = useAlbumContext();

  const [assets, setAssets] = useState<IAlbumAsset[]>([]);

  const [showMenuUI, setShowMenuUI] = useState(true);

  const insets = useSafeAreaInsets();

  const flatList = useRef<FlatList>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(
    route.params.startIndex
  );

  const { showActionSheetWithOptions } = useActionSheet();

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveImageIndex(viewableItems[0].index || 0);
      }
    }
  );

  useEffect(() => {
    updateHeader();
  }, [showMenuUI]);

  useEffect(() => {
    toggleMenuUI();
    const allAssets = albumContext?.getAssetsByIdsFromAlbum(
      route.params.albumName,
      route.params.assetIds
    );

    if (allAssets) {
      setAssets(allAssets);
    }
  }, []);

  const toggleMenuUI = () => {
    setShowMenuUI(true);
    setTimeout(() => {
      setShowMenuUI(false);
    }, 3000);
  };

  const updateHeader = () => {
    if (showMenuUI) {
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={() => navigation.goBack()} hitSlop={30}>
            <AntDesign name="close" size={24} color="white" />
          </Pressable>
        ),
      });
    }
    // hide whole menu-ui after 2s inactivity
    else navigation.setOptions({ headerRight: () => null });
  };

  const deleteAsset = () => {
    const fileType = getIsImage(assets[activeImageIndex].localUri)
      ? "Bild"
      : "Video";
    Alert.alert(
      "Löschen",
      `Soll dieses ${fileType} wirklich gelöscht werden?`,
      [
        {
          text: "Abbrechen",
          style: "cancel",
        },
        {
          text: "Löschen",
          onPress: async () => {
            await albumContext?.removeAssetsFromAlbum(route.params.albumName, [
              assets[activeImageIndex].id,
            ]);

            // remove the asset from the current carousel-view
            setAssets(
              assets.filter((asset) => asset.id !== assets[activeImageIndex].id)
            );
          },
        },
      ]
    );
  };

  const startDiashow = () => {};

  const openActionSheet = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const fileType =
      assets[activeImageIndex].type === "photo" ? "Bild" : "Video";

    const options = [
      `${fileType} in anderes Album verschieben`,
      `${fileType} in anderes Album kopieren`,
      `${fileType} exportieren`,
      "Abbrechen",
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          navigation.navigate("FSMoveAssets", {
            assetIds: [assets[activeImageIndex].id],
            sourceAlbumName: route.params.albumName,
            copy: false,
          });
          // remove the asset from the current carousel-view
          setAssets(
            assets.filter((asset) => asset.id !== assets[activeImageIndex].id)
          );
        }
        if (buttonIndex === 1) {
          navigation.navigate("FSMoveAssets", {
            assetIds: [assets[activeImageIndex].id],
            sourceAlbumName: route.params.albumName,
            copy: true,
          });
          // no need to remove the asset from the current carousel-view as it gets copied
        }
        if (buttonIndex === 2) {
          await exportAssetsIntoMediaLibrary([assets[activeImageIndex]]);
          Alert.alert(
            "Export erfolgreich",
            "Soll die Kopie der exportierten Dateie gelöscht werden?",
            [
              {
                text: "Abbrechen",
                style: "cancel",
              },
              {
                text: "Löschen",
                onPress: async () => {
                  await deleteAssetsFromFS([assets[activeImageIndex]]);
                  setAssets(
                    assets.filter(
                      (asset) => asset.id !== assets[activeImageIndex].id
                    )
                  );
                },
              },
            ]
          );
        }
      }
    );
  };

  return (
    <SafeAreaView
      style={[styles.root, { marginTop: -insets.top }]}
      onTouchEnd={() => toggleMenuUI()}
    >
      <FlatList
        initialScrollIndex={route.params.startIndex}
        horizontal={true}
        data={assets}
        pagingEnabled
        ref={flatList}
        renderItem={({ item, index }) => {
          return (
            <GestureRecognizer
              style={{ flex: 1 }}
              onSwipeDown={(state) => navigation.goBack()}
            >
              {getIsImage(item.localUri) ? (
                <ImageZoomView uri={item.localUri} />
              ) : (
                <Video
                  source={{ uri: item.localUri }}
                  style={{
                    width,
                    height: "100%",
                  }}
                  shouldPlay={activeImageIndex === index}
                  isMuted={false}
                  isLooping
                  useNativeControls={true}
                />
              )}
            </GestureRecognizer>
          );
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 51,
        }}
        getItemLayout={(data, index) => {
          // https://snack.expo.dev/Bk1mkK0zZ
          const { width } = Dimensions.get("window");
          return {
            length: width,
            offset: width * index,
            index,
          };
        }}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />

      {showMenuUI && (
        <View style={styles.menu}>
          <Pressable onPress={deleteAsset} hitSlop={16}>
            <Ionicons name="trash" size={24} color="white" />
          </Pressable>
          <Pressable onPress={startDiashow} hitSlop={16}>
            <Feather name="play" size={24} color="white" />
          </Pressable>
          <Pressable onPress={openActionSheet} hitSlop={16}>
            <Entypo name="dots-three-horizontal" size={24} color="white" />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#000",
    justifyContent: "center",
    flex: 1,
  },
  menu: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    padding: 16,
  },
});

export default FSAssetCarouselScreen;
