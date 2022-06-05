import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import Navigation from "./src/navigation";

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "black", flex: 1 }}>
      <StatusBar style={"light"} />
      <Navigation />
    </SafeAreaView>
  );
};

export default App;
