import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, PermissionsAndroid, Platform, Alert  } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';

import { API_BASE_URL } from '@env';
import axios from 'axios';


const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cin, setCin] = useState('');
  const [numPhone, setNumPhone] = useState('');
  const [password, setPassword] = useState('');
  const [photo,SetPhoto]=useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // State to store the selected image
  const theme = useTheme();

 





  const selectImage = async () => {
  
    
    ImagePicker.launchImageLibrary({ mediaType: 'photo' },async response => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri); // Set the selected image URI

        console.log("response.assets[0].uri",response.assets[0].fileName)
        const formData = new FormData();
        formData.append('file', {
          uri: response.assets[0].uri,
          name: response.assets[0].fileName, // Assurez-vous d'avoir une extension valide (.png, .jpg ou .jpeg)
          type: response.assets[0].type, // Mettez le type MIME de l'image sélectionnée
        });


        try {

          const response = await fetch(`${API_BASE_URL}/photo`, { 
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });
          const data = await response.json();
          if(data.success){
            SetPhoto(data.result.filename)
           
          }
      
        } catch (error) {
          console.error("An error occurred:", error);
          Alert.alert("Network Error", "Please try again later.");
        }
        

      }
    });
  };

  const handleRegister = async () => {
    try {
     
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email,cin, password,numPhone,photo}),
      });

      const result = await response.json();
      //console.log("result",response.status)
      if (response.status===302) {
    
        // Show toast or alert based on the message returned
        Alert.alert(result.msg);
     
      } else  {
        // Navigate to the next screen
      // navigation.navigate('Login');
      } 
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Network Error", "Please try again later.");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      {/* Circular Image Upload Area */}
      <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>+</Text> // Placeholder text
        )}
      </TouchableOpacity>

      <TextInput
        label="Nom"
        value={name}
        onChangeText={text => setName(text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        mode="flat"
        keyboardType="email-address"
        autoCapitalize="none"
      />
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
            color="#6200ee"
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <TextInput
        label="N°Cin"
        value={cin}
        onChangeText={text => {
          if (/^\d*$/.test(text) && text.length <= 8) {
            setCin(text);
          }
        }}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
        maxLength={8}
      />
      <TextInput
        label="N°Téléphone"
        value={numPhone}
        onChangeText={text => {
          if (/^\d*$/.test(text) && text.length <= 8) {
            setNumPhone(text);
          }
        }}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
        maxLength={8}
      />
      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        S'inscrire
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.Login}
        labelStyle={{ color: theme.colors.primary }}
      >
     Vous avez déjà un compte ? Se connecter
      </Button>
    </View>
  );
};

export default RegisterScreen;

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
  imageContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  imagePlaceholder: {
    fontSize: 40,
    color: '#777',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  Login:{
    marginTop: 10,
    alignSelf: 'center',
  }
});
