import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {API_BASE_URL} from '@env';
import * as ImagePicker from 'react-native-image-picker';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';

const DetailScreen = ({route}) => {
  const pdfUri = `${API_BASE_URL}${item?.resultatAnalyse}`;

  const navigation = useNavigation();
  const [fichierPaiment, setFichierPaiment] = useState();
  const {item} = route.params;
  const [selectedTab, setSelectedTab] = useState('paiement'); // default tab

  const selectImage = async () => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.assets && response.assets.length > 0) {
        setFichierPaiment(response.assets[0]);
      }
    });
  };

  const envoyerVirement = async () => {
    const formData = new FormData();
    formData.append('file', {
      uri: fichierPaiment?.uri,
      name: fichierPaiment?.fileName, // Assurez-vous d'avoir une extension valide (.png, .jpg ou .jpeg)
      type: fichierPaiment?.type, // Mettez le type MIME de l'image sélectionnée
    });
    try {
      const response = await fetch(`${API_BASE_URL}/paiement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/paiement-analyse`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            idAnalyse: item?._id,
            fichierPaiment: data.result.filename,
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
                onPress: () => navigation.navigate('analyse'),
              },
            ],
            {cancelable: false},
          );
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      Alert.alert('Network Error', 'Please try again later.');
    }
  };

  const renderContent = () => {
    if (selectedTab === 'paiement') {
      return (
        <View style={styles.content}>
          {item?.fichierPaiment != '' ? (
            <>
              <TouchableOpacity
                style={styles.imageUpload}
                onPress={selectImage}>
                <Image
                  source={{
                    uri:
                      fichierPaiment?.uri ||
                      `${API_BASE_URL}${item?.fichierPaiment}`,
                  }}
                  style={styles.image}
                />
              </TouchableOpacity>
              {fichierPaiment && (
                <Button
                  mode="contained"
                  onPress={envoyerVirement}
                  style={styles.button}
                  contentStyle={styles.buttonContent}>
                  Modifier
                </Button>
              )}
            </>
          ) : (
            <View>
              <TouchableOpacity
                onPress={selectImage}
                style={styles.imageUpload}>
                {fichierPaiment ? (
                  <>
                    <Image
                      source={{uri: fichierPaiment?.uri}}
                      style={styles.image}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.imagePlaceholder}>
                      Envoyer un virement
                    </Text>
                  </>
                  // Placeholder text
                )}
              </TouchableOpacity>
              {fichierPaiment && (
                <Button
                  mode="contained"
                  onPress={envoyerVirement}
                  style={styles.button}
                  contentStyle={styles.buttonContent}>
                  Envoyer
                </Button>
              )}
            </View>
          )}

          {/* Add paiement details here */}
        </View>
      );
    } else if (selectedTab === 'voirResultat') {
      return (
        <View style={styles.content}>
          {item?.resultatAnalyse !== '' ? (
            <>
              <Text style={styles.contentText}>
                Chargement des résultats d'analyse... !!
              </Text>
              <WebView
                source={{uri: `${API_BASE_URL}${item?.resultatAnalyse}`}}
                style={styles.webview}
                startInLoadingState={true} // Show loading indicator
                renderLoading={() => (
                  <ActivityIndicator
                    size="large"
                    color="black"
                    style={styles.loadingIndicator}
                  />
                )}
              />
            </>
          ) : (
            <Text style={styles.contentText}>Attends ton résultat</Text>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Top menu */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            selectedTab === 'paiement' && styles.activeMenuItem,
          ]}
          onPress={() => setSelectedTab('paiement')}>
          <Text
            style={[
              styles.menuText,
              selectedTab === 'paiement' && styles.activeMenuText,
            ]}>
            Paiement
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.menuItem,
            selectedTab === 'voirResultat' && styles.activeMenuItem,
          ]}
          onPress={() => setSelectedTab('voirResultat')}>
          <Text
            style={[
              styles.menuText,
              selectedTab === 'voirResultat' && styles.activeMenuText,
            ]}>
            Voir Résultat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on selected tab */}
      {renderContent()}
    </View>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#555',
  },
  activeMenuItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  activeMenuText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    width: '10%',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -25}, {translateY: -25}],
  },

  imageUpload: {
    alignSelf: 'center',
    width: 400,
    height: 200,
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
    fontSize: 20,
    color: '#777',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
