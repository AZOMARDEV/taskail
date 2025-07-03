import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Calendar,
  Link2,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react-native";

interface ProjectCardProps {
  projectName: string;
  progress: number;
  date: string;
  comments: number;
  links: number;
  onPress?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  projectName = "Gaming Platform",
  progress = 78,
  date = "June 18, 2022",
  comments = 16,
  links = 9,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      className="bg-white rounded-xl p-4 mb-4 mx-2 h-auto min-h-80 w-80"
    >
      {/* Header section with project name and more button */}
      <View className="mb-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-start flex-1 mr-2">
            <View className="w-10 h-10 bg-teal-500 rounded-full items-center justify-center flex-shrink-0">
              {/* Icon or content */}
            </View>
            <View className="flex-1 px-3">
              <Text
                className="text-black font-bold text-[16px] flex-wrap"
                numberOfLines={2}
              >
                {projectName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => console.log("More")}
            className="flex-shrink-0"
          >
            <View className="border-[0.5px] rounded-lg p-1">
              <MoreHorizontal color="gray" size={15} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Metadata badges */}
      <View className="flex-row flex-wrap gap-3 mb-4">
        <View className="flex-row items-center bg-gray-100 rounded-full px-3 py-1">
          <Calendar color="gray" size={17} />
          <Text className="text-gray-500 text-[10px] ml-1">{date}</Text>
        </View>
        <View className="flex-row items-center bg-gray-100 rounded-full px-3 py-1">
          <MessageCircle color="gray" size={14} />
          <Text className="text-gray-500 text-[10px] ml-1">{comments}</Text>
        </View>
        <View className="flex-row items-center bg-gray-100 rounded-full px-3 py-1">
          <Link2 color="gray" size={17} />
          <Text className="text-gray-500 text-[10px] ml-1">{links}</Text>
        </View>
      </View>

      {/* Image placeholder */}
      <View className="mb-4">
        <View className="w-full h-40 bg-neutral-300 rounded-xl" />
      </View>

      {/* Footer with avatars and progress */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="flex-row items-center justify-center">
            <View className="w-9 h-9 bg-neutral-300 border-[0.5px] border-white rounded-full" />
            <View className="w-9 h-9 bg-neutral-300 border-[0.5px] -ml-3 border-white rounded-full" />
            <View className="w-9 h-9 bg-neutral-300 border-[0.5px] -ml-3 border-white rounded-full" />
          </View>
        </View>
        <View className="flex-1 ml-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 text-[12px]">Progress</Text>
            <Text className="text-gray-500 text-[12px]">{progress}%</Text>
          </View>
          <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-400"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectCard;