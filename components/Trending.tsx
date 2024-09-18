import { View, Text, FlatList } from 'react-native'
import React from 'react'

type Props = {
  posts: []
}

const Trending = ({ posts }: Props) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <Text className="text-3xl text-white">{item.id}</Text>}
      horizontal
    />
  )
}

export default Trending
