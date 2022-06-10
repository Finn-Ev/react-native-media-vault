import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AlbumListScreenNavigationProps } from "../navigation/types";
import {
  getAlbumAssetsFromFS,
  getAssetUriFromFSByAlbumAndFileName,
  getFSAssetInfo,
  getIsImage,
} from "../util/MediaHelper";
import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { useAlbumContext } from "../context/AlbumContext";

interface ImagePreviewProps {
  albumName: string;
  onLongPress: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  albumName,
  onLongPress,
}) => {
  const navigation = useNavigation<AlbumListScreenNavigationProps>();

  const albumContext = useAlbumContext();
  if (!albumContext) throw new Error("MetaAlbumContext not found");
  const albumMetaInfo = albumContext.getMetaAlbum(albumName);
  if (!albumMetaInfo) throw new Error("AlbumMetaInfo not found");

  const [thumbnailUri, setThumbnailUri] = useState("");

  const onPress = () => {
    navigation.navigate("AlbumDetail", { albumName });
  };

  const getAlbumThumbnail = async () => {
    const metaInfoImages = [];

    let assets = await getAlbumAssetsFromFS(albumName);
    if (!assets) return;

    for (const asset of assets) {
      const info = await getFSAssetInfo(albumName, asset);
      if (info) metaInfoImages.push(info);
    }

    if (metaInfoImages.length) {
      metaInfoImages.sort((a, b) => {
        if (a && b) {
          if (a.modificationTime! < b.modificationTime!) return 1;
          else return -1;
        }
        return 0;
      });

      assets = metaInfoImages.map((info) => info.uri);

      if (assets && assets.length) {
        if (albumMetaInfo.selectedSortDirection === "desc") {
          const uri = assets.pop();
          if (uri) {
            console.log("uri", uri);
            setThumbnailUri(uri);
          }
        } else {
          const uri = assets[0];
          if (uri) {
            console.log("uri", uri);
            setThumbnailUri(uri);
          }
        }
      }
    }
  };

  useEffect(() => {
    getAlbumThumbnail();
  }, [albumMetaInfo.selectedSortDirection]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAlbumThumbnail();
    });
    return unsubscribe;
  }, [navigation, albumMetaInfo.selectedSortDirection]);

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
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
