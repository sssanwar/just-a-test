import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import SearchInput from '@/components/SearchInput'
import Trending from '@/components/Trending'
import EmptyState from '@/components/EmptyState'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import { Models } from 'react-native-appwrite'
import { useAppWrite } from '@/hooks/useAppWrite'
import VideoCard from '@/components/VideoCard'
import { useGlobalContext } from '@/context/GlobalProvider'

const Home = () => {
  const [refreshing, setRefreshing] = useState(false)
  const { user } = useGlobalContext()
  const { data: posts, fetchData } = useAppWrite<Models.Document>(getAllPosts)
  const { data: latestPosts } = useAppWrite<Models.Document>(getLatestPosts)

  const onRefresh = async () => {
    setRefreshing(true)
    fetchData()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="">
        <FlatList
          data={posts}
          keyExtractor={item => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
              <View className="justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-gray-100">Welcome back,</Text>
                  <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
                </View>
                <View className="mt-1.5">
                  <Image source={images.logoSmall} className="w-9 h-10" resizeMode="contain" />
                </View>
              </View>
              <SearchInput placeholder="Search for a video topic" />
              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>
                <Trending posts={latestPosts} />
              </View>
            </View>
          )}
          ListEmptyComponent={() => <EmptyState title="No videos found" subtitle="Be the first one to upload video" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
    </SafeAreaView>
  )
}

export default Home
