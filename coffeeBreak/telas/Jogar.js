import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { obterTemas } from '../services/db';

export default function Jogar({ navigation }) {
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    carregaTemas();
  }, []);

  async function carregaTemas() {
    try {
      const temasData = await obterTemas();
      if (temasData && temasData.length > 0) {
        setTemas(temasData);
      } else {
        Alert.alert("Aviso", "Nenhum tema disponível.");
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar temas.");
    }
  }

  function navegarParaQuiz(tema) {
    if (!tema || !tema.id || !tema.nome) {
      Alert.alert("Erro", "Tema inválido.");
      return;
    }
    navigation.navigate('Quiz', { tema });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.seta} onPress={() => navigation.navigate('Home')}>
        <Image style={styles.logo} source={require('../imagens/seta.png')} />
      </TouchableOpacity>
      <Text style={styles.textG}>Selecione o tema:</Text>

      <ScrollView style={styles.scrollContainer}>
        {temas.map((tema) => (
          <View key={tema.id} style={styles.containerButton}>
            <TouchableOpacity style={styles.button} onPress={() => navegarParaQuiz(tema)}>
              <Text style={styles.textButton}>{tema.nome}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 30,
    backgroundColor: '#4D2A16',
  },
  textG: {
    fontSize: 32,
    textAlign: 'center',
    color: 'white',
    marginBottom: 121,
  },
  seta: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    margin: 19,
  },
  scrollContainer: {
    width: '100%',
    height: 518,
    maxHeight: 518,
  },
  button: {
    width: '100%',
    height: 73,
    borderRadius: 20,
    backgroundColor: '#EADBC7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 32,
    color: '#4D2A16',
  },
  containerButton: {
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 35,
  },
});
