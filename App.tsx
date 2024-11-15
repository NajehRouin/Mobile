import React, {useContext, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {AuthProvider, AuthContext} from './src/context/AuthContext';
import WelcomeScreen from './src/Screens/WelcomeScreen';
import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import MainTabs from './src/navigation/MainTabs';
import DemandeSceen from './src/Screens/DemandeSceen';
import AnalyseScreen from './src/Screens/AnalyseScreen';
import ResultatScreen from './src/Screens/ResultatScreen';
import DetailAnalyseScreen from './src/Screens/DetailAnalyseScreen';
import ForgetPassScreen from './src/Screens/ForgetPassScreen';

// Define the types for each screen in the navigator
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  forgetpass: undefined;
  Nav: undefined;
  demande: undefined;
  analyse: undefined;
  resultat: undefined;
  detailAnalyse: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const {token} = useContext(AuthContext);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!token) {
      // Redirect to Login if token does not exist
      navigation.navigate('Login');
    }
  }, [token, navigation]);

  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="forgetpass"
        component={ForgetPassScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Nav"
        component={MainTabs}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="demande"
        component={DemandeSceen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="analyse"
        component={AnalyseScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="resultat"
        component={ResultatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="detailAnalyse"
        component={DetailAnalyseScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
