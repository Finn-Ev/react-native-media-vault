import { Image, Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FSAlbumListScreenNavigationProps } from "../../../navigation/types";

import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { useAlbumContext } from "../../../context/AlbumContext";
import { EMPTY_ALBUM_PLACEHOLDER_IMAGE } from "../../../constants";
import { getIsImage } from "../../../util/MediaHelper";

interface ImagePreviewProps {
  albumName: string;
  onLongPress: () => void;
}

const AlbumPreview: React.FC<ImagePreviewProps> = ({
  albumName,
  onLongPress,
}) => {
  const navigation = useNavigation<FSAlbumListScreenNavigationProps>();

  const albumContext = useAlbumContext();
  if (!albumContext) throw new Error("MetaAlbumContext not found");
  const albumMetaInfo = albumContext.getMetaAlbum(albumName);
  if (!albumMetaInfo) throw new Error("AlbumMetaInfo not found");

  const [thumbnail, setThumbnail] = useState("");

  const onPress = () => {
    navigation.navigate("FSAssetList", { albumName });
  };

  const getAlbumThumbnail = () => {
    let assets = albumContext.getAssetsByAlbum(albumName);
    setThumbnail(assets[0].localUri);
  };

  useEffect(() => {
    getAlbumThumbnail();
  }, [albumMetaInfo.selectedSortDirection, albumContext.metaAlbums]);

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {getIsImage(thumbnail) ? (
        <Image
          source={{ uri: thumbnail }}
          resizeMode={"cover"}
          style={styles.thumbnail}
        />
      ) : (
        <Video
          source={{ uri: thumbnail }}
          resizeMode={ResizeMode.COVER}
          style={styles.thumbnail}
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
  activityIndicator: {
    // height: 75,
    // aspectRatio: 1,
  },
  thumbnail: {
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

export default AlbumPreview;
