import React, {useState} from 'react';
import {View, StyleSheet, Alert, NativeModules} from 'react-native';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    validation: '',
  });

  const validateInputs = () => {
    let isValid = true;
    let errors = {
      email: '',
      password: '',
    };

    if (password.trim() === '') {
      errors.password = 'Le mot de pass  est requis.';
      isValid = false;
    }
    // Validation pour le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "L'email n'est pas valide.";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/login-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, password: password}),
      });

      const result = await response.json();

      if (response.status === 302) {
        // Show toast or alert based on the message returned
        if (result.msg === 'email incorrect') {
          setErrors(prevState => ({
            ...prevState,
            email: result.msg,
          }));
        }
        if (result.msg === 'mot de passe incorrect') {
          setErrors(prevState => ({
            ...prevState,
            password: result.msg,
          }));
        } else {
          setErrors(prevState => ({
            ...prevState,
            validation: result.msg,
          }));
        }

        // Alert.alert(result.msg);
      } else if (response.status === 200) {
        // Login was successful

        const token = result?.accessToken;
        await AsyncStorage.setItem('token', token);

        // Navigate to the next screen
        navigation.navigate('Nav');
      } else {
        Alert.alert('Login Error', 'An unexpected error occurred.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      Alert.alert('Network Error', 'Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? (
        <Text style={styles.errorText}>{errors.email}</Text>
      ) : null}
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.input}
        mode="outlined"
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            name={showPassword ? 'eye-off' : 'eye'}
            color="#6200ee" // Couleur de l'icône pour afficher/masquer le mot de passe
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      {errors.password ? (
        <Text style={styles.errorText}>{errors.password}</Text>
      ) : null}

      {errors.validation ? (
        <Text style={styles.errorText}>{errors.validation}</Text>
      ) : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        // onPress={() => navigation.navigate('Nav')}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Se connecter
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.registerButton}
        labelStyle={{color: theme.colors.primary}}>
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
