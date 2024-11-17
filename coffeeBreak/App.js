import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './telas/Home';
import CriarJogo from './telas/CriarJogo';
import CadPerguntas from './telas/CadPerguntas';
import EditaPergunta from './telas/EditaPergunta';
import Jogar from './telas/Jogar';
import Quiz from './telas/Quiz';
import Resultado from './telas/Resultado';
import SQLite from 'react-native-sqlite-storage';
import React, { useEffect } from 'react';
import { createTables } from './services/db'



const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {

    async function initDb() {
      try {
        await createTables();
      }
      catch (e) {
        console.log(e);
      }
    }

    initDb();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerBackVisible: false,  headerShown: false}} />
        <Stack.Screen name="CriarJogo" component={CriarJogo} options={{ headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="CadPerguntas" component={CadPerguntas} options={{ headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="EditaPergunta" component={EditaPergunta} options={{ headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="Jogar" component={Jogar} options={{ headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="Quiz" component={Quiz} options={{ headerBackVisible: false, headerShown: false }} />
        <Stack.Screen name="Resultado" component={Resultado} options={{ headerBackVisible: false, headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}