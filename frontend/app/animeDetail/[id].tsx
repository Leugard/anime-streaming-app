import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import Button from "@/components/Button";
import { ScrollView } from "react-native-gesture-handler";
import Rating from "@/components/Rating";
import { useDetail } from "@/hooks/useAnime";
import { useAnimeStore } from "@/stores/useAnimeStore";

const Detail = () => {
  const { id } = useLocalSearchParams();
  const { loading, data, error, refresh } = useDetail(id);
  const { progress } = useAnimeStore();

  const getNextEpisodeToWatch = () => {
    if (!data?.episode) return null;

    let lastWatched = null;
    let firstIncomplete = null;

    for (const episode of data?.episode ?? []) {
      const episodeProgress = progress[episode.id];

      if (episodeProgress) {
        if (!episodeProgress.completed && episodeProgress.position > 0) {
          lastWatched = episode;
        }
      } else if (!firstIncomplete) {
        firstIncomplete = episode;
      }
    }

    return lastWatched || firstIncomplete || data?.episode[0];
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (episodeId: string) => {
    const episodeProgress = progress[episodeId];
    if (!episodeProgress || episodeProgress.duration === 0) return 0;
    return (episodeProgress.position / episodeProgress.duration) * 100;
  };

  const handleWatchPress = () => {
    const nextEpisode = getNextEpisodeToWatch();
    if (nextEpisode) {
      router.push(`../extract/${nextEpisode.id}`);
    }
  };

  const handleEpisodePress = (episode: any) => {
    router.push(`../extract/${episode.id}`);
  };

  const renderItem = ({ item }: any) => {
    const episodeProgress = progress[item.id];
    const progressPercentage = getProgressPercentage(item.id);
    const isCompleted = episodeProgress?.completed || false;
    const hasProgress = episodeProgress && episodeProgress.position > 0;

    return (
      <View className="px-3 pb-5">
        <TouchableOpacity
          className="h-12 bg-[#252525] rounded-md justify-center"
          onPress={() => handleEpisodePress(item)}
        >
          {hasProgress && (
            <View className="h-1 bg-[#333]">
              <View
                className={`h-full ${
                  isCompleted ? "bg-green-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </View>
          )}

          <View className="h-12 justify-center px-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-white font-medium text-lg flex-1">
                {item.title}
              </Text>

              <View className="flex-row items-center ml-2">
                {isCompleted ? (
                  <View className="flex-row items-center">
                    <Text className="text-green-500 text-xs mr-1">✓</Text>
                    <Text className="text-green-500 text-xs">Completed</Text>
                  </View>
                ) : hasProgress ? (
                  <View className="flex-row items-center">
                    <Text className="text-blue-500 text-xs mr-1">⏸</Text>
                    <Text className="text-blue-500 text-xs">
                      {formatTime(episodeProgress.position)}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-gray-500 text-xs">Not started</Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const getWatchButtonText = () => {
    const nextEpisode = getNextEpisodeToWatch();
    if (!nextEpisode) return "Watch";

    const episodeProgress = progress[nextEpisode.id];
    if (
      episodeProgress &&
      episodeProgress.position > 0 &&
      !episodeProgress.completed
    ) {
      return "Continue";
    }

    return "Watch";
  };

  return (
    <ScrollView className="flex-1 bg-[#171717]">
      {loading ? (
        <View className="items-center justify-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View>
          <View>
            <Image
              source={{ uri: data?.thumbnail }}
              style={{ width: 400, height: 350, opacity: 0.5 }}
            />
            <View className="absolute pt-72 flex-row px-3">
              <Image
                source={{ uri: data?.thumbnail }}
                style={{
                  width: 120,
                  height: 170,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#252525",
                }}
              />
              <View className="pl-5">
                <Text
                  className="text-xl font-bold text-white"
                  style={{ width: 230 }}
                >
                  {data?.title}
                </Text>
                <Text
                  className="text-md font-medium text-white/70 pt-1 pb-1"
                  style={{ width: 230 }}
                >
                  {data?.genres?.join(" • ")}
                </Text>
                <Rating rating={data?.rating?.toString() ?? ""} />
                <View className="pt-1 flex-row gap-5">
                  <Button
                    title={getWatchButtonText()}
                    color="#00C853"
                    onPress={handleWatchPress}
                  />
                  <Button
                    icon={require("../../assets/icons/heart.png")}
                    color="#252525"
                    onPress={() => {}}
                    width={42}
                    height={42}
                  />
                </View>
              </View>
            </View>
          </View>
          <View className="px-3 pt-32 gap-3">
            <Text className="text-3xl font-bold text-white">Description</Text>
            <Text
              className="text-md font-medium text-white/70"
              numberOfLines={4}
              ellipsizeMode="clip"
            >
              {data?.description}
            </Text>
          </View>
          <View className="pt-10 gap-3">
            <Text className="text-3xl font-bold text-white px-3">Episodes</Text>
            <View className="w-full h-0.5 bg-[#252525]" />
            <FlatList data={data?.episode} renderItem={renderItem} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default Detail;
