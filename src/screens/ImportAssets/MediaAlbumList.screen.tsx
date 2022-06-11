import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MediaAlbumListScreenNavigationProps } from "../../navigation/types";
import FooterMenu from "../../components/ImportAssets/FooterMenu";

interface MediaAlbumListProps {}

const smartAlbumWhiteList = ["Recents", "Favorites"];

const MediaAlbumListScreen: React.FC<MediaAlbumListProps> = ({}) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();

  const navigation = useNavigation<MediaAlbumListScreenNavigationProps>();

  const [standardAlbums, setStandardAlbums] = useState<MediaLibrary.Album[]>(
    []
  );

  const [smartAlbums, setSmartAlbums] = useState<MediaLibrary.Album[]>([]);

  const getAlbums = async () => {
    const smartAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    const filteredSmartAlbums = smartAlbums.filter((album) =>
      smartAlbumWhiteList.includes(album.title)
    );
    setSmartAlbums(filteredSmartAlbums);

    const albums = await MediaLibrary.getAlbumsAsync();
    setStandardAlbums(albums);
  };

  useEffect(() => {
    requestPermission().then(getAlbums);
  }, []);

  if (status?.granted) {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView>
          {smartAlbums.map((album: MediaLibrary.Album, index) => (
            <Pressable
              onPress={() => {
                navigation.navigate("MediaAlbumDetail", {
                  albumId: album.id,
                  albumName: album.title,
                });
              }}
              key={index}
              style={[
                styles.album,
                index !== standardAlbums.length - 1
                  ? { borderBottomWidth: 1 }
                  : {},
              ]}
            >
              <Text style={styles.text}>{album.title}</Text>
            </Pressable>
          ))}
          {standardAlbums.map((album: MediaLibrary.Album, index) => (
            <Pressable
              onPress={() => {
                navigation.navigate("MediaAlbumDetail", {
                  albumId: album.id,
                  albumName: album.title,
                });
              }}
              key={index}
              style={[
                styles.album,
                index !== standardAlbums.length - 1
                  ? { borderBottomWidth: 1 }
                  : {},
              ]}
            >
              <Text style={styles.text}>{album.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <FooterMenu />
      </SafeAreaView>
    );
  } else
    return (
      <View style={styles.noPermissions}>
        <Text style={[styles.text, { textAlign: "center" }]}>
          Um Bilder und Videos zu importieren, müssen sie der App die
          entsprechenden Berechtigungen erteilen.
        </Text>
        <Text
          style={styles.requestPermissionButton}
          onPress={requestPermission}
        >
          Berechtigung gewähren
        </Text>
      </View>
    );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
  noPermissions: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  requestPermissionButton: {
    marginTop: 20,
    color: "white",
    textAlign: "center",
    fontSize: 20,
    borderWidth: 1,
    borderColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  album: {
    flex: 1,
    backgroundColor: "black",
    borderColor: "gray",
    paddingVertical: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});

export default MediaAlbumListScreen;
