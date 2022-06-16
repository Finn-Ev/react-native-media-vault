import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import {
  FSAssetCarouselScreenRouteProps,
  FSAssetCarouselScreenNavigationProps,
} from "../../navigation/types";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getIsImage } from "../../util/MediaHelper";
import { Video } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ImageZoomView from "./components/ImageZoomView";
import { AntDesign } from "@expo/vector-icons";

const FSAssetCarouselScreen: React.FC = ({}) => {
  const { width } = useWindowDimensions();
  const route = useRoute<FSAssetCarouselScreenRouteProps>();
  const navigation = useNavigation<FSAssetCarouselScreenNavigationProps>();

  const { assetUris, startIndex } = route.params;

  const insets = useSafeAreaInsets();

  const flatList = useRef<FlatList>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(startIndex);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveImageIndex(viewableItems[0].index || 0);
      }
    }
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={30}>
          <AntDesign name="close" size={24} color="white" />
        </Pressable>
      ),
    });
  }, []);

  const hideHeader = () => {
    console.log("hideHeader");
    navigation.setOptions({ headerRight: () => null });
  };

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
            <ImageZoomView uri={item} />
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

export default FSAssetCarouselScreen;
