import { View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Image } from "expo-image";

export default function TabLayout() {
  return (
    <View className="flex-1 bg-[#171717]">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#00C853",
          tabBarInactiveTintColor: "#B0B0B0",
          tabBarStyle: {
            backgroundColor: "#212121",
            height: 70,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, focused }) => {
              return (
                <Image
                  source={
                    focused
                      ? require("../../assets/icons/home-focused.png")
                      : require("../../assets/icons/home.png")
                  }
                  style={{ width: 28, height: 28, tintColor: color, top: 1 }}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color, focused }) => {
              return (
                <Image
                  source={
                    focused
                      ? require("../../assets/icons/search-focused.png")
                      : require("../../assets/icons/search.png")
                  }
                  style={{ width: 28, height: 28, tintColor: color, top: 1 }}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ color, focused }) => {
              return (
                <Image
                  source={
                    focused
                      ? require("../../assets/icons/explore-focused.png")
                      : require("../../assets/icons/explore.png")
                  }
                  style={{ width: 28, height: 28, tintColor: color, top: 1 }}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            tabBarIcon: ({ color, focused }) => {
              return (
                <Image
                  source={
                    focused
                      ? require("../../assets/icons/library-focused.png")
                      : require("../../assets/icons/library.png")
                  }
                  style={{ width: 28, height: 28, tintColor: color, top: 1 }}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color, focused }) => {
              return (
                <Image
                  source={
                    focused
                      ? require("../../assets/icons/settings-focused.png")
                      : require("../../assets/icons/settings.png")
                  }
                  style={{ width: 28, height: 28, tintColor: color, top: 1 }}
                />
              );
            },
          }}
        />
      </Tabs>
    </View>
  );
}
