import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import Navigation from "./src/navigation";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
          <StatusBar style={"light"} />
          <Navigation />
        </SafeAreaView>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
};

export default App;
