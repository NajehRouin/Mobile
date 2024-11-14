import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {API_BASE_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const AnalyseScreen = () => {
  const [analyses, SetAnalyses] = useState([]);
  const navigation = useNavigation();

  const fetchAnalyses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/analyse-user`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const result = await response.json();
      if (result.success === true) {
        SetAnalyses(result.data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [analyses]);

  const renderProjectItem = ({item}) => (
    <View style={styles.projectCard}>
      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle}>{item.projet}</Text>
        <Text style={styles.projectType}>{item.typeAnalyse}</Text>
        <Text style={styles.prix}>{item.prixTotal}DT</Text>

        <Text
          style={[
            item?.paimentStatus
              ? styles.paimentStatusTrue
              : styles.paimentStatusFalse,
          ]}>
          {' '}
          {item?.paimentStatus ? 'accepter' : 'Non'}
        </Text>

        <Text style={styles.projectDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => {
            navigation.navigate('detailAnalyse', {item});
          }}>
          <Icon name="eye" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Nav')}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.ViewAnalyse}>
        <Text style={styles.textAnalyse}>Mes Analyses</Text>
      </View>
      <FlatList
        data={analyses}
        renderItem={renderProjectItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default AnalyseScreen;

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
  ViewAnalyse: {
    alignContent: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
  },
  textAnalyse: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000000',
  },
  projectCard: {
    marginBottom: 20,
    padding: 30,
    backgroundColor: '#f4f4f4',
    borderRadius: 15,
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
  eyeIcon: {
    marginLeft: 10,
  },
  projectTitle: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
    marginLeft: 3,
    marginRight: 5,
  },
  projectType: {
    fontSize: 10,
    color: '#555',
    fontWeight: 'bold',
  },

  paimentStatusTrue: {
    fontSize: 10,
    color: 'green',
    fontWeight: 'bold',
    marginRight: 5,
  },

  paimentStatusFalse: {
    fontSize: 10,
    color: 'red',
    fontWeight: 'bold',
    marginRight: 5,
  },

  prix: {
    fontSize: 10,
    color: '#555',
    fontWeight: 'bold',
    marginLeft: 3,
    marginRight: 5,
  },
  projectDate: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
  },
  flatListContent: {
    flex: 1,
    paddingBottom: 20,
    marginTop: 30,
    alignContent: 'center',
    alignItems: 'center',
  },
});
