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
import {
  getImageInfo,
  importMediaFileIntoAlbum,
  readDirectory,
} from "../util/MediaHelper";
import { FileInfo } from "expo-file-system";
import ImagePreview from "../components/ImagePreview";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

interface AlbumDetailProps {}

const AlbumDetail: React.FC<AlbumDetailProps> = ({}) => {
  const route = useRoute<AlbumDetailScreenRouteProps>();
  const navigation = useNavigation<AlbumDetailScreenNavigationProps>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [images, setImages] = useState<string[]>([]);
  const { albumName } = route.params;

  useEffect(() => {
    navigation.setOptions({ headerTitle: albumName });
    getMediaFiles();
  }, []);

  useEffect(() => {
    getMediaFiles();
  }, [route.params.assetsHaveBeenImported]);

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

  const viewInAssetCarousel = (startIndex: number) => {
    // console.log("assetUris", assetUris.length);
    // console.log("startIndex", startIndex);

    navigation.navigate("AssetsDetail", {
      assetUris: images,
      startIndex,
    });
  };

  const importMedia = async () => {
    navigation.navigate("AssetSelector", { albumName });
    navigation.setParams({ assetsHaveBeenImported: false }); // in case someone imports something back to back

    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   allowsEditing: false,
    //   quality: 1,
    // });
    //
    // if (!result.cancelled) {
    //   await importMediaFileIntoAlbum(result.uri, albumName);
    // }
    // await getMediaFiles();
  };

  const toggleSortDirection = () => {
    setImages(images.reverse()); // works better than re-running sort()
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        numColumns={3}
        data={images}
        renderItem={({ item, index }) => {
          return (
            <ImagePreview
              onPress={() => viewInAssetCarousel(index)}
              uri={item}
            />
          );
        }}
      />
      {/* Footer */}
      <View style={styles.footer}>
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
              {sortDirection === "asc" ? "Älteste zuerst" : "Neueste zuerst"}
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={importMedia} hitSlop={15}>
          <View style={styles.buttonContainer}>
            {/*<AntDesign name="addfile" size={28} color="white" />*/}
            <Text style={styles.buttonText}>Bilder/Videos hinzufügen</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
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
