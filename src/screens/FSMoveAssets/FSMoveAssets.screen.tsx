import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  FSMoveAssetsScreenNavigationProps,
  FSMoveAssetsScreenRouteProps,
} from "../../navigation/types";
import { useAlbumContext } from "../../context/AlbumContext";
import { moveAssetsFromFSAlbumToFSAlbum } from "../../util/MediaHelper";
import { Entypo } from "@expo/vector-icons";

const FSMoveAssetsScreen: React.FC = ({}) => {
  const navigation = useNavigation<FSMoveAssetsScreenNavigationProps>();
  const route = useRoute<FSMoveAssetsScreenRouteProps>();

  const albumContext = useAlbumContext();

  const moveAssets = async (destinationAlbumName: string) => {
    await moveAssetsFromFSAlbumToFSAlbum(
      destinationAlbumName,
      route.params.assetUris,
      route.params.copy
    );
    navigation.replace("FSAssetList", { albumName: destinationAlbumName });
  };

  const destinationAlbums = albumContext?.metaAlbums.filter(
    (album) => album.name !== route.params.sourceAlbumName
  );

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.heading}>Wähle das Ziel-Album aus</Text>
      {destinationAlbums?.map((album) => (
        <Pressable
          onPress={() => moveAssets(album.name)}
          style={styles.album}
          key={album.name}
        >
          <Text style={styles.albumName}>{album.name}</Text>
          <Entypo name="chevron-thin-right" size={16} color="gray" />
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  heading: {
    textAlign: "left",
    fontSize: 24,
    color: "white",
    marginBottom: 10,
    fontWeight: "400",
  },
  album: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 10,
    marginHorizontal: "auto",
    borderRadius: 10,
    width: "100%",
  },
  albumName: {
    color: "white",
    fontSize: 24,
  },
});

export default FSMoveAssetsScreen;
