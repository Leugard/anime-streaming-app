import { View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

const StartPage = () => {
  useEffect(() => {
    setTimeout(() => {
      router.push("/(tabs)/home");
    }, 200);
  });

  return (
    <View className="flex-1 justify-center items-center bg-[#171717]">
      <StatusBar style="dark" />
      <ActivityIndicator size={"large"} />
    </View>
  );
};

export default StartPage;
