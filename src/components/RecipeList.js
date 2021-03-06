import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import RecipeDetail from './RecipeDetail';

const RecipeList = ({ allRecipes, navigation }) => {
  return (
    <View style={{marginBottom: 100}}>
      <FlatList
        data={allRecipes}
        keyExtractor={singleRecipe => String(singleRecipe.id) + 'key'}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SingleRecipe', { recipe: item })
              }
            >
              <RecipeDetail recipe={item} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default withNavigation(RecipeList);
