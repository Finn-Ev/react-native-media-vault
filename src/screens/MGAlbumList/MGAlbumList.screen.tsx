import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MGAlbumListScreenNavigationProps } from "../../navigation/types";
import FSFooterMenu from "../../components/FSFooterMenu";
import AlbumPreview from "./components/AlbumPreview";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useImportAssetsContext } from "../../context/ImportAssetsContext";

const smartAlbumWhiteList = ["Recents", "Favorites"];

const MGAlbumListScreen: React.FC = ({}) => {
  const importAssetsContext = useImportAssetsContext();

  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<MGAlbumListScreenNavigationProps>();

  const [standardAlbums, setStandardAlbums] = useState<MediaLibrary.Album[]>(
    []
  );

  const [smartAlbums, setSmartAlbums] = useState<MediaLibrary.Album[]>([]);

  const getAlbums = async () => {
    setLoading(true);
    const smartAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    const filteredSmartAlbums = smartAlbums.filter((album) =>
      smartAlbumWhiteList.includes(album.title)
    );
    setSmartAlbums(filteredSmartAlbums);

    const albums = await MediaLibrary.getAlbumsAsync();
    setStandardAlbums(albums);
    setLoading(false);
  };

  useEffect(() => {
    requestPermission().then(getAlbums);
    return () => importAssetsContext?.reset();
  }, []);

  if (status?.granted) {
    return (
      <SafeAreaView style={styles.root}>
        {!loading ? (
          <ScrollView>
            {smartAlbums.map((album, index) => (
              <AlbumPreview name={album.title} id={album.id} key={index} />
            ))}
            {!!standardAlbums.length && <View style={styles.horizontalRow} />}
            {standardAlbums.map((album, index) => (
              <AlbumPreview name={album.title} id={album.id} key={index} />
            ))}
          </ScrollView>
        ) : (
          <LoadingIndicator />
        )}
        <FSFooterMenu />
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

export default MGAlbumListScreen;
