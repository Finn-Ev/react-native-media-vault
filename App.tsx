import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Navigation from "./src/navigation";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlbumContextProvider } from "./src/context/AlbumContext";
import { documentDirectory } from "expo-file-system";
import { ImportAssetsContextProvider } from "./src/context/ImportAssetsContext";
import { AuthContextProvider } from "./src/context/AuthContext";

const App: React.FC = () => {
  if (!documentDirectory) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <Text style={{ color: "white" }}>
          Dein Gerät unterstüzt diese App leider nicht.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthContextProvider>
        <AlbumContextProvider>
          <ImportAssetsContextProvider>
            <ActionSheetProvider>
              <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
                <StatusBar style={"light"} />
                <Navigation />
              </SafeAreaView>
            </ActionSheetProvider>
          </ImportAssetsContextProvider>
        </AlbumContextProvider>
      </AuthContextProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
