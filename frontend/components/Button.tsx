import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";

interface ButtonProps {
  color: string;
  title?: string;
  icon?: any;
}

const Button = ({ color, title, icon }: ButtonProps) => {
  return (
    <View>
      {title && (
        <TouchableOpacity
          className={`w-40 h-12 items-center justify-center rounded-md`}
          style={{ backgroundColor: color }}
        >
          <Text className="text-white font-bold text-[20px]">{title}</Text>
        </TouchableOpacity>
      )}
      {icon && (
        <TouchableOpacity
          className={`w-12 h-12 items-center justify-center rounded-md`}
          style={{ backgroundColor: color }}
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
