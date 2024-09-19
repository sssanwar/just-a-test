import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import FormField from '@/components/FormField'
import { ResizeMode, Video } from 'expo-av'
import { icons } from '@/constants'
import FormLabel from '@/components/FormLabel'
import CustomButton from '@/components/CustomButton'
import { MediaTypeOptions, launchImageLibraryAsync } from 'expo-image-picker'
import { router } from 'expo-router'
import { CreateForm, createVideo, MediaType } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const initialFormData: CreateForm = { title: '', prompt: '' }

const Create = () => {
  const { user } = useGlobalContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<CreateForm>(initialFormData)

  const openPicker = async (mediaType: MediaType) => {
    const result = await launchImageLibraryAsync({
      mediaTypes: mediaType === 'image' ? MediaTypeOptions.Images : MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      if (!asset.fileName || !asset.mimeType || !asset.fileSize) {
        return Alert.alert('Error', 'Incomplete image file metadata')
      }
      const file = { name: asset.fileName, type: asset.mimeType, size: asset.fileSize, uri: asset.uri }
      const propName = mediaType === 'image' ? 'thumbnail' : 'video'
      setForm({ ...form, [propName]: file })
    }
  }

  const submit = async () => {
    if (!user) return Alert.alert('Error', 'User not available')
    if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
      return Alert.alert('Submit Failed', 'Please fill in all the fields.')
    }

    setUploading(true)

    try {
      await createVideo(user.$id, form as Required<CreateForm>)
      Alert.alert('Success', 'Post created successfully.')
      router.push('/home')
    } catch (err: any) {
      Alert.alert('Error', err.message)
      setForm(initialFormData)
      setUploading(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          handleChangeText={e => setForm({ ...form, title: e })}
          placeholder="Give your video a catchy title..."
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <FormLabel title="Upload Video" />
          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image source={icons.upload} className="w-1/2 h-1/2" resizeMode="contain" />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <FormLabel title="Thumbnail Image" />
          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image source={{ uri: form.thumbnail.uri }} resizeMode="cover" className="w-full h-64 rounded-2xl" />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image source={icons.upload} className="w-5 h-5" resizeMode="contain" />
                <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          handleChangeText={e => setForm({ ...form, prompt: e })}
          placeholder="The prompt used to create this video"
          otherStyles="mt-7"
        />
        <CustomButton title="Submit & Publish" handlePress={submit} containerStyles="mt-7" isLoading={uploading} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create
