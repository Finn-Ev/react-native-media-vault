import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AlbumListScreenNavigationProps } from "../navigation/types";

interface AlbumPreviewProps {
  name: string;
}

const AlbumPreview: React.FC<AlbumPreviewProps> = ({ name }) => {
  const navigation = useNavigation<AlbumListScreenNavigationProps>();
  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("AlbumDetail", { albumName: name })}
    >
      <Image
        style={styles.image}
        resizeMode={"contain"}
        source={{
          uri: "https://picsum.photos/200",
        }}
      />
      <Text style={styles.text}>{name}</Text>
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

export default AlbumPreview;
