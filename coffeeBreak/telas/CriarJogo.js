import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, ImageBackground, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { obterTemas, addTema, deleteTema } from '../services/db';

export default function CriarJogo({ navigation }) {
  const [temas, setTemas] = useState([]);
  const [novoTema, setNovoTema] = useState('');

  async function adicionarTema() {
    if (novoTema.trim() === '') {
      Alert.alert("Erro", "O tema não pode estar vazio.");
      return;
    }
    const temasRetorno = await addTema(novoTema);
    setTemas([...temas, temasRetorno]);
    setNovoTema('');
  }

  useEffect(() => {
    carregaTemas();
  }, []);

  async function carregaTemas() {
    const temasData = await obterTemas();
    setTemas(temasData);
  }

  async function excluirTema(id) {
    try {
      await deleteTema(id);
      const novosTemas = temas.filter((tema) => tema.id !== id);
      setTemas(novosTemas);
    } catch (e) {
      Alert.alert("Erro", "Ocorreu um erro ao excluir o tema.");
    }
  }

  return (
    <ImageBackground source={require('../imagens/background.png')} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.seta} onPress={() => navigation.navigate('Home')}>
          <Image style={styles.logo} source={require('../imagens/seta.png')} />
        </TouchableOpacity>
        <Text style={styles.textG}>Crie um tema e/ou selecione o tema para as questões</Text>

        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            value={novoTema}
            onChangeText={setNovoTema}
            placeholder="Digite o tema"
          />
          <TouchableOpacity style={styles.plus} onPress={adicionarTema}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer}>
          {temas.map((tema) => (
            <View key={tema.id} style={styles.containerButton}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadPerguntas', { tema: tema.nome, id: tema.id })}>
                <Text style={styles.textButton}>{tema.nome}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => excluirTema(tema.id)}>
                <Text style={styles.textP}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 30,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  textG: {
    fontSize: 20,
    textAlign: 'center',
    color: '#4D2A16',
  },
  seta: {
    alignItems: 'flex-end',
    width: '100%',
    margin: 19,
  },
  input: {
    backgroundColor: 'white',
    width: 265,
    height: 39,
    borderRadius: 10,
    padding: 5,
  },
  plus: {
    height: 40,
    width: 40,
    borderRadius: 30,
    backgroundColor: '#6F4E37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  containerInput: {
    width: '100%',
    marginTop: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 52,
  },
  scrollContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    height: 73,
    borderRadius: 20,
    backgroundColor: '#EADBC7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 32,
    color: '#4D2A16',
  },
  containerButton: {
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 10,
  },
  textP: {
    marginRight: 10,
    fontSize: 15,
    color: '#4D2A16',
  },
});
