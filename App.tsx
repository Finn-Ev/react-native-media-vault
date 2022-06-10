import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import Navigation from "./src/navigation";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AlbumContextProvider } from "./src/context/AlbumContext";
import { documentDirectory } from "expo-file-system";

const App: React.FC = () => {
  if (!documentDirectory) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style="light" />
        <Text style={{ color: "white" }}>
          Dein Gerät unterstüzt diese App leider nicht.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AlbumContextProvider>
        <ActionSheetProvider>
          <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
            <StatusBar style={"light"} />
            <Navigation />
          </SafeAreaView>
        </ActionSheetProvider>
      </AlbumContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
