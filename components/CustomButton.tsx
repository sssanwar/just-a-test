import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native'
import React from 'react'

type Props = {
  title: string
  handlePress: (event: GestureResponderEvent) => void
  containerStyles: string
  textStyles?: string
  isLoading?: boolean
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton
