import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import {
  createAlbumAsync,
  getAlbumInfo,
  getAllAlbums,
  hasMediaRootBeenCreated,
} from "../util/MediaHelper";
import AlbumPreview from "../components/AlbumPreview";
import CreateAlbumDialog from "../components/CreateAlbumDialog";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AlbumListScreenNavigationProps } from "../navigation/types";

interface AlbumListScreenProps {}

const AlbumListScreen: React.FC<AlbumListScreenProps> = ({}) => {
  const navigation = useNavigation<AlbumListScreenNavigationProps>();

  const [albums, setAlbums] = useState<string[]>([""]);
  const [showDialog, setShowDialog] = useState(false);

  const createAlbum = async (name: string) => {
    const result = await createAlbumAsync(name);
    if (result) {
      Alert.alert("Das Album wurde erstellt");
      setShowDialog(false);
      await fetchAlbums();
    }
  };

  const fetchAlbums = async () => {
    const albums = await getAllAlbums();
    if (albums && albums.length > 0) {
      setAlbums(albums);
    }
    if (albums && albums.length > 0) {
      const metaInfoAlbums = [];

      for (const album of albums) {
        const info = await getAlbumInfo(album);
        if (info) {
          metaInfoAlbums.push(info);
        }
      }

      metaInfoAlbums.sort((a, b) => {
        if (a && b) {
          if (a.uri.toLowerCase() < b.uri.toLowerCase()) return -1;
          // if (a.modificationTime! <= b.modificationTime!) return -1;
          else return 1;
        }
        return 0;
      });

      setAlbums(
        metaInfoAlbums.map((album) => {
          return album.uri.split("/").reverse()[1];
        })
      );
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAlbums();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    hasMediaRootBeenCreated().then((result) => {
      // init directory structure
      if (!result) {
        createAlbum("media").then(() =>
          createAlbum("media/Album1").then(() => fetchAlbums())
        );
      } else fetchAlbums();
    });
  }, []);

  const changeSortDirection = () => {
    // TODO
  };

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={albums}
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
          {/*<MaterialCommunityIcons name="sort-variant" size={30} color="white" />*/}
        </Pressable>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            // Platform.OS === "ios" ?
            Alert.prompt("Neues Album erstellen", "", createAlbum);
            // : setShowDialog((v) => !v);
          }}
        >
          <Text style={{ color: "white", marginRight: 10 }}>
            Album erstellen
          </Text>
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
