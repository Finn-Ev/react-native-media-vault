import { StyleSheet, View, Text, FlatList, SafeAreaView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  AlbumDetailScreenNavigationProps,
  AlbumDetailScreenRouteProps,
} from "../navigation/types";
import { useEffect, useState } from "react";
import { readDirectory } from "../util/MediaHelper";
import ImagePreview from "../components/ImagePreview";

interface AlbumDetailProps {}

const AlbumDetail: React.FC<AlbumDetailProps> = ({}) => {
  const route = useRoute<AlbumDetailScreenRouteProps>();
  const navigation = useNavigation<AlbumDetailScreenNavigationProps>();

  // TODO filter by images or videos

  const [images, setImages] = useState<string[]>([]);

  const { albumName } = route.params;

  useEffect(() => {
    navigation.setOptions({ headerTitle: albumName });
    getImagesByAlbumName();
  });

  const getImagesByAlbumName = async () => {
    const images = await readDirectory("media/" + albumName);

    if (images && images.length) {
      setImages(images);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        numColumns={3}
        data={images}
        renderItem={({ item }) => (
          <ImagePreview albumName={albumName} imgName={item} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default AlbumDetail;
