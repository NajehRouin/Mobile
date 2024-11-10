import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/Screens/WelcomeScreen';
import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import MainTabs from './src/navigation/MainTabs';
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={LoginScreen}
      options={{ headerShown: false }}
      />

<Stack.Screen name="Register" component={RegisterScreen}
      options={{ headerShown: false }}
      />

<Stack.Screen name="Nav" component={MainTabs}
      options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})