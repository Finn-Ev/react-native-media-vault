import {
  StyleSheet,
  View,
  Text,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { createDirectory, readDirectory } from "../util/MediaHelper";
import AlbumPreview from "../components/AlbumPreview";
import AddMediaButton from "../components/AddMediaButton";

interface AlbumListScreenProps {}

const AlbumListScreen: React.FC<AlbumListScreenProps> = ({}) => {
  const [directories, setDirectories] = useState<string[]>([""]);

  const createAlbum = async (name: string) => {
    const result = await createDirectory("media/" + name);
    if (result) {
      Alert.alert("Das Album wurde erstellt");
      // TODO navigation.navigate("Album", {name})
      await readAlbums();
    }
  };

  const readAlbums = async () => {
    const directories = await readDirectory("media");
    if (directories) setDirectories(directories.sort());
  };

  useEffect(() => {
    // TODO check if app has been initialized before
    createDirectory("media").then(() =>
      createDirectory("media/Album1").then(() => readAlbums())
    );
  });

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={directories}
        renderItem={({ item }) => <AlbumPreview key={item} name={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        style={{ marginLeft: -2, marginRight: -2 }}
      />

      <AddMediaButton
        onPress={() => Alert.prompt("Neues Album erstellen", "", createAlbum)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "black",
    flex: 1,
  },
  text: {
    color: "white",
  },
});

export default AlbumListScreen;
