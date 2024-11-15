import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env';
import {TextInput, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [nvPassword, SetNvPassWord] = useState('');
  const [configPassWord, SetConfigPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    password: '',
    nvPassword: '',
    configPassWord: '',
    validation: '',
  });

  const validateInputs = () => {
    let isValid = true;
    let errors = {
      password: '',
      nvPassword: '',
      configPassWord: '',
      validation: '',
    };

    if (password.trim() === '') {
      errors.password = 'Le mot de passe est requis.';
      isValid = false;
    }

    if (nvPassword.trim() === '') {
      errors.nvPassword = 'Nouveau mot de passe est requis.';
      isValid = false;
    }

    if (configPassWord.trim() === '') {
      errors.configPassWord = 'Confirmation du nouveau mot de passeest requis.';
      isValid = false;
    }

    if (nvPassword !== configPassWord) {
      errors.validation =
        'le nouveau mot de passe et la confirmation du nouveau mot de passe sont différents ';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSend = async () => {
    if (!validateInputs()) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/updatePassWord`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          password: password,
          nvPassword: nvPassword,
        }),
      });
      const result = await response.json();

      if (response.status === 201) {
        Alert.alert(
          result?.message,
          '',
          [
            {
              text: 'Annuler', // "Cancel" button
              style: 'cancel',
            },
            {
              text: 'OK', // "OK" button to confirm logout
              onPress: async () => {
                await AsyncStorage.removeItem('token');
                // Reset navigation stack and navigate to Login
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              },
            },
          ],
          {cancelable: true},
        );
      }
      if (response.status === 302) {
        setErrors(prevState => ({
          ...prevState,
          password: result.msg,
        }));
      }
    } catch (error) {
      console.error('An error occurred:', error);
      Alert.alert('Network Error', 'Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.ViewModiferPass}>
        <Text style={styles.textPasse}>Modifier Mot de passe</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          label="Ancien mot de passe"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showPassword}
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <TextInput
          label="Nouveau mot de passe"
          value={nvPassword}
          onChangeText={text => SetNvPassWord(text)}
          style={styles.input}
          mode="outlined"
        />
        {errors.nvPassword ? (
          <Text style={styles.errorText}>{errors.nvPassword}</Text>
        ) : null}

        <TextInput
          label="Confirmation du nouveau mot de passe"
          value={configPassWord}
          onChangeText={text => SetConfigPassword(text)}
          style={styles.input}
          mode="outlined"
        />
        {errors.configPassWord ? (
          <Text style={styles.errorText}>{errors.configPassWord}</Text>
        ) : null}

        {errors.validation ? (
          <Text style={styles.errorText}>{errors.validation}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSend}
          style={styles.button}
          contentStyle={styles.buttonContent}>
          Modifier Mot de Passe
        </Button>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  ViewModiferPass: {
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
  },
  textPasse: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000',
  },
  form: {
    marginTop: '20%',
    marginBottom: 20,
    padding: 20,
  },

  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff', // Couleur de fond du champ de saisie
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 5,
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
