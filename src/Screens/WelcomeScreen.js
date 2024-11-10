import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
const logo=require('../assets/logo.jpg')
const WelcomeScreen = ({ navigation }) => {
    useEffect(() => {
        // Navigue vers l'écran de connexion après 3 secondes
        const timer = setTimeout(() => {
          navigation.navigate('Login');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
          <Image
            source={logo}
            style={styles.image}
          />
        </View>
      );
    };


export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    image: {
      width: 200,
      height: 250,
      resizeMode:'center',
    },
  });