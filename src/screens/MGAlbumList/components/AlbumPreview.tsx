import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";
import { MGAlbumListScreenNavigationProps } from "../../../navigation/types";
import { Entypo } from "@expo/vector-icons";
import { getIsImage } from "../../../util/MediaHelper";
import { Video } from "expo-av";
import { useImportAssetsContext } from "../../../context/ImportAssetsContext";
import { EMPTY_ALBUM_PLACEHOLDER_IMAGE } from "../../../constants";

interface AlbumPreviewProps {
  name: string;
  id: string;
}

const AlbumPreview: React.FC<AlbumPreviewProps> = ({ name, id }) => {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<MGAlbumListScreenNavigationProps>();

  const [thumbnailUri, setThumbnailUri] = useState("x");
  const [assetCount, setAssetCount] = useState(0);

  const getThumbnail = async () => {
    setLoading(true);
    const album = await MediaLibrary.getAssetsAsync({
      album: id,
      first: 1,
      mediaType: ["photo", "video"],
    });
    setAssetCount(album.totalCount);
    if (album.assets.length) {
      const thumbnail = await MediaLibrary.getAssetInfoAsync(
        album.assets[0].id
      );
      if (thumbnail.localUri) {
        setThumbnailUri(thumbnail.localUri);
      }
    } else {
      setThumbnailUri(EMPTY_ALBUM_PLACEHOLDER_IMAGE);
    }
    setLoading(false);
  };

  useEffect(() => {
    getThumbnail();
  }, []);

  const thumbnail = getIsImage(thumbnailUri) ? (
    <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
  ) : (
    <Video source={{ uri: thumbnailUri }} style={styles.thumbnail} />
  );

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("MGAssetList", {
          albumId: id,
          albumName: name,
        });
      }}
      style={[styles.album]}
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator style={styles.activityIndicator} />
        ) : (
          thumbnail
        )}
        <View style={styles.albumInfo}>
          <Text style={styles.albumName}>{name}</Text>
          <Text style={styles.albumCount}>{assetCount}</Text>
        </View>
        <Entypo name="chevron-thin-right" size={16} color="gray" />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  activityIndicator: {
    height: 75,
    aspectRatio: 1,
  },
  album: {
    flex: 1,
    backgroundColor: "black",
    borderColor: "gray",
    paddingVertical: 10,
  },
  albumInfo: {
    marginLeft: 10,
    flex: 1,
  },
  albumName: {
    fontSize: 18,
    color: "white",
    marginBottom: 5,
  },
  albumCount: {
    fontSize: 18,
    color: "gray",
  },
  thumbnail: {
    height: 75,
    aspectRatio: 1,
  },
});

export default AlbumPreview;
