import { StyleSheet, View, Text, Pressable } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

interface ImportMediaButtonProps {
  onPress: () => void;
  size?: number;
}

const AddMediaButton: React.FC<ImportMediaButtonProps> = ({
  onPress,
  size = 70,
}) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <AntDesign name="pluscircle" size={size} color="white" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
});

export default AddMediaButton;
