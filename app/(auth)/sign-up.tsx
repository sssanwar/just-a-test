import { Text, ScrollView, Image, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '@/constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

export type Form = {
  username: string
  email: string
  password: string
}

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUser, setIsLoggedIn } = useGlobalContext()

  const [form, setForm] = useState<Form>({
    username: '',
    email: '',
    password: '',
  })

  const submit = async () => {
    if (!form.username || !form.password || !form.email) {
      Alert.alert('Error', 'Please fill in all the fields')
    }

    setIsSubmitting(true)

    try {
      const user = await createUser(form.email, form.password, form.username)
      setUser(user)
      setIsLoggedIn(true)
      router.replace('/home')
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} resizeMode="contain" className="w-[115px] h-[35px]" />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign up to Aora</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={e => setForm({ ...form, username: e.trim() })}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={e => setForm({ ...form, email: e.trim() })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={e => setForm({ ...form, password: e.trim() })}
            otherStyles="mt-7"
            isPassword={true}
          />
          <CustomButton title="Sign In" handlePress={submit} containerStyles="mt-7" isLoading={isSubmitting} />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Have an account already?</Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
