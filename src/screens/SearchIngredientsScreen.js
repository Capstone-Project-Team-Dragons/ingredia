import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button, Toast } from 'native-base';
import SearchBar from '../components/SearchBar';
import spoonacular from '../api/spoonacular';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { SPOON_API } from 'react-native-dotenv';
import RecipeList from '../components/RecipeList';
import { EvilIcons } from '@expo/vector-icons';

// Recipes Data for testing purpose, saved in json format inside the data.js file.
//import data from '../testData/recipeData';

const SearchIngredientsScreen = ({ navigation }) => {
  const [ingredients, setIngredients] = useState([]);
  const [currIngredient, setCurrIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);

  // Search Spoonacular API to retrieve the "Recipes List" (Array).
  const searchRecipesApi = async ingreds => {
    // If "Ingredients List" has some ingredients,
    if (ingreds.length > 0) {
      try {
        const { data } = await spoonacular.get(
          `/findByIngredients?apiKey=${SPOON_API}`,
          {
            params: {
              ingredients: ingreds.join(),
              number: 15,
              ranking: 2,
              ignorePantry: true,
            },
          }
        );
        setRecipes(data);
      } catch (error) {
        console.log('Error! ', error);
      }
    }
    // Else, if "Ingredients List" is empty, make "Recipes List" empty too.
    else {
      setRecipes([]);
    }
  };

  formatIngredientName = (ingredient) => {
    let formatted = ingredient[0].toUpperCase() + ingredient.slice(1);
    return formatted;
  }

  // A handler when an ingredient is submitted by user, either manually or by scanning barcode.
  const submitHandler = cIngredient => {
    let currItem;
    if(cIngredient !== '') {
      currItem = formatIngredientName(cIngredient.trim().toLowerCase());

      if (currItem.length > 0) {
        if (ingredients.includes(currItem)) {
          setCurrIngredient('');
        } else {
          setIngredients([...ingredients, currItem]);
          setCurrIngredient('');
        }
      }

    } else {
      Toast.show({
        text: `Please type in an ingredient, cannot be empty!`,
        buttonText: 'Okay',
        duration: 3000,
        type: 'warning'
      })
    }
  };

  // If user scanned barcode of a product, add the product name to "Ingredients List" (Array).
  let dataFromBarcode = navigation.getParam('ingredientName');

  if (dataFromBarcode !== null) {
    if (
      dataFromBarcode &&
      !ingredients.includes(dataFromBarcode.toLowerCase())
    ) {
      submitHandler(dataFromBarcode);
    }
  }

  // A handler when user wants to remove an ingredient from the "Ingredients List" (Array).
  const removeIngredient = cIngredient => {
    const indexOfItem = ingredients.indexOf(cIngredient);
    setIngredients(ingredients.filter((item, index) => index !== indexOfItem));
    navigation.setParams({ ingredientName: null });
  };

  // A handler when user wants to "Clear Search Results".
  const clearSearchResults = () => {
    // Make Recipes List" empty.
    setRecipes([]);
  };

  //Call searchRecipesApi when component is first rendered
  //useEffect hook that passes a function that we want to run only once,
  //or depending on if the values in the array change
  useEffect(() => {
    searchRecipesApi([]);
  }, []);

  return (
    <View>
      <View style={{flexDirection: "row"}}>
        <SearchBar
          currIngredient={currIngredient}
          onTermChange={newIngred => setCurrIngredient(newIngred)}
        />
        <Button 
          rounded dark
          style={styles.addButton}
          onPress={() => submitHandler(currIngredient)}
        >
          <Text style={styles.buttonText}>Add</Text>
        </Button>
      </View>

      <Button
        small primary
        style={styles.barcodeButton}
        onPress={() => navigation.navigate('BarcodeScanner')}
      >
        <Text style={styles.buttonText}>Or Scan Ingredient's Barcode</Text>
      </Button>

      <View>
        <Text style={styles.header}>Your List of Ingredients: </Text>
        <FlatList
          data={ingredients}
          style={styles.displayList}
          keyExtractor={ingredient => ingredient}
          renderItem={({ item }) => {
            return (
              <View style={styles.ingredientItemContainer}>
                <Text style={styles.displayItem}>{item}</Text>

                <Button
                  bordered danger
                  style={{marginLeft: 15, width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => removeIngredient(item)}
                >
                  <EvilIcons name='trash' color='red' size={13}/>
                </Button>
              </View>
            );
          }}
        />
      </View>

      <View style={{flexDirection: "row"}}>
        <TouchableOpacity
          horizontal={true}
          style={styles.searchRecipeButton}
          onPress={() => searchRecipesApi(ingredients)}
        >
          <Text style={styles.barcodeText}>Find Recipes</Text>
        </TouchableOpacity>
        {recipes.length > 0 ? (
          <View>
            <TouchableOpacity
              horizontal={true}
              style={styles.clearSearchResultsButton}
              onPress={() => clearSearchResults()}
            >
              <Text style={styles.clearSearchResultsButtonText}>
                Clear Search Results
              </Text>
            </TouchableOpacity>
          </View>
        ) : null }
      </View>
      <View>
        <ScrollView style={{height: 500}}>
            <RecipeList allRecipes={recipes} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: 'bold',
  },
  displayList: {
    marginTop: 5,
    marginLeft: 15,
    minHeight: 50,
  },
  displayItem: {
    fontSize: 18,
  },
  ingredientItemContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  removeIngredientButton: {
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  removeIngredientButtonText: {
    color: 'black',
  },
  searchRecipeButton: {
    backgroundColor: '#66ccff',
    height: 40,
    borderRadius: 5,
    marginHorizontal: 35,
    marginTop: 10,
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 15,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  clearSearchResultsButton: {
    backgroundColor: '#ff8989',
    // marginHorizontal: 50,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 10,
    height: 40,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchResultsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
    textAlign: 'center',
  },
  addButton: {
    marginTop: 15,
    width: 60,
    color: '#F7E9D0',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeButton: {
    width: 200,
    // color: '#F7E9D0',
    marginBottom: 5,
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeText: {
    fontSize: 16
  }
});

export default SearchIngredientsScreen;
