import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
const demande = require('../assets/demande.png');
const historique = require('../assets/historique.png');

const Card = ({navigation}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardView}
        onPress={() => {
          navigation.navigate('demande');
        }}>
        <View style={styles.viewImage}>
          <Image source={demande} style={styles.image} />
        </View>
        <Text style={styles.textDemande}>Demande </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cardView}
        onPress={() => {
          navigation.navigate('analyse');
        }}>
        <View style={styles.viewImage}>
          <Image source={historique} style={styles.image} />
        </View>
        <Text style={styles.textDemande}>Historique </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 1,
    marginTop: -40,
  },
  cardView: {
    backgroundColor: '#FBFBFB',
    height: 150,
    width: '30%',
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },

  viewImage: {
    marginTop: 10,
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8CACD3',
  },
  image: {
    width: 50,
    height: 50,
  },

  textDemande: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
});
