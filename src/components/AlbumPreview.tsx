import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AlbumListScreenNavigationProps } from "../navigation/types";
import { getImageUriByAlbumAndFileName } from "../util/MediaHelper";

interface ImagePreviewProps {
  albumName: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ albumName }) => {
  const navigation = useNavigation<AlbumListScreenNavigationProps>();

  const onPress = () => {
    navigation.navigate("AlbumDetail", { albumName });
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image
        style={styles.preview}
        resizeMode={"cover"}
        source={{
          uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAD1BMVEX+/v7////Z2dnc3Ny6urpCvU+4AAABU0lEQVR4nO3QQQHEIBAAMWDxr/nu2XYsJBKy7hye5q7ZvM06e/G0j5MvJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSflpJyUk3JSTspJOSkn5aSclJNyUk7KSTkpJ+WknJSTclJOykk5KSf1P5nN26w7h6e5P2aaCrlKyIulAAAAAElFTkSuQmCC",
        }}
      />
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
