import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import SettingsScreen from '../Screens/SettingsScreen';
import {Image} from 'react-native';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const icons = {
  home: require('../assets/home.png'),
  settings: require('../assets/settings.png'),
  profile: require('../assets/profile.png'),
};

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
           headerShown: false ,
          tabBarIcon: ({color, size}) => (
            <Image
              source={icons.home}
              style={{height: size, width: size}}
              tintColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false ,
          tabBarIcon: ({color, size}) => (
            <Image
              source={icons.settings}
              style={{height: size, width: size}}
              tintColor={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false ,
          tabBarIcon: ({color, size}) => (
            <Image
              source={icons.profile}
              style={{height: size, width: size}}
              tintColor={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
