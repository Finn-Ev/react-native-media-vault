import {
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  MGAssetListScreenNavigationProps,
  MediaAlbumDetailScreenRouteProps,
} from "../../navigation/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import ImagePreview from "../../components/ImagePreview";
import LoadingIndicator from "../../components/LoadingIndicator";
import {
  IImportAsset,
  useImportAssetsContext,
} from "../../context/ImportAssetsContext";
import FooterMenu from "../../components/FooterMenu";
import { Entypo } from "@expo/vector-icons";
import { getAssetsAsync } from "expo-media-library";

const MGAssetListScreen: React.FC = ({}) => {
  const navigation = useNavigation<MGAssetListScreenNavigationProps>();
  const route = useRoute<MediaAlbumDetailScreenRouteProps>();

  const [loading, setLoading] = useState(false);

  const [allFetchedAssets, setAllFetchedAssets] = useState<IImportAsset[]>([]);

  const importAssetsContext = useImportAssetsContext();

  useEffect(() => {
    getAssets();
  }, []);

  const getAssets = async () => {
    setLoading(true);
    const items = await MediaLibrary.getAssetsAsync({
      album: route.params.albumId,
      first: 24,
      after: allFetchedAssets[allFetchedAssets.length - 1]?.id,
      mediaType: ["photo", "video"],
    });

    const newAssets: IImportAsset[] = allFetchedAssets;
    for (const asset of items.assets) {
      const { localUri, id } = await MediaLibrary.getAssetInfoAsync(asset);
      if (localUri && id) {
        newAssets.push({
          localUri,
          id,
        });
      }
    }
    setAllFetchedAssets(newAssets);
    setLoading(false);
  };

  const renderItem = ({ item }: any) => (
    <ImagePreview
      key={item.id}
      uri={item.localUri}
      onPress={() => importAssetsContext?.toggleAsset(item)}
      isSelected={importAssetsContext!.assetsToImport.includes(item)}
    />
  );

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        numColumns={3}
        data={allFetchedAssets}
        onEndReached={getAssets}
        // onEndReachedThreshold={0.5}
        renderItem={renderItem}
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
});

export default MGAssetListScreen;
