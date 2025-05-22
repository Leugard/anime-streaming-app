import { ActivityIndicator, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CarouselItem from "./CarouselItem";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Pagination from "./Pagination";
import usePopularAnime from "@/hooks/usePopularAnime";

const CarouselCard = () => {
  const scrollX = useSharedValue(0);
  const { loading, data } = usePopularAnime();
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
    <View className="h-[440px] justify-center">
      {loading ? (
        <>
          <ActivityIndicator size={"large"} />
        </>
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
