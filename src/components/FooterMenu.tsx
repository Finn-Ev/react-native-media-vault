import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useImportAssetsContext } from "../context/ImportAssetsContext";
import { useNavigation } from "@react-navigation/native";
import {
  FSAssetListScreenNavigationProps,
  FSAlbumListScreenNavigationProps,
} from "../navigation/types";
import { v4 as uuidv4 } from "uuid";
import * as FileSystem from "expo-file-system";
import { getFileExtension, getFullDirectoryPath } from "../util/MediaHelper";

interface ImportAssetsFooterProps {}

const FooterMenu: React.FC<ImportAssetsFooterProps> = ({}) => {
  const navigation = useNavigation<
    FSAssetListScreenNavigationProps | FSAlbumListScreenNavigationProps
  >();
  const importAssetsContext = useImportAssetsContext();

  const importSelectedAssets = async () => {
    await importAssetsContext?.importSelectedAssetsIntoFS();

    // @ts-ignore
    navigation.navigate("Gallery");
  };

  return (
    <View style={styles.footer}>
      <Text style={{ color: "white", fontSize: 16 }}>
        {importAssetsContext?.assetsToImport.length} ausgewählt
      </Text>
      {!!importAssetsContext?.assetsToImport.length && (
        <Pressable onPress={importSelectedAssets} hitSlop={15}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Auswahl bestätigen</Text>
            <FontAwesome5 name="check-circle" size={20} color="lightgrey" />
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginRight: 5,
    color: "white",
    fontSize: 15,
  },
});

export default FooterMenu;
