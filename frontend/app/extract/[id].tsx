import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { Video, ResizeMode } from "expo-av";

type SourceItem = {
  quality: string;
  url: string;
};

type Providers = {
  [key: string]: SourceItem[];
};

const Extract = () => {
  const { id } = useLocalSearchParams();
  const [sources, setSources] = useState<Providers>({});
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/v1/anime/extract/${id}`
        );
        if (res.data.success) {
          setSources(res.data.data);
        }
      } catch (err: any) {
        console.error("fetchSources error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [id]);

  const handleSelectVideo = (realUrl: string) => {
    const proxied = `http://localhost:5001/api/v1/anime/stream?url=${encodeURIComponent(
      realUrl
    )}`;
    setSelectedUrl(proxied);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {selectedUrl && (
        <Video
          source={{ uri: selectedUrl }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={styles.video}
        />
      )}

      <Text style={styles.header}>Choose Quality:</Text>
      {Object.entries(sources).map(([provider, list]) => (
        <View key={provider} style={styles.section}>
          <Text style={styles.provider}>{provider.toUpperCase()}</Text>
          <View style={styles.buttons}>
            {list.map((item) => (
              <TouchableOpacity
                key={item.quality}
                style={styles.button}
                onPress={() => handleSelectVideo(item.url)}
              >
                <Text style={styles.buttonText}>{item.quality}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Extract;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 12,
  },
  section: {
    marginBottom: 20,
  },
  provider: {
    color: "#bbb",
    marginBottom: 6,
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});
