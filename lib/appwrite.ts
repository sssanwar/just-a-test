import SignIn from '@/app/(auth)/sign-in'
import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite'

const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.sssanwar.aora',
  projectId: '66eab80b0028de08d22d',
  databaseId: '66eab99b00204115b031',
  userCollectionId: '66eab9e400122f7a0053',
  videoCollectionId: '66eaba53001961031c3c',
  storageId: '66eabd5400297cfb2dfa',
}

// Init your React Native SDK
export const client = new Client()
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform) // Your application ID or bundle ID.

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email: string, password: string, username: string) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username)
    const avatar = avatars.getInitials(username)
    await signIn(email, password)
    return await databases.createDocument(config.databaseId, config.userCollectionId, ID.unique(), {
      accountId: newAccount.$id,
      email,
      username,
      avatar,
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

export const signIn = async (email: string, password: string) => {
  return await account.createEmailPasswordSession(email, password)
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get()
    if (!currentAccount) throw new Error('No current account found')

    const currentUser = await databases.listDocuments(config.databaseId, config.userCollectionId, [
      Query.equal('accountId', currentAccount.$id),
    ])

    if (!currentUser) throw Error
    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }
}
