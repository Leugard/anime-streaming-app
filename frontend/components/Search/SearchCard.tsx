import { ActivityIndicator, Image, Text, View } from "react-native";
import Button from "../Button";
import { router } from "expo-router";

const SearchCard = ({ item, loading }: any) => {
  return (
    <View className="flex-1 pb-4">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={"#00C853"} />
        </View>
      ) : (
        <View className="bg-[#252525] rounded-md h-48 justify-center">
          <View className="flex-row gap-2">
            <Image
              source={{ uri: item.thumbnail }}
              style={{
                width: 103,
                height: 146,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: "#252525",
              }}
            />
            <View className="flex-1 pr-2 justify-between">
              <Text className="text-2xl font-bold text-white">
                {item.title}
              </Text>
              <View className="flex-row gap-2">
                <Button
                  color={"#00C853"}
                  width={150}
                  height={40}
                  title="Watch"
                  onPress={() => {
                    router.push(`/animeDetail/${item.id}`);
                  }}
                />
                <Button
                  color={"#000"}
                  width={40}
                  height={40}
                  icon={require("../../assets/icons/heart.png")}
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchCard;
