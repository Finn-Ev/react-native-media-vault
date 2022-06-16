import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import {
  MGAssetListScreenNavigationProps,
  MediaAlbumDetailScreenRouteProps,
} from "../../navigation/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import ImagePreview from "../../components/ImagePreview";
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  IImportAsset,
  useImportAssetsContext,
} from "../../context/ImportAssetsContext";
import FooterMenu from "../../components/FooterMenu";

const MGAssetListScreen: React.FC = ({}) => {
  const navigation = useNavigation<MGAssetListScreenNavigationProps>();
  const route = useRoute<MediaAlbumDetailScreenRouteProps>();

  const [assetUris, setAssetUris] = useState<IImportAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const importAssetsContext = useImportAssetsContext();

  const getAssets = async () => {
    setLoading(true);
    const items = await MediaLibrary.getAssetsAsync({
      album: route.params.albumId,
      first: 50, // todo lazy load whole album
      mediaType: ["photo", "video"],
    });

    const assets: IImportAsset[] = [];
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
            onPress={() => importAssetsContext?.toggleAsset(item)}
            isSelected={importAssetsContext!.assetsToImport.includes(item)}
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

export default MGAssetListScreen;
