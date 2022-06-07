import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AlbumListScreenNavigationProps } from "../navigation/types";
import { getFullDirectoryPath, getIsImage } from "../util/MediaHelper";
import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";
import { getVideoDurationString } from "../util";

interface ImagePreviewProps {
  uri: string;
  onPress: () => void;
  onLongPress: () => void;
  isSelected: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  uri,
  onPress,
  onLongPress,
  isSelected,
}) => {
  const navigation = useNavigation<AlbumListScreenNavigationProps>();
  getFullDirectoryPath("");
  const [videoDuration, setVideoDuration] = useState(0);

  const isImage = getIsImage(uri);

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {isSelected && (
        <View style={styles.selectOverlay}>
          <FontAwesome5 name="check-circle" size={30} color="lightgrey" />
        </View>
      )}
      {isImage ? (
        <Image
          style={styles.preview}
          resizeMode={ResizeMode.COVER}
          source={{
            uri,
          }}
        />
      ) : (
        <View>
          <Video
            style={styles.preview}
            source={{ uri }}
            resizeMode={ResizeMode.COVER}
            // @ts-ignore
            onLoad={(data) => setVideoDuration(data.durationMillis)}
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
  selectOverlay: {
    height: "100%",
    width: "100%",
    zIndex: 1,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    top: 2, // padding of container
    left: 2, // padding of container
    justifyContent: "center",
    alignItems: "center",
  },
  selectOverlayIcon: {},
});

export default ImagePreview;
