import React from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity, Alert } from "react-native";

export default function Home({ navigation }) {
  function navegarCriarJogo() {
    if (!navigation) {
      Alert.alert("Erro", "Navegação não disponível.");
      return;
    }
    navigation.navigate('CriarJogo');
  }

  function navegarJogar() {
    if (!navigation) {
      Alert.alert("Erro", "Navegação não disponível.");
      return;
    }
    navigation.navigate('Jogar');
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../imagens/logo.png')} />
      <Text style={styles.textP}>Uma pausa para um quiz</Text>
      <TouchableOpacity style={[styles.botao, styles.botao1]} onPress={navegarCriarJogo}>
        <Text style={[styles.textG, { color: '#4D2A16' }]}>Criar jogo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.botao, styles.botao2]} onPress={navegarJogar}>
        <Text style={[styles.textG, { color: 'white' }]}>Jogar</Text>
      </TouchableOpacity>
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
    backgroundColor: '#4D2A16',
  },
  logo: {
    width: 217,
    height: 127,
  },
  textP: {
    color: '#E47A3F',
    fontSize: 24,
    marginBottom: 91,
    marginTop: 26,
  },
  botao: {
    width: 218,
    height: 67,
    borderRadius: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botao1: {
    backgroundColor: '#EADBC7',
  },
  botao2: {
    backgroundColor: '#E47A3F',
    marginTop: 44,
  },
  textG: {
    fontSize: 32,
  },
});
