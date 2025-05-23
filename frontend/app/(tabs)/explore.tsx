import Button from "@/components/Button";
import AnimeCard from "@/components/FIlter/AnimeCard";
import { useFilter } from "@/hooks/useAnime";
import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

const Explore = () => {
  const {
    data,
    loading: animeLoading,
    error,
    updateFilter,
    setPage,
  } = useFilter();
  const [activeTab, setActiveTab] = useState<"all" | "anime" | "donghua">(
    "all"
  );
  const [loading, setLoading] = useState(false);

  const handleTabPress = (tab: "all" | "anime" | "donghua") => {
    if (activeTab === tab) return;

    setLoading(true);
    try {
      setPage(1);

      if (tab === "all" || tab === "anime") updateFilter("genre", []);
      else {
        updateFilter("genre", [tab]);
      }
      setPage(1);

      setActiveTab(tab);
    } catch (error) {
      console.error("Tab change error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || animeLoading;

  return (
    <View className="flex-1 pt-14 bg-[#171717]">
      <View className="flex-row">
        <TabButton
          label="All"
          isActive={activeTab === "all"}
          onPress={() => handleTabPress("all")}
        />
        <TabButton
          label="Anime"
          isActive={activeTab === "anime"}
          onPress={() => handleTabPress("anime")}
        />
        <TabButton
          label="Donghua"
          isActive={activeTab === "donghua"}
          onPress={() => handleTabPress("donghua")}
        />
      </View>
      <View className="">
        {isLoading ? (
          <>
            <ActivityIndicator size={"large"} />
          </>
        ) : error ? (
          <Text className="text-red-500 text-center mt-4">{error}</Text>
        ) : data && data.length > 0 ? (
          <AnimeCard />
        ) : (
          <Text className="text-gray-400 text-center mt-4">
            No results found
          </Text>
        )}
      </View>
      <View className="absolute top-[700px] left-[300px]">
        <Button
          icon={require("../../assets/icons/filter.png")}
          width={50}
          height={50}
          color={"#00E676"}
        />
      </View>
    </View>
  );
};

export default Explore;

const TabButton = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`pb-2 border-b-2 h-8 w-[128px] items-center ${
        isActive ? "border-[#00C853]" : "border-transparent"
      }`}
    >
      <Text
        className={`text-sm font-semibold ${
          isActive ? "text-white" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
