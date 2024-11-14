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
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
const DemandeSceen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: '',
    email: '',
    cin: '',
    numPhone: '',
    photo: '',
  });
  const [selectedValue, setSelectedValue] = useState(null);
  const [matiers, setMatiers] = useState([]);
  const [components, SetComponents] = useState([]);
  const [demande, setDemande] = useState({
    adresse: '',
    projet: '',
    objectif: '',
    typeAnalyse: '',
    analyses: [],
  });
  const [selectedItems, setSelectedItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const handleCheckboxChange = (id, item) => {
    setSelectedItems(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));

    setDemande(prevState => {
      const isSelected = !selectedItems[id];
      const updatedAnalyses = isSelected
        ? [...prevState.analyses, {nom: item.nom, prix: item.prix}]
        : prevState.analyses.filter(analysis => analysis.nom !== item.nom);

      return {
        ...prevState,
        analyses: updatedAnalyses,
      };
    });

    setTotalPrice(prevTotal =>
      selectedItems[id] ? prevTotal - item.prix : prevTotal + item.prix,
    );
  };

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

  const getAllMatier = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/matiere`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        setMatiers(result.data);
        setSelectedItems(
          result.data.reduce((acc, item) => ({...acc, [item._id]: false}), {}),
        );
      }
    } catch (error) {
      console.error('Error fetching matiere data', error);
    }
  };

  const getAllComponent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/regroupeComponet`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        SetComponents(result.data);
      }
    } catch (error) {
      console.error('Error fetching matiere data', error);
    }
  };
  useEffect(() => {
    fetchUserData();
    getAllMatier();
    getAllComponent();
  }, []);

  const [errors, setErrors] = useState({
    adresse: '',
    projet: '',
    objectif: '',
    typeAnalyse: '',
    analyses: '',
  });

  const handleInputChange = (field, value) => {
    setDemande(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };
  const validateInputs = () => {
    let isValid = true;
    let errors = {
      adresse: '',
      projet: '',
      objectif: '',
      typeAnalyse: '',
      analyses: '',
    };

    // Validation pour l'adresse
    if (demande.adresse.trim() === '') {
      errors.adresse = 'العنوان مطلوب';
      isValid = false;
    }

    // Validation pour le projet
    if (demande.projet.trim() === '') {
      errors.projet = 'المشروع مطلوب';
      isValid = false;
    }

    // Validation pour le objectif
    if (demande.objectif.trim() === '') {
      errors.objectif = 'الغرض مطلوب';
      isValid = false;
    }

    // Validation pour le type analyse
    if (demande.typeAnalyse.trim() === '') {
      errors.typeAnalyse = "type d'analyse est requis.";
      isValid = false;
    }

    // Validation pour les analyse
    if (demande.analyses.length === 0) {
      errors.analyses = 'إختر على الأقل تحليل';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const envoyerDemande = async () => {
    if (!validateInputs()) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/analyse`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          adresse: demande.adresse,
          projet: demande.projet,
          objectif: demande.objectif,
          typeAnalyse: demande.typeAnalyse,
          analyses: demande.analyses,
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
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={[1]} // A single item to allow scrolling for the entire layout
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollViewContent}
        renderItem={() => (
          <>
            <View style={styles.ViewDemande}>
              <Text style={styles.DemandeText}>Créez votre Demande</Text>
            </View>

            <View style={styles.form}>
              <TextInput
                label="الإسم"
                mode="outlined"
                style={styles.input}
                value={user.name}
                disabled={true}
              />

              <TextInput
                label="رقم ب.ت.و"
                style={styles.input}
                value={user.cin}
                disabled={true}
                mode="outlined"
                keyboardType="numeric"
                maxLength={8}
              />

              <TextInput
                label="رقم الهاتف "
                style={styles.input}
                value={user.numPhone}
                disabled={true}
                mode="outlined"
                keyboardType="numeric"
                maxLength={8}
              />

              <TextInput
                label="المكان"
                mode="outlined"
                style={styles.input}
                value={demande.adresse}
                onChangeText={text => handleInputChange('adresse', text)}
              />
              {errors.adresse ? (
                <Text style={styles.errorText}>{errors.adresse}</Text>
              ) : null}

              <TextInput
                label="المشروع"
                mode="outlined"
                style={styles.input}
                value={demande.projet}
                onChangeText={text => handleInputChange('projet', text)}
              />
              {errors.projet ? (
                <Text style={styles.errorText}>{errors.projet}</Text>
              ) : null}

              <TextInput
                label="الغرض"
                mode="outlined"
                style={styles.input}
                value={demande.objectif}
                onChangeText={text => handleInputChange('objectif', text)}
              />
              {errors.objectif ? (
                <Text style={styles.errorText}>{errors.objectif}</Text>
              ) : null}

              <View style={styles.viewType}>
                <TouchableOpacity
                  style={styles.viewComplet}
                  onPress={() => {
                    setSelectedValue('complete');
                    setDemande(prevState => ({
                      ...prevState,
                      typeAnalyse: 'analyse complete',
                      analyses: [],
                    }));
                    setTotalPrice(0);
                    setErrors(prevState => ({
                      ...prevState,
                      analyses: '',
                    }));
                  }}>
                  <View style={styles.viewSelected}>
                    {selectedValue === 'complete' && (
                      <View style={styles.viewTextSelected} />
                    )}
                  </View>
                  <Text style={styles.textSelected}>Analyse complète</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.viewComplet}
                  onPress={() => {
                    setSelectedValue('non_complete');
                    setDemande(prevState => ({
                      ...prevState,
                      typeAnalyse: 'analyse incomplete',
                      analyses: [],
                    }));
                    setSelectedItems(prevState => {
                      const resetItems = {};
                      for (const key in prevState) {
                        resetItems[key] = false;
                      }
                      return resetItems;
                    });
                    setTotalPrice(0);
                    setErrors(prevState => ({
                      ...prevState,
                      analyses: '',
                    }));
                  }}>
                  <View style={styles.viewSelected}>
                    {selectedValue === 'non_complete' && (
                      <View style={styles.viewTextSelected} />
                    )}
                  </View>
                  <Text style={styles.textSelected}>Analyse non complète</Text>
                </TouchableOpacity>
              </View>

              {selectedValue === 'complete' && (
                <FlatList
                  data={matiers}
                  keyExtractor={item => item._id}
                  renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                      <CheckBox
                        value={selectedItems[item._id]}
                        onValueChange={() =>
                          handleCheckboxChange(item._id, item)
                        }
                        tintColors={{
                          true: 'green',
                          false: 'black',
                        }}
                      />
                      <Text style={styles.itemText}>
                        {item.nom} - {item.prix} TND
                      </Text>
                    </View>
                  )}
                  horizontal
                />
              )}

              {selectedValue === 'non_complete' && (
                <FlatList
                  data={components}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <View style={styles.matiereContainer}>
                      <Text style={styles.matiereText}>{item.matiere}</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{marginRight: 10}}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          {item.items.map(itemComponent => (
                            <View
                              key={itemComponent.index}
                              style={styles.itemContainerNonComplet}>
                              <CheckBox
                                value={selectedItems[itemComponent.index]}
                                onValueChange={() =>
                                  handleCheckboxChange(
                                    itemComponent.index,
                                    itemComponent,
                                  )
                                }
                                tintColors={{
                                  true: 'green',
                                  false: 'black',
                                }}
                              />
                              <Text style={styles.itemText}>
                                {itemComponent.nom} - {itemComponent.prix} TND
                              </Text>
                            </View>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                />
              )}

              {errors.analyses ? (
                <Text style={styles.errorText}>{errors.analyses}</Text>
              ) : null}

              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.totalPriceText}>
                  Total: {totalPrice} TND
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={envoyerDemande}
                style={styles.button}
                contentStyle={styles.buttonContent}>
                Envoyer
              </Button>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default DemandeSceen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1, // Permet au ScrollView de grandir et d'occuper tout l'espace disponible
    paddingBottom: 20, // Ajoute un petit espace en bas du contenu
  },
  ViewDemande: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  ViewDemandeNonComplete: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  DemandeText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 5,
    backgroundColor: '#ffffff',
  },
  viewType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  viewComplet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  viewSelected: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  viewTextSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  textSelected: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  itemContainerNonComplet: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  itemText: {
    marginLeft: 5,
    color: '#333',
  },
  totalPriceText: {
    marginTop: 10,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },

  matiereContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  matiereText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
