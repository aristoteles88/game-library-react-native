import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./src/Home"
import GameForm from "./src/GameForm"


const Stack = createNativeStackNavigator()

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={() => ({
            headerTitle: "Game Library",
          })}
        />
        <Stack.Screen 
          name="GameForm" 
          component={GameForm} 
          options={({ route }) => ({title: route.params.name})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
