import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AlbumListScreenNavigationProps } from "../navigation/types";
import { getImageUriByAlbumAndFileName, getIsImage } from "../util/MediaHelper";
import { useEffect, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { getVideoDurationString } from "../util";

interface ImagePreviewProps {
  imgName: string;
  albumName: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imgName, albumName }) => {
  const navigation = useNavigation<AlbumListScreenNavigationProps>();

  const [mediaUri, setMediaUri] = useState<string>("");
  const [videoDuration, setVideoDuration] = useState(0);

  const onPress = () => {
    // TODO open image carousel at this image's index
  };

  useEffect(() => {
    const uri = getImageUriByAlbumAndFileName(albumName, imgName);
    if (uri) setMediaUri(uri);
  }, []);

  if (!mediaUri) return null;

  const isImage = getIsImage(mediaUri);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      {isImage ? (
        <Image
          style={styles.preview}
          resizeMode={"cover"}
          source={{
            uri: mediaUri,
          }}
        />
      ) : (
        <View>
          <Video
            style={styles.preview}
            source={{ uri: mediaUri }}
            resizeMode={ResizeMode.COVER}
            // @ts-ignore

            onLoad={(data) => setVideoDuration(data.durationMillis)}
            // shouldPlay={true}
          />
          <Text style={styles.duration}>
            {getVideoDurationString(videoDuration)}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: "33.33%",
    aspectRatio: 1,

    padding: 2,
  },
  preview: {
    aspectRatio: 1,
  },
  text: {
    color: "white",
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  duration: {
    color: "white",
    position: "absolute",
    right: 5,
    bottom: 5,
    textShadowColor: "black",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default ImagePreview;
