import {
  View,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Text,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSearch } from "@/hooks/useAnime";
import SearchCard from "@/components/Search/SearchCard";
import { FlatList } from "react-native-gesture-handler";

const Search = () => {
  const { setSearch, search, data, loading, error } = useSearch();
  const [input, setInput] = useState("");
  console.log(loading);

  const handleSearch = () => {
    setSearch(input);
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setSearch("");
    setInput("");
    Keyboard.dismiss();
  };

  return (
    <View className="flex-1 bg-[#171717]">
      <View className="pt-16 px-5">
        <TextInput
          className="w-full h-[40px] bg-[#252525] text-white text-base pl-11 px-2 rounded-md"
          placeholder="Search..."
          placeholderTextColor={"#B0B0B0"}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <View className="absolute top-[60px] left-6 flex-row justify-between w-full">
          <Ionicons
            name="search-outline"
            size={30}
            color={"#B0B0B0"}
            className=""
          />
          <Text
            className={`text-base font-bold self-center pr-3 ${
              input ? "text-white" : "text-white/50"
            }`}
            onPress={handleClear}
          >
            Clear
          </Text>
        </View>
      </View>
      {error ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-600 text-lg">{error}</Text>
        </View>
      ) : search ? (
        loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={"large"} color={"#00C853"} />
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
              <View className="pt-5 px-5">
                <SearchCard item={item} loading={loading} />
              </View>
            )}
          />
        )
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-3xl text-white">Start search anime</Text>
        </View>
      )}
    </View>
  );
};

export default Search;
