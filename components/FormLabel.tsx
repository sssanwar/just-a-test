import { Text } from 'react-native'
import React from 'react'

type Props = {
  title: string
  className?: string
}

const FormLabel = ({ title, className }: Props) => {
  return <Text className={`text-base text-gray-100 font-pmedium ${className}`}>{title}</Text>
}

export default FormLabel
