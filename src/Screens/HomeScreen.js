import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = () => {
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        console.log("Retrieved token:", token);
        return token;
      }
    } catch (error) {
      console.error("Error retrieving token", error);
    }
  };
  useEffect(()=>{
    getToken()
  },[])

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})