import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env';
import * as ImagePicker from 'react-native-image-picker';
import {TextInput, Button} from 'react-native-paper';
import {AuthContext} from '../context/AuthContext';
const ProfileScreen = ({navigation}) => {
  const {logout} = useContext(AuthContext);

  const [Photo, setPhoto] = useState();

  const [user, setUser] = useState({
    name: '',
    email: '',
    cin: '',
    numPhone: '',
    photo: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    cin: '',
    numPhone: '',
  });

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/currentUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const result = await response.json();
      if (result.success) {
        setUser(result.data);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const selectImage = async () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
        const formData = new FormData();
        formData.append('file', {
          uri: response.assets[0].uri,
          name: response.assets[0].fileName,
          type: response.assets[0].type,
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
          if (data.success) {
            setUser(prevState => ({
              ...prevState,
              photo: data.result.filename,
            }));
          }
        } catch (error) {
          console.error('An error occurred:', error);
          Alert.alert('Network Error', 'Please try again later.');
        }
      }
    });
  };

  const validateInputs = () => {
    let isValid = true;
    let errors = {
      name: '',
      email: '',
      cin: '',
      numPhone: '',
    };

    // Validation pour le nom
    if (user.name.trim() === '') {
      errors.name = 'Le nom est requis.';
      isValid = false;
    }

    // Validation pour le numéro CIN
    if (user.cin.length < 8) {
      errors.cin = 'Le numéro CIN doit contenir au moins 8 chiffres.';
      isValid = false;
    }

    // Validation pour le numéro de téléphone
    if (user.numPhone.length < 8) {
      errors.numPhone =
        'Le numéro de téléphone doit contenir au moins 8 chiffres.';
      isValid = false;
    }

    // Validation pour le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      errors.email = "L'email n'est pas valide.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const updateProfil = async () => {
    if (!validateInputs()) return;

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/updateProfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          name: user?.name,
          email: user?.email,
          cin: user?.cin,
          numPhone: user?.numPhone,
          photo: user?.photo,
        }),
      });
      const result = await response.json();

      if (response.status === 201) {
        Alert.alert(
          result?.message,
          '',
          [
            {
              text: 'OK',
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Voulez-vous vous déconnecter ?', // "Do you want to log out?"
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
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setUser(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
        {user.photo ? (
          <Image
            source={{
              uri: Photo?.uri || `${API_BASE_URL}${user.photo}`,
            }}
            style={styles.profileImage}
          />
        ) : (
          <Text>No Photo Available</Text>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <TextInput
          label="Nom"
          mode="outlined"
          style={styles.input}
          value={user.name}
          onChangeText={text => handleInputChange('name', text)}
        />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}

        <TextInput
          label="Email"
          style={styles.input}
          value={user.email}
          onChangeText={text => handleInputChange('email', text)}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <TextInput
          label="N°Cin"
          style={styles.input}
          value={user.cin}
          onChangeText={text => {
            if (/^\d*$/.test(text) && text.length <= 8) {
              handleInputChange('cin', text);
            }
          }}
          mode="outlined"
          keyboardType="numeric"
          maxLength={8}
        />
        {errors.cin ? <Text style={styles.errorText}>{errors.cin}</Text> : null}

        <TextInput
          label="N°Téléphone"
          style={styles.input}
          value={user.numPhone}
          onChangeText={text => {
            if (/^\d*$/.test(text) && text.length <= 8) {
              handleInputChange('numPhone', text);
            }
          }}
          mode="outlined"
          keyboardType="numeric"
          maxLength={8}
        />
        {errors.numPhone ? (
          <Text style={styles.errorText}>{errors.numPhone}</Text>
        ) : null}
      </View>

      <Button
        mode="contained"
        onPress={updateProfil}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Modifier Profile
      </Button>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.button}
        contentStyle={styles.buttonContent}>
        Déconnecter
      </Button>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  form: {
    marginBottom: 20,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
