import { Image } from "expo-image";
import { Text, TouchableOpacity } from "react-native";

const AnimeItem = ({ item }: any) => {
  return (
    <TouchableOpacity className="items-center pl-5 pb-2 pt-5">
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
      <Text
        className="text-white/80 text-[12px] font-medium text-center"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ width: 90 }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default AnimeItem;
