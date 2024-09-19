import { Client, Account, ID, Avatars, Databases, Query, Storage, ImageGravity } from 'react-native-appwrite'

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
const storage = new Storage(client)

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

    if (!currentUser) throw new Error('User not found')
    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }
}

export const getAllPosts = async () => {
  const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
    Query.orderDesc('$createdAt'),
  ])
  return posts.documents
}

export const getLatestPosts = async () => {
  const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
    Query.orderDesc('$createdAt'),
    Query.limit(7),
  ])
  return posts.documents
}

export const searchPosts = async (query: string) => {
  const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
    Query.search('title', query),
  ])
  return posts.documents
}

export const getUserPosts = async (userId?: string) => {
  if (!userId) return []
  const posts = await databases.listDocuments(config.databaseId, config.videoCollectionId, [
    Query.equal('creator', userId),
  ])
  return posts.documents
}

export const signOut = async () => {
  const session = await account.deleteSession('current')
  return session
}

export type FileData = {
  name: string
  type: string
  size: number
  uri: string
}

export type CreateForm = {
  title: string
  prompt: string
  video?: FileData
  thumbnail?: FileData
}

export type MediaType = 'image' | 'video'

export const getFilePreview = (id: string, mediaType: MediaType) => {
  return mediaType === 'video'
    ? storage.getFileView(config.storageId, id)
    : storage.getFilePreview(config.storageId, id, 2000, 2000, ImageGravity.Top, 100)
}

export const uploadFile = async (fileData: FileData, mediaType: MediaType) => {
  const uploaded = await storage.createFile(config.storageId, ID.unique(), fileData)
  return getFilePreview(uploaded.$id, mediaType)
}

export const createVideo = async (userId: string, form: Required<CreateForm>) => {
  const [thumbnailUrl, videoUrl] = await Promise.all([
    uploadFile(form.thumbnail, 'image'),
    uploadFile(form.video, 'video'),
  ])

  return await databases.createDocument(config.databaseId, config.videoCollectionId, ID.unique(), {
    title: form.title,
    thumbnail: thumbnailUrl,
    video: videoUrl,
    prompt: form.prompt,
    creator: userId,
  })
}
