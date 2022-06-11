import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MediaAlbumListScreenNavigationProps } from "../../navigation/types";
import FooterMenu from "../../components/ImportAssets/FooterMenu";
import AlbumPreview from "../../components/ImportAssets/AlbumPreview";

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
          {smartAlbums.map((album, index) => (
            <AlbumPreview name={album.title} id={album.id} key={index} />
          ))}
          {!!standardAlbums.length && <View style={styles.horizontalRow} />}
          {standardAlbums.map((album, index) => (
            <AlbumPreview name={album.title} id={album.id} key={index} />
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
  horizontalRow: {
    borderBottomWidth: 1,
    borderColor: "#777",
    marginHorizontal: 15,
    marginVertical: 10,
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
  text: {
    color: "white",
    fontSize: 16,
  },
});

export default MediaAlbumListScreen;
