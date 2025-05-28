import { ActivityIndicator, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import CarouselItem from "./CarouselItem";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Pagination from "../Pagination";
import { usePopularAnime } from "@/hooks/useAnime";

const CarouselCard = () => {
  const scrollX = useSharedValue(0);
  const { loading, data, error } = usePopularAnime();
  const [paginationIndex, setPaginationIndex] = useState(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (
      viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null
    ) {
      setPaginationIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View className="h-[440px]">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-600 text-2xl">{error}</Text>
        </View>
      ) : (
        <>
          <Animated.FlatList
            data={data}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => <CarouselItem item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={onScrollHandler}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
          />
          <Pagination
            items={data}
            scrollX={scrollX}
            paginationIndex={paginationIndex}
          />
        </>
      )}
    </View>
  );
};

export default CarouselCard;
