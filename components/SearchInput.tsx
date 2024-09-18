import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons, images } from '../constants'

type Props = {
  value: string
  otherStyles: string
  placeholder?: string
  keyboardType?: string
  handleChangeText: (text: string) => void
}

const SearchInput = ({ value, placeholder, handleChangeText, otherStyles, ...props }: Props) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View
      className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 
      rounded-2xl focus:border-secondary-100 items-center flex-row space-x-4"
    >
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
      />
      <TouchableOpacity>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput
