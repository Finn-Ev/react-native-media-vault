import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { createDirectory, readDirectory } from "../util/MediaHelper";
import AlbumPreview from "../components/AlbumPreview";
import CreateAlbumDialog from "../components/CreateAlbumDialog";
import createAlbumDialog from "../components/CreateAlbumDialog";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

interface AlbumListScreenProps {}

const AlbumListScreen: React.FC<AlbumListScreenProps> = ({}) => {
  const [directories, setDirectories] = useState<string[]>([""]);
  const [showDialog, setShowDialog] = useState(false);

  const createAlbum = async (name: string) => {
    const result = await createDirectory("media/" + name);
    if (result) {
      Alert.alert("Das Album wurde erstellt");
      setShowDialog(false);
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
  }, []);

  const changeSortDirection = () => {
    // TODO
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={directories}
        renderItem={({ item }) => <AlbumPreview key={item} albumName={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        style={{ marginLeft: -2, marginRight: -2 }}
      />

      <CreateAlbumDialog
        visible={showDialog}
        createAlbum={createAlbum}
        onCancel={() => setShowDialog(false)}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable onPress={changeSortDirection}>
          <MaterialCommunityIcons name="sort-variant" size={30} color="white" />
        </Pressable>
        <Pressable
          onPress={() => {
            // Platform.OS === "ios" ?
            Alert.prompt("Neues Album erstellen", "", createAlbum);
            // : setShowDialog((v) => !v);
          }}
        >
          <AntDesign name="addfolder" size={28} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "black",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
});

export default AlbumListScreen;
