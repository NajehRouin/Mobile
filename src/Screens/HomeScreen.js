import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL} from '@env';
import UserCard from '../Components/UserCard ';
import Information from '../Components/Information';
import Card from '../Components/Card';

const HomeScreen = ({navigation}) => {
  const [user, SetUser] = useState({
    name: '',
    email: '',
    cin: '',
    photo: '',
  });

  const [information, setInformations] = useState([]);
  const currentuser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/currentUser`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const result = await response.json();
      if (result.success === true) {
        SetUser(result.data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const fetchInformations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/information`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        setInformations(result.data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    currentuser();
    fetchInformations();
  }, [information]);

  return (
    <View style={styles.container}>
      {/* Upper Section with UserCard and Information components */}
      <View style={styles.upperSection}>
        <UserCard user={user} API_BASE_URL={API_BASE_URL} />
        <View style={styles.ViewRetrouvez}>
          <Text style={styles.textRetrouvez}>Retrouvez Vos Demandes Ici</Text>
        </View>
      </View>
      <Card navigation={navigation} />

      {/* Lower Section with Half Circle */}
      <View style={styles.ViewText}>
        <Text style={styles.textInformation}>Informations</Text>
      </View>
      <View style={styles.lowerSection}>
        <Information data={information} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },

  ViewRetrouvez: {
    alignContent: 'flex-start',
    textAlign: 'left',
    justifyContent: 'flex-start',
    marginStart: '-10%',
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
  },
  textRetrouvez: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },

  upperSection: {
    height: '32%', // Increase the height to form a half-circle effect
    backgroundColor: '#04BBFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,

    borderBottomEndRadius: 80, // Adjust radius for half-circle
    borderBottomStartRadius: 80, // Adjust radius for half-circle
  },
  lowerSection: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    // Smooth overlap with the upper section
  },
  textInformation: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#04BBFF',
  },
  ViewText: {
    alignContent: 'flex-start',
    textAlign: 'left',
    justifyContent: 'flex-start',
    marginBottom: 1,
    marginLeft: 10,
  },
  textAnalyse: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000',
  },
  ViewAnalyse: {
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  projectCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '95%',
  },
  projectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  projectTitle: {
    fontSize: 14,
    color: '#555',
  },
  projectType: {
    fontSize: 14,
    color: '#555',
  },
  projectDate: {
    fontSize: 12,
    color: '#888',
  },
  flatListContent: {
    paddingBottom: 20,
    marginTop: 30,
  },
});
