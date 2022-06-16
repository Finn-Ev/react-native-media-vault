import { StyleSheet, View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  FSMoveAssetsScreenNavigationProps,
  FSMoveAssetsScreenRouteProps,
} from "../../navigation/types";

const FSMoveAssetsScreen: React.FC = ({}) => {
  const navigation = useNavigation<FSMoveAssetsScreenNavigationProps>();
  const route = useRoute<FSMoveAssetsScreenRouteProps>();

  return (
    <View style={styles.root}>
      <Text style={{ color: "white" }}>Move assets</Text>
    </View>
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

export default FSMoveAssetsScreen;
