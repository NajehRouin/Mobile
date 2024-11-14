// UserCard.js
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const UserCard = ({user, API_BASE_URL}) => {
  return (
    <View style={styles.card}>
      {/* User's photo */}
      {user.photo ? (
        <Image
          source={{uri: API_BASE_URL + user.photo}}
          style={styles.profilePhoto}
        />
      ) : (
        <View style={styles.profilePlaceholder}></View> // Placeholder if no photo
      )}

      {/* User's name and email */}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,

    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  userEmail: {
    fontSize: 16,
    color: 'white',
  },
});

export default UserCard;
