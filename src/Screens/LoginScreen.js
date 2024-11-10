import React, { useState } from 'react';
import { View, StyleSheet,Alert ,NativeModules  } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleLogin = async () => {
    try {
     
      const response = await fetch(`${API_BASE_URL}/login-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email:email, password:password }),
      });

      const result = await response.json();

      if (response.status === 302) {
      
        // Show toast or alert based on the message returned
        Alert.alert(result.msg);
     
      } else if (response.status === 200) {
        // Login was successful
        
         const token = result.data; 
         await AsyncStorage.setItem('token', token);
     
        // Navigate to the next screen
       navigation.navigate('Nav');
      } else {
        Alert.alert("Login Error", "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Network Error", "Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
       
      />

      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        mode="outlined"
        secureTextEntry={!showPassword}
    
        right={
          <TextInput.Icon
            name={showPassword ? "eye-off" : "eye"}
            color="#6200ee" // Couleur de l'icône pour afficher/masquer le mot de passe
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />

      <Button
        mode="contained"
       onPress={handleLogin}
      // onPress={() => navigation.navigate('Nav')}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Se connecter
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.registerButton}
        labelStyle={{ color: theme.colors.primary }}
      >
        Créer un compte
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff', // Couleur de fond du champ de saisie
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default LoginScreen;