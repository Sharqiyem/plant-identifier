import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { twMerge } from 'tailwind-merge';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  iconName,
  onPress,
  className,
  disabled,
  ...props
}) => (
  <TouchableOpacity
    testID="button"
    className={twMerge(
      'bg-primary rounded-lg px-6 py-3 flex-row justify-center items-center',
      className
    )}
    onPress={onPress}
    disabled={disabled}
    {...props}
  >
    <Ionicons testID="icon" name={iconName} size={22} color={Colors.text} />
    <Text className="text-foreground font-bold ml-2">{title}</Text>
  </TouchableOpacity>
);
