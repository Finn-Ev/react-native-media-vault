import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import { AssetsDetailScreenRouteProps } from "../navigation/types";
import { useRoute } from "@react-navigation/native";
import { getIsImage } from "../util/MediaHelper";
import { Video } from "expo-av";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AssetsDetailScreenProps {}

const AssetsDetailScreen: React.FC<AssetsDetailScreenProps> = ({}) => {
  const route = useRoute<AssetsDetailScreenRouteProps>();
  const { assetUris, startIndex } = route.params;

  const insets = useSafeAreaInsets();

  const flatList = useRef<FlatList>(null);

  const { width } = useWindowDimensions();
  const [activeImageIndex, setActiveImageIndex] = useState(startIndex);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveImageIndex(viewableItems[0].index || 0);
      }
    }
  );

  return (
    <SafeAreaView style={[styles.root, { marginTop: -insets.top }]}>
      <FlatList
        initialScrollIndex={startIndex}
        horizontal={true}
        data={assetUris}
        pagingEnabled
        ref={flatList}
        renderItem={({ item }) =>
          getIsImage(item) ? (
            <Image
              style={{ width, height: "100%" }}
              source={{ uri: item }}
              resizeMode={"center"}
            />
          ) : (
            <Video
              source={{ uri: item }}
              style={{ width, height: "100%" }}
              // shouldPlay={true}
              isLooping
              useNativeControls={true}
            />
          )
        }
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 250));
          wait.then(() => {
            flatList.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 51,
        }}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
      {/*<View style={[styles.dotsContainer, { bottom: insets.bottom + 25 }]}>*/}
      {/*  {assetUris.map((_, index) => (*/}
      {/*    <View*/}
      {/*      key={index}*/}
      {/*      style={[*/}
      {/*        styles.dot,*/}
      {/*        {*/}
      {/*          backgroundColor:*/}
      {/*            activeImageIndex === index ? "#2997ff" : "grey",*/}
      {/*        },*/}
      {/*      ]}*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</View>*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#000",
    justifyContent: "center",
    flex: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    alignItems: "center",
    width: "100%",
  },
  dot: {
    width: 7,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: "red",
    marginHorizontal: 4,
  },
});

export default AssetsDetailScreen;
