import { Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { genre, order, status, type } from "@/utils/filter";
import { Dropdown } from "react-native-element-dropdown";
import { FlatList } from "react-native-gesture-handler";

interface filterProps {
  filters: {
    type: string;
    order: string;
    status: string;
    page: number;
    genre: string[];
  };
  updateFilter: (key: any, value: any) => void;
  onClose: () => void;
  ref: any;
}

const FilterModal = ({ filters, updateFilter, onClose, ref }: filterProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const snapPoints = useMemo(() => ["60%"], []);

  const handleLocalFilterChange = (key: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" && { page: 1 }),
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre],
      page: 1,
    }));
  };

  const handleReset = () => {
    const resetFilters = {
      type: "",
      order: "title",
      status: "",
      page: 1,
      genre: [],
    };
    setLocalFilters(resetFilters);
  };

  const handleApply = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      updateFilter(key, value);
    });
    onClose();
  };

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose?.();
    },
    [onClose]
  );

  const renderGenreItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => handleGenreToggle(item)}
      className={`p-2 m-1 rounded-lg ${
        localFilters.genre.includes(item) ? "bg-green-600" : "bg-gray-700"
      }`}
      style={{ width: "32%" }}
    >
      <Text className="text-white text-center" numberOfLines={1}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: "#252525" }}
    >
      <BottomSheetView className="flex-1 bg-[#252525] p-4">
        <View className="flex-row justify-center">
          <Text className="text-white text-3xl font-bold">Filters</Text>
        </View>

        <View className="flex-1">
          <View className="mb-4">
            <Text className="text-white mb-2">Status</Text>
            <Dropdown
              data={status}
              labelField="label"
              valueField="value"
              value={localFilters.status}
              onChange={(item) => handleLocalFilterChange("status", item.value)}
              style={{ backgroundColor: "#333", borderRadius: 8, padding: 12 }}
              placeholderStyle={{ color: "#888", fontSize: 16 }}
              selectedTextStyle={{ color: "white", fontSize: 16 }}
              itemTextStyle={{ color: "white" }}
              containerStyle={{
                backgroundColor: "#333",
                borderColor: "#444",
                borderRadius: 8,
              }}
              activeColor="#444"
              placeholder="Select Status"
            />
          </View>

          <View className="mb-4">
            <Text className="text-white mb-2">Type</Text>
            <Dropdown
              data={type}
              labelField="label"
              valueField="value"
              value={localFilters.type}
              onChange={(item) => handleLocalFilterChange("type", item.value)}
              style={{
                backgroundColor: "#333",
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: "#444",
              }}
              placeholderStyle={{ color: "#888", fontSize: 16 }}
              selectedTextStyle={{ color: "white", fontSize: 16 }}
              itemTextStyle={{ color: "white" }}
              containerStyle={{
                backgroundColor: "#333",
                borderColor: "#444",
                borderRadius: 8,
                overflow: "hidden",
                marginTop: 4,
              }}
              activeColor="#444"
              placeholder="Select Type"
            />
          </View>

          <View className="mb-4">
            <Text className="text-white mb-2">Sort By</Text>
            <Dropdown
              data={order}
              labelField="label"
              valueField="value"
              value={localFilters.order}
              onChange={(item) => handleLocalFilterChange("order", item.value)}
              style={{
                backgroundColor: "#333",
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: "#444",
              }}
              placeholderStyle={{ color: "#888", fontSize: 16 }}
              selectedTextStyle={{ color: "white", fontSize: 16 }}
              itemTextStyle={{ color: "white" }}
              containerStyle={{
                backgroundColor: "#333",
                borderColor: "#444",
                borderRadius: 8,
                overflow: "hidden",
                marginTop: 4,
              }}
              activeColor="#444"
              placeholder="Select Type"
            />
          </View>

          <View className="flex-1">
            <Text className="text-white mb-2">Genres</Text>
            <FlatList
              data={genre}
              renderItem={renderGenreItem}
              keyExtractor={(item) => item}
              numColumns={3}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<View className="pt-2" />}
              ListFooterComponent={<View className="pb-8" />}
            />
          </View>
        </View>
        <View className="absolute bottom-0 left-0 right-0 bg-[#252525] p-4 border-t border-gray-700">
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handleReset}
              className="px-6 py-2 bg-red-600 rounded-lg"
            >
              <Text className="text-white">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="px-6 py-2 bg-green-600 rounded-lg"
            >
              <Text className="text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default FilterModal;
