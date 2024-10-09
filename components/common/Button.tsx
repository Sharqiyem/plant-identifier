import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends TouchableOpacityProps {
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
