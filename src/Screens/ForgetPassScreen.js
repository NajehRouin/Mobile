import React, {useState} from 'react';
import {View, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {TextInput, Button, Text, useTheme} from 'react-native-paper';

import {API_BASE_URL} from '@env';

const ForgetPassScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    email: '',
  });

  const validateInputs = () => {
    let isValid = true;
    let errors = {
      email: '',
    };
    // Validation pour le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "L'email n'est pas valide.";
      isValid = false;
    }
    setErrors(errors);
    return isValid;
  };
  const handleSendMail = async () => {
    if (!validateInputs()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/forgetpass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email}),
      });

      const result = await response.json();
      if (response.status === 302) {
        // Show toast or alert based on the message returned

        setErrors(prevState => ({
          ...prevState,
          email: result.msg,
        }));
      }
      if (response.status === 201) {
        Alert.alert(
          result?.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.error('An error occurred:', error);
      Alert.alert('Network Error', 'Please try again later.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier mot de passe</Text>
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

      <Button
        mode="contained"
        onPress={handleSendMail}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Valider
      </Button>
    </View>
  );
};

export default ForgetPassScreen;

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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
