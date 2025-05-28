import { View, Text, Dimensions, Image } from "react-native";
import React from "react";

const { width } = Dimensions.get("window");

const SearchItem = ({ item }: any) => {
  console.log("item: ", item.title);
  return (
    <View className="flex-1 " style={{ width: width }}>
      <View className="bg-[#252525] h-20" style={{ width: width }}>
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: 105,
            height: 148,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: "#252525",
          }}
        />
        <Text className="text-2xl text-white font-bold">{item.title}</Text>
      </View>
    </View>
  );
};

export default SearchItem;
