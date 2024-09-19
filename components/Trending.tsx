import { FlatList, TouchableOpacity, ImageBackground, Image } from 'react-native'
import React, { useState } from 'react'
import { Models } from 'react-native-appwrite'
import * as Animatable from 'react-native-animatable'
import { icons } from '@/constants'
import { Video, ResizeMode } from 'expo-av'

type TrendingItemProps = {
  activeItem: Models.Document
  item: Models.Document
}

const zoom = {
  in: {
    0: { opacity: 0.7, scale: 0.9 },
    1: { opacity: 1, scale: 1.1 },
  },
  out: {
    0: { opacity: 1, scale: 1.1 },
    1: { opacity: 0.7, scale: 0.9 },
  },
}

const TrendingItem = ({ activeItem, item }: TrendingItemProps) => {
  const [playing, setPlaying] = useState(false)

  return (
    <Animatable.View className="mr-5" duration={500} animation={activeItem.$id === item.$id ? zoom.in : zoom.out}>
      {playing ? (
        <Video
          source={{ uri: item.video }}
          resizeMode={ResizeMode.CONTAIN}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={status => status.isLoaded && status.didJustFinish && setPlaying(false)}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlaying(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

type Props = {
  posts: Models.Document[]
}

const Trending = ({ posts }: Props) => {
  const [activeItem, setActiveItem] = useState<Models.Document>(posts[2])

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.$id}
      renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
      onViewableItemsChanged={({ viewableItems }) => {
        if (viewableItems.length) {
          setActiveItem(viewableItems[0].item)
        }
      }}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
    />
  )
}

export default Trending
