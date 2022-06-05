import { StyleSheet, View, Text, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface ImportMediaButtonProps {}

const ImportMediaButton: React.FC<ImportMediaButtonProps> = ({}) => {
  const importMedia = () => {
    console.log("import");
  };

  return (
    <Pressable onPress={importMedia} style={styles.button}>
      {/* @ts-ignore*/}
      <AntDesign name="pluscircleo" size={40} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    marginHorizontal: "auto",
    bottom: 50,
  },
});

export default ImportMediaButton;
