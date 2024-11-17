import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, ImageBackground, TouchableOpacity, ScrollView, Alert } from "react-native";
import { obterPerguntasPorTema, deletePergunta } from '../services/db';

export default function CadPerguntas({ navigation, route }) {
    const [perguntas, setPerguntas] = useState([]);
    const { tema, id } = route.params;

    async function carregaPerguntas() {
        try {
            const perguntasData = await obterPerguntasPorTema(id);
         
            setPerguntas(perguntasData);
        } catch (error) {
            console.error("Erro ao carregar perguntas: ", error);
        }
    }

    useEffect(() => {
        carregaPerguntas();
    }, []);

    const excluirPergunta = async (perguntaId, index) => {
        try {
            await deletePergunta(perguntaId);
            const novasPerguntas = perguntas.filter((_, i) => i !== index);
            setPerguntas(novasPerguntas);
            Alert.alert("Sucesso", "Pergunta excluída com sucesso.");
        } catch (error) {
            console.error("Erro ao excluir pergunta: ", error);
            Alert.alert("Erro", "Ocorreu um erro ao excluir a pergunta.");
        }
    };

    const validarCampos = () => {
        if (!tema || !id) {
            Alert.alert("Erro", "Tema ou ID inválido.");
            return false;
        }
        return true;
    };

    return (
        <ImageBackground source={require('../imagens/background.png')} style={styles.background}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.seta} onPress={() => navigation.navigate('CriarJogo')}>
                    <Image style={styles.logo} source={require('../imagens/seta.png')} />
                </TouchableOpacity>
                <Text style={styles.textTitulo}>{tema}</Text>
                <Text style={styles.textG}>Lista de perguntas</Text>

                <View style={styles.containerInput}>
                    <TouchableOpacity
                        style={styles.plus}
                        onPress={() => {
                            if (validarCampos()) {
                                navigation.navigate('EditaPergunta', { tema: { nome: tema, idTema: id }, perguntaId: undefined });
                            }
                        }}
                    >
                        <Text style={styles.plusText}>+</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollContainer}>
                    {perguntas.map((pergunta, index) => (
                        <View key={index} style={styles.containerButton}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    if (validarCampos()) {
                                        navigation.navigate('EditaPergunta', { tema: { nome: tema, idTema: id }, perguntaId: pergunta.id });
                                    }
                                }}
                            >
                                <Text style={styles.textButton}>{pergunta.texto}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => excluirPergunta(pergunta.id, index)}>
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
        display: 'flex',
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
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '100%',
        margin: 19,
    },
    plus: {
        height: 40,
        width: 40,
        borderRadius: 30,
        backgroundColor: '#6F4E37',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    containerInput: {
        display: 'flex',
        width: '100%',
        marginTop: 52,
        flexDirection: 'row',
        alignItems: 'center',
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        fontSize: 20,
        color: '#4D2A16',
    },
    containerButton: {
        display: 'flex',
        alignItems: 'flex-end',
        width: '100%',
        marginBottom: 10,
    },
    textP: {
        marginRight: 10,
        fontSize: 15,
        color: '#4D2A16',
    },
    textTitulo: {
        fontSize: 32,
        color: '#4D2A16',
        marginBottom: 13,
    },
});
