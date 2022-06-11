import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoadingIndicatorProps {}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({}) => {
  return (
    <View style={styles.root}>
      <ActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});

export default LoadingIndicator;
