import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AlbumListScreenNavigationProps } from "../navigation/types";
import { getImageUriByAlbumAndFileName } from "../util/MediaHelper";

interface ImagePreviewProps {
  imgName: string;
  albumName: string;
  isAlbumPreview?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imgName,
  albumName,
  isAlbumPreview = false,
}) => {
  const navigation = useNavigation<AlbumListScreenNavigationProps>();

  const onPress = () => {
    if (isAlbumPreview) navigation.navigate("AlbumDetail", { albumName });
  };

  // const imageUri = getImageUriByAlbumAndFileName(albumName, imgName);

  return (
    <Pressable
      style={[
        styles.container,
        { maxWidth: isAlbumPreview ? "50%" : "33.33%" },
      ]}
      onPress={onPress}
    >
      <Image
        style={styles.image}
        resizeMode={"contain"}
        source={{
          uri: imageUri,
        }}
      />
      {isAlbumPreview && <Text style={styles.text}>{albumName}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    aspectRatio: 1,
    padding: 2,
  },
  image: {
    aspectRatio: 1,
  },
  text: {
    color: "white",
    position: "absolute",
    bottom: 5,
    left: 5,
  },
});

export default ImagePreview;
