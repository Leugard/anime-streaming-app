import { Image } from "expo-image";
import { Text, TouchableOpacity } from "react-native";

const AnimeItem = ({ item }: any) => {
  return (
    <TouchableOpacity className="items-center">
      <Image
        source={{ uri: item.thumbnail }}
        style={{
          width: 104,
          height: 147,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: "#252525",
        }}
      />
      <Text
        className="text-white/80 text-[12px] font-medium"
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
