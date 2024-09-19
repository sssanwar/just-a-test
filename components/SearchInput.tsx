import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'
import { router, usePathname } from 'expo-router'

type Props = {
  initialValue?: string
  value: string
  placeholder?: string
}

const SearchInput = ({ value, initialValue, placeholder }: Props) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialValue ?? '')

  return (
    <View
      className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 
      rounded-2xl focus:border-secondary-100 items-center flex-row space-x-4"
    >
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#cdcde0"
        onChangeText={e => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert('Missing query', 'Please enter search query')
          }
          if (pathname.startsWith('/search')) router.setParams({ query })
          else router.push(`/search/${query}`)
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput
