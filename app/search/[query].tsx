import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import { searchPosts } from '@/lib/appwrite'
import { Models } from 'react-native-appwrite'
import { useAppWrite } from '@/hooks/useAppWrite'
import VideoCard from '@/components/VideoCard'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, fetchData } = useAppWrite<Models.Document>(() => searchPosts(query as string))

  useEffect(() => {
    fetchData()
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-fulls">
      <View className="">
        <FlatList
          data={posts}
          keyExtractor={item => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <View className="my-6 px-4">
              <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
              <Text className="text-2xl font-psemibold text-white">{query}</Text>
              <View className="mt-6 mb-8">
                <SearchInput placeholder="Search for a video topic" initialValue={query as string} />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState title="No videos found" subtitle="The search query returned no results" />
          )}
          // refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  )
}

export default Search
