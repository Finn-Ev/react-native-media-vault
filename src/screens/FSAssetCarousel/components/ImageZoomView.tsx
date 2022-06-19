import {
  StyleSheet,
  View,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import { ReactNativeZoomableViewWithGestures } from "@openspacelabs/react-native-zoomable-view";
import { useNavigation } from "@react-navigation/native";
import { FSAssetCarouselScreenNavigationProps } from "../../../navigation/types";

interface ImageZoomZoomViewProps {
  uri: string;
}

const ImageZoomView: React.FC<ImageZoomZoomViewProps> = ({ uri }) => {
  const navigation = useNavigation<FSAssetCarouselScreenNavigationProps>();

  const { width } = useWindowDimensions();

  return (
    // <ReactNativeZoomableViewWithGestures
    //   maxZoom={30}
    //   movementSensibility={1}
    //   bindToBorders={true}
    //
    //   onSwipeDown={() => navigation.goBack()}
    // >
    <Image
      source={{ uri }}
      style={{ height: "100%", width }}
      resizeMode={"contain"}
    />
    // </ReactNativeZoomableViewWithGestures>
  );
};

const styles = StyleSheet.create({});

export default ImageZoomView;
