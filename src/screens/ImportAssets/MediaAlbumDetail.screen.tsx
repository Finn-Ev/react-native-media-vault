import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import {
  MediaAlbumDetailScreenNavigationProps,
  MediaAlbumDetailScreenRouteProps,
} from "../../navigation/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import ImagePreview from "../../components/ImagePreview";
import LoadingIndicator from "../../components/util/LoadingIndicator";
import {
  IAssetToImport,
  useImportAssetsContext,
} from "../../context/ImportAssetsContext";
import FooterMenu from "../../components/ImportAssets/FooterMenu";

interface MediaAlbumDetailScreenProps {}

const MediaAlbumDetailScreen: React.FC<MediaAlbumDetailScreenProps> = ({}) => {
  const navigation = useNavigation<MediaAlbumDetailScreenNavigationProps>();
  const route = useRoute<MediaAlbumDetailScreenRouteProps>();

  const [assetUris, setAssetUris] = useState<IAssetToImport[]>([]);
  const [loading, setLoading] = useState(true);

  const importAssetsContext = useImportAssetsContext();
  if (!importAssetsContext) throw new Error("ImportAssetsContext not found");

  const getAssets = async () => {
    setLoading(true);
    const items = await MediaLibrary.getAssetsAsync({
      album: route.params.albumId,
      first: 20,
      mediaType: ["photo", "video"],
    });
    const assets: IAssetToImport[] = [];
    for (const asset of items.assets) {
      const { localUri, id } = await MediaLibrary.getAssetInfoAsync(asset);
      if (localUri && id) {
        assets.push({
          localUri,
          id,
        });
      }
    }
    setAssetUris(assets);
    setLoading(false);
  };

  useEffect(() => {
    getAssets();
    navigation.setOptions({ headerTitle: route.params.albumName });
  }, []);
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        numColumns={3}
        data={assetUris}
        renderItem={({ item }) => (
          <ImagePreview
            uri={item.localUri}
            onPress={() => importAssetsContext.toggleAsset(item)}
            isSelected={importAssetsContext?.assetsToImport.includes(item)}
            onLongPress={() => {}}
          />
        )}
      />
      <FooterMenu />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
  },
  text: {
    color: "white",
  },
});

export default MediaAlbumDetailScreen;
