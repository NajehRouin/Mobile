import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {API_BASE_URL} from '@env';

const Information = ({data}) => {
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.viewImage}>
        <ImageBackground
          source={{uri: API_BASE_URL + item.photo}}
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.ViewContenu}>
          <Text style={styles.title}>{item.contenu}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Information;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    paddingVertical: 5,
  },
  card: {
    flexDirection: 'column',
    width: 220,
    height: 340,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
  },
  viewImage: {
    width: '100%',
    height: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  ViewContenu: {
    marginTop: 20,
    marginBottom: -10,
  },
});
