import { View, Text, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Search = () => {
  const [search, setSearch] = useState("");
  const [anime, setAnime] = useState([]);
  console.log(search);
  console.log(anime);

  useEffect(() => {
    const fetchSearch = async () => {
      const res = await axios.get(
        `http://localhost:5001/api/v1/anime/search/${search}`
      );
      if (res.data.success) {
        setAnime(res.data.data);
      }
    };

    fetchSearch();
  }, [search]);

  return (
    <View className="flex-1 bg-[#171717]">
      <View className="pt-16 px-5">
        <TextInput
          className="w-full h-[40px] bg-[#252525] text-white text-base pl-11 px-2 rounded-md"
          placeholder="Search..."
          placeholderTextColor={"#B0B0B0"}
          onChangeText={(e) => setSearch(e)}
          value={search}
        />
        <View className="absolute top-[60px] pl-6">
          <Ionicons
            name="search-outline"
            size={30}
            color={"#B0B0B0"}
            className=""
          />
        </View>
      </View>
    </View>
  );
};

export default Search;
