import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

type Props = {
  title: string
  value: string
  otherStyles: string
  placeholder?: string
  keyboardType?: string
  isPassword?: boolean
  handleChangeText: (text: string) => void
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  isPassword,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View
        className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 
      rounded-2xl focus:border-secondary-100 items-center flex-row"
      >
        <TextInput
          className="flex-1 text-white font-psemibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={isPassword && !showPassword}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
