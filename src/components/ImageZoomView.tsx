import {
  StyleSheet,
  View,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

interface ImageZoomZoomViewProps {
  uri: string;
}

const ImageZoomView: React.FC<ImageZoomZoomViewProps> = ({ uri }) => {
  const { width } = useWindowDimensions();

  return (
    <ReactNativeZoomableView maxZoom={30} movementSensibility={5}>
      <Image
        source={{ uri }}
        style={{ width, height: "100%" }}
        resizeMode={"center"}
      />
    </ReactNativeZoomableView>
  );
};

const styles = StyleSheet.create({});

export default ImageZoomView;
