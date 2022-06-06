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

  const [images, setImages] = useState<FileInfo[]>([]);
  const { albumName } = route.params;

  useEffect(() => {
    navigation.setOptions({ headerTitle: albumName });
    getMediaFiles();
  }, []);

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
        setImages(metaInfoImages);
      }
    }
  };

  const importMedia = async () => {
    const mediaFileToImport = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsMultipleSelection: true,
      allowsEditing: false,
    });

    if (mediaFileToImport.cancelled) return;

    if (mediaFileToImport) {
      await importMediaFileIntoAlbum(mediaFileToImport.uri, albumName);
      await getMediaFiles();
    }
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
        renderItem={({ item }) => <ImagePreview uri={item.uri} />}
      />
      {/* Footer */}
      <View style={styles.footer}>
        <Pressable onPress={toggleSortDirection} hitSlop={15}>
          <View style={styles.sortContainer}>
            <MaterialCommunityIcons
              name={
                sortDirection === "asc"
                  ? "sort-clock-ascending-outline"
                  : "sort-clock-descending-outline"
              }
              size={28}
              color="white"
            />
            <Text style={styles.sortText}>
              {sortDirection === "asc" ? "Älteste zuerst" : "Neueste zuerst"}
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={importMedia} hitSlop={15}>
          <AntDesign name="addfile" size={28} color="white" />
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
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    marginLeft: 10,
    color: "white",
  },
});

export default AlbumDetail;
