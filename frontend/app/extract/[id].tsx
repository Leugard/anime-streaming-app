import {
  View,
  Text,
  Dimensions,
  Animated,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useAnimeStore } from "@/stores/useAnimeStore";

const { height } = Dimensions.get("window");

interface SourceItem {
  quality: string;
  url: string;
}

interface Providers {
  [key: string]: SourceItem[];
}

const VideoPlayer = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { progress, setProgress, markCompleted } = useAnimeStore();

  const [sources, setSources] = useState<Providers>({});
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [showSourceSelector, setShowSourceSelector] = useState(false);
  const [hasStartedFromSaved, setHasStartedFromSaved] = useState(false);
  const [nextEpisodeData, setNextEpisodeData] = useState<any>(null);

  const videoRef = useRef<Video>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const controlsTimer = useRef<NodeJS.Timeout | number | null>(null);
  const progressSaveTimer = useRef<NodeJS.Timeout | number | null>(null);

  const episodeTitle = `${id}`;
  const episodeId = id as string;

  const currentProgress = progress[episodeId];

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/v1/anime/extract/${id}`
        );
        if (res.data.success) {
          setSources(res.data.data);

          const firstProvider = Object.keys(res.data.data)[0];
          if (firstProvider && res.data.data[firstProvider].length > 0) {
            const firstSource = res.data.data[firstProvider][0];
            handleSelectVideo(
              firstSource.url,
              firstSource.quality,
              firstProvider
            );
          }
        }
      } catch (error: any) {
        console.error("fetchSources error: ", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [id]);

  useEffect(() => {
    if (
      selectedUrl &&
      currentProgress &&
      !hasStartedFromSaved &&
      !currentProgress.completed
    ) {
      if (currentProgress.position > 30) {
        setTimeout(async () => {
          if (videoRef.current) {
            await videoRef.current.setPositionAsync(
              currentProgress.position * 1000
            );
            setHasStartedFromSaved(true);
          }
        }, 1000);
      } else {
        setHasStartedFromSaved(true);
      }
    }
  }, [selectedUrl, currentProgress, hasStartedFromSaved]);

  useEffect(() => {
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      );
    };

    setOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [selectedUrl]);

  useEffect(() => {
    if (showControls && selectedUrl) {
      controlsTimer.current = setTimeout(() => {
        hideControls();
      }, 3000);
    }

    return () => {
      if (controlsTimer.current) {
        clearTimeout(controlsTimer.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showControls, selectedUrl]);

  useEffect(() => {
    if (status?.isLoaded && status.positionMillis && status.durationMillis) {
      const positionSeconds = Math.floor(status.positionMillis / 1000);
      const durationSeconds = Math.floor(status.durationMillis / 1000);

      if (progressSaveTimer.current) {
        clearTimeout(progressSaveTimer.current);
      }

      progressSaveTimer.current = setTimeout(() => {
        const progressPercentage = positionSeconds / durationSeconds / 100;

        if (progressPercentage >= 90) {
          markCompleted(episodeId);
          showNextEpisodePrompt();
        } else if (positionSeconds > 30) {
          setProgress(episodeId, {
            position: positionSeconds,
            duration: durationSeconds,
            completed: false,
          });
        }
      }, 5000);
    }

    return () => {
      if (progressSaveTimer.current) {
        clearTimeout(progressSaveTimer.current);
      }
    };
  }, [status, episodeId, setProgress, markCompleted]);

  const showNextEpisodePrompt = () => {
    Alert.alert(
      "Episode Completed!",
      "Would you like to continue to the next episode?",
      [
        { text: "Stay here", style: "cancel" },
        { text: "next episode", onPress: () => {} },
      ]
    );
  };

  const hideControls = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowControls(false));
  };

  const showsControlHandler = () => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSelectVideo = (
    realUrl: string,
    quality: string,
    provider: string
  ) => {
    let currentPos = 0;
    if (status?.isLoaded && status.positionMillis) {
      currentPos = status.positionMillis;
    }
    const proxied = `http://localhost:5001/api/v1/anime/stream?url=${encodeURIComponent(
      realUrl
    )}`;
    setSelectedUrl(proxied);
    setSelectedQuality(quality);
    setSelectedProvider(provider);
    setShowSourceSelector(false);

    if (currentPos > 0) {
      setTimeout(async () => {
        if (videoRef.current) {
          await videoRef.current.setPositionAsync(currentPos);
        }
      }, 1000);
    }
  };

  const handleBackPress = async () => {
    if (status?.isLoaded && status.positionMillis && status.durationMillis) {
      const positionSeconds = Math.floor(status.positionMillis / 1000);
      const durationSeconds = Math.floor(status.durationMillis / 1000);

      if (positionSeconds > 30) {
        const progressPercentage = (positionSeconds / durationSeconds) * 100;

        if (progressPercentage >= 90) {
          markCompleted(episodeId);
        } else {
          setProgress(episodeId, {
            position: positionSeconds,
            duration: durationSeconds,
            completed: false,
          });
        }
      }
    }

    await ScreenOrientation.unlockAsync();
    router.back();
  };

  const togglePlay = async () => {
    if (videoRef.current) {
      if (status?.isLoaded && status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const seekBackward = async () => {
    if (videoRef.current && status?.isLoaded && status.positionMillis) {
      const newPosition = Math.max(0, status.positionMillis - 10000);
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const seekForward = async () => {
    if (
      videoRef.current &&
      status?.isLoaded &&
      status.positionMillis &&
      status.durationMillis
    ) {
      const newPosition = Math.min(
        status.durationMillis,
        status.positionMillis + 10000
      );
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const formatTime = (millis: number | undefined) => {
    if (!millis) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size={"large"} color={"#fff"} />
      </View>
    );
  }

  if (!selectedUrl) {
    return (
      <ScrollView
        contentContainerStyle={{ padding: 16, backgroundColor: "#000" }}
      >
        <Text className="text-sm text-white mb-4">Choose Quality:</Text>
        {Object.entries(sources).map(([provider, list]) => (
          <View key={provider} className="mb-20">
            <Text className="text-white/80 mb-2 font-bold">
              {provider.toUpperCase()}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {list.map((item) => (
                <TouchableOpacity
                  key={item.quality}
                  className="bg-[#333] px-2 py-3 rounded-lg mr-2 mb-2"
                  onPress={() =>
                    handleSelectVideo(item.url, item.quality, provider)
                  }
                >
                  <Text className="text-white text-sm">{item.quality}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />

      <TouchableOpacity
        className="flex-1"
        activeOpacity={1}
        onPress={() => {
          if (showControls) {
            hideControls();
          } else {
            showsControlHandler();
          }
        }}
      >
        <Video
          ref={videoRef}
          style={{ flex: 1 }}
          source={{ uri: selectedUrl }}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
          shouldPlay={true}
          progressUpdateIntervalMillis={1000}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: height * 0.4,
          }}
        />
      </TouchableOpacity>

      {showControls && (
        <Animated.View
          className="absolute top-0 left-0 right-0 bottom-0 justify-between"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity
            className="flex-1 justify-between"
            activeOpacity={1}
            onPress={(e) => {
              if (e.target === e.currentTarget) {
                hideControls();
              }
            }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent"]}
              className="flex-row items-center pt-3 px-5 pb-5"
            >
              <TouchableOpacity className="p-2" onPress={handleBackPress}>
                <Ionicons name="chevron-back" size={28} color={"white"} />
              </TouchableOpacity>

              <View className="flex-1 items-center mx-5">
                <Text className="text-white text-sm font-bold text-center">
                  {episodeTitle}
                </Text>
                <Text
                  className="text-xs mt-1"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {selectedProvider.toUpperCase()} • {selectedQuality}
                </Text>
              </View>

              <TouchableOpacity
                className="p-2"
                onPress={() => setShowSourceSelector(!showSourceSelector)}
              >
                <Ionicons name="settings-outline" size={24} color={"white"} />
              </TouchableOpacity>
            </LinearGradient>

            <View className="flex-row justify-center items-center gap-14">
              <TouchableOpacity
                className="p-4 rounded-full bg-[rgba(0,0,0,0.3)]"
                onPress={seekBackward}
              >
                <Ionicons name="play-back" size={40} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-4 rounded-full bg-[rgba(0,0,0,0.3)]"
                onPress={togglePlay}
              >
                <Ionicons
                  name={status?.isLoaded && status.isPlaying ? "pause" : "play"}
                  size={50}
                  color={"white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-4 rounded-full bg-[rgba(0,0,0,0.3)]"
                onPress={seekForward}
              >
                <Ionicons name={"play-forward"} size={40} color={"white"} />
              </TouchableOpacity>
            </View>

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={{
                paddingHorizontal: 20,
                paddingBottom: 40,
                paddingTop: 20,
              }}
            >
              <View>
                <Slider
                  style={{ width: "100%", height: 40, marginBottom: 8 }}
                  value={status && status.isLoaded ? status.positionMillis : 0}
                  minimumValue={0}
                  maximumValue={
                    status && status.isLoaded ? status.durationMillis : 0
                  }
                  thumbTintColor="#fff"
                  minimumTrackTintColor="#fff"
                  maximumTrackTintColor="rgba(255,255,255,0.5)"
                  onSlidingComplete={async (value) => {
                    await videoRef.current?.setPositionAsync(value);
                  }}
                />
                <View className="flex-row justify-between">
                  <Text className="text-[rgba(255,255,255,0.8)] text-sm font-medium">
                    {formatTime(
                      status?.isLoaded ? status.positionMillis : undefined
                    )}
                  </Text>
                  <Text className="text-[rgba(255,255,255,0.8)] text-sm font-medium">
                    {formatTime(
                      status?.isLoaded ? status.durationMillis : undefined
                    )}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {showSourceSelector && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
          <LinearGradient
            colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0.95)"]}
            style={{
              width: "80%",
              maxHeight: "70%",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-white text-sm font-bold">
                Select Source & Quality
              </Text>
              <TouchableOpacity
                onPress={() => setShowSourceSelector(false)}
                className="p-1"
              >
                <Ionicons name="close" size={24} color={"white"} />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-96">
              {Object.entries(sources).map(([provider, list]) => (
                <View key={provider} className="mb-5">
                  <Text className="text-[#bbb] mb-3 font-bold text-sm">
                    {provider.toUpperCase()}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {list.map((item) => (
                      <TouchableOpacity
                        key={item.quality}
                        className="bg-[rgba(255,255,255,0.1)] py-2 px-4 rounded-md mb-2"
                        style={[
                          selectedQuality === item.quality &&
                            selectedProvider === provider && {
                              backgroundColor: "#00C853",
                            },
                        ]}
                        onPress={() =>
                          handleSelectVideo(item.url, item.quality, provider)
                        }
                      >
                        <Text
                          className="text-white text-sm font-medium"
                          style={[
                            selectedQuality === item.quality &&
                              selectedProvider === provider && {
                                fontWeight: "600",
                              },
                          ]}
                        >
                          {item.quality}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

export default VideoPlayer;
