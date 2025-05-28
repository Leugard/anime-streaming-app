import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";

interface ButtonProps {
  color: string;
  title?: string;
  icon?: any;
  width?: number;
  height?: number;
  onPress: () => void;
}

const Button = ({
  color,
  title,
  icon,
  width,
  height,
  onPress,
}: ButtonProps) => {
  return (
    <View>
      {title && (
        <TouchableOpacity
          className={`items-center justify-center rounded-md`}
          style={{ backgroundColor: color, width: width, height: height }}
          onPress={onPress}
        >
          <Text className="text-white font-bold text-[20px]">{title}</Text>
        </TouchableOpacity>
      )}
      {icon && (
        <TouchableOpacity
          className={`items-center justify-center rounded-md`}
          style={{ backgroundColor: color, width: width, height: height }}
          onPress={onPress}
        >
          <Image
            source={icon}
            style={{ width: 22, height: 22, tintColor: "#fff" }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Button;
