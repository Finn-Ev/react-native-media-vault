import { Image, Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AlbumListScreenNavigationProps } from "../navigation/types";
import {
  getAssetsByAlbumName,
  getAssetUriByAlbumAndFileName,
  getIsImage,
} from "../util/MediaHelper";
import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";

interface ImagePreviewProps {
  albumName: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ albumName }) => {
  const navigation = useNavigation<AlbumListScreenNavigationProps>();

  const [thumbnailUri, setThumbnailUri] = useState<string>("");

  const onPress = () => {
    navigation.navigate("AlbumDetail", { albumName });
  };

  const getAlbumThumbnail = async () => {
    const assets = await getAssetsByAlbumName(albumName);
    if (assets && assets.length) {
      const uri = getAssetUriByAlbumAndFileName(albumName, assets[0]);

      if (uri) {
        setThumbnailUri(uri);
      }
    } else {
      setThumbnailUri("");
    }
  };

  useEffect(() => {
    getAlbumThumbnail();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAlbumThumbnail();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {!thumbnailUri || getIsImage(thumbnailUri) ? (
        <Image
          style={styles.preview}
          resizeMode={"cover"}
          source={{
            uri:
              thumbnailUri ||
              "https://www.worldartfoundations.com/wp-content/uploads/2022/04/placeholder-image.png",
          }}
        />
      ) : (
        <Video
          style={styles.preview}
          resizeMode={ResizeMode.COVER}
          source={{
            uri:
              thumbnailUri ||
              "https://www.worldartfoundations.com/wp-content/uploads/2022/04/placeholder-image.png",
          }}
        />
      )}
      <Text style={styles.text}>{albumName}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: "50%",
    aspectRatio: 1,
    padding: 2,
  },
  preview: {
    aspectRatio: 1,
    backgroundColor: "grey",
  },
  text: {
    color: "white",
    position: "absolute",
    bottom: 5,
    left: 5,
    padding: 3,
    textShadowColor: "black",
    textShadowOffset: { width: -2, height: 1 },
    textShadowRadius: 10,
  },
});

export default ImagePreview;
