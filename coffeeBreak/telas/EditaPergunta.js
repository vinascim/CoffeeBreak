import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, ImageBackground, TextInput, TouchableOpacity, Alert } from "react-native";
import { addPergunta, addAlternativa, obterPerguntaEAlternativas, updateAlternativa, updatePergunta } from '../services/db';

export default function EditaPergunta({ navigation, route }) {
    const { tema, perguntaId } = route.params || {}; 

    const [pergunta, setPergunta] = useState('');
    const [alternativas, setAlternativas] = useState({
        A: { id: null, texto: '' },
        B: { id: null, texto: '' },
        C: { id: null, texto: '' },
        D: { id: null, texto: '' },
    });
    const [correta, setCorreta] = useState(null);

    useEffect(() => {
        if (perguntaId) {
            carregaResposta();
        }
    }, [perguntaId]);

    async function carregaResposta() {
        try {
            if (perguntaId) {
                const perguntaData = await obterPerguntaEAlternativas(perguntaId);
                if (perguntaData) {
                    setPergunta(perguntaData.texto);
                    perguntaData.alternativas.forEach((alt) => {
                        setAlternativas((prev) => ({
                            ...prev,
                            [alt.letra]: { id: alt.id, texto: alt.texto },
                        }));
                        if (alt.correta) setCorreta(alt.letra);
                    });
                }
            }
        } catch (error) {
            console.error("Erro ao carregar pergunta: ", error);
        }
    }

    async function salvarPergunta() {
        if (!pergunta.trim()) {
            Alert.alert('Erro', 'A pergunta não pode estar vazia.');
            return;
        }

        if (!correta) {
            Alert.alert('Erro', 'Por favor, selecione a alternativa correta.');
            return;
        }
        
        if (!alternativas.A.texto && alternativas.A.texto == "" || !alternativas.B.texto && alternativas.B.texto == "" || !alternativas.C.texto && alternativas.C.texto == "" || !alternativas.D.texto && alternativas.D.texto == "") {
            Alert.alert('Erro', 'Por favor, preencha todas as alternativas');
            return;
        }

        try {
            let perguntaSalva;
            if (perguntaId) {
                perguntaSalva = await updatePergunta(perguntaId, tema.idTema, pergunta);

                await updateAlternativa(alternativas.A.id, perguntaSalva.id, 'A', alternativas.A.texto, correta === 'A');
                await updateAlternativa(alternativas.B.id, perguntaSalva.id, 'B', alternativas.B.texto, correta === 'B');
                await updateAlternativa(alternativas.C.id, perguntaSalva.id, 'C', alternativas.C.texto, correta === 'C');
                await updateAlternativa(alternativas.D.id, perguntaSalva.id, 'D', alternativas.D.texto, correta === 'D');
        
            } else {
                perguntaSalva = await addPergunta(tema.idTema, pergunta);
                await addAlternativa(perguntaSalva.id, 'A', alternativas.A.texto, correta === 'A');
                await addAlternativa(perguntaSalva.id, 'B', alternativas.B.texto, correta === 'B');
                await addAlternativa(perguntaSalva.id, 'C', alternativas.C.texto, correta === 'C');
                await addAlternativa(perguntaSalva.id, 'D', alternativas.D.texto, correta === 'D');
            }

            Alert.alert('Sucesso', 'Pergunta salva com sucesso!');
            navigation.navigate('CadPerguntas', { tema: tema.nome, id: tema.idTema });
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar a pergunta.');
        }
    }

    return (
        <ImageBackground
            source={require('../imagens/background.png')}
            style={styles.background}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.seta} onPress={() => navigation.navigate('CadPerguntas', { tema: tema.nome, id: tema.idTema })}>
                    <Image style={styles.logo} source={require('../imagens/seta.png')} />
                </TouchableOpacity>
                <Text style={styles.textTitulo}>{tema.nome}</Text>
                <View>
                    <Text style={styles.textM}>Crie a pergunta:</Text>
                    <TextInput
                        style={styles.containerInputG}
                        multiline={true}
                        numberOfLines={4}
                        value={pergunta}
                        onChangeText={setPergunta}
                        placeholder="Digite a pergunta"
                    />
                    {['A', 'B', 'C', 'D'].map((letra) => (
                        <View key={letra}>
                            <Text style={styles.textM}>Alternativa {letra}:</Text>
                            <TextInput
                                style={styles.containerInput}
                                value={alternativas[letra].texto}
                                onChangeText={(text) => setAlternativas((prev) => ({
                                    ...prev,
                                    [letra]: { ...prev[letra], texto: text }
                                }))}
                            />
                        </View>
                    ))}
                </View>
                <Text style={styles.textSelecione}>Selecione a alternativa correta:</Text>
                <View style={styles.containerButtons}>
                    {['A', 'B', 'C', 'D'].map((letra) => (
                        <TouchableOpacity 
                            key={letra} 
                            style={[styles.button, correta === letra && styles.buttonSelecionado]} 
                            onPress={() => setCorreta(letra)}
                        >
                            <Text style={styles.textAlt}>{letra}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={styles.buttonSalvar} onPress={salvarPergunta}>
                    <Text style={styles.textSalvar}>Salvar</Text>
                </TouchableOpacity>
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
    seta: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '100%',
        margin: 19,
    },
    textTitulo: {
        fontSize: 32,
        color: '#4D2A16',
    },
    containerInputG: {
        backgroundColor: 'white',
        width: 302,
        height: 81,
        borderRadius: 20,
        padding: 5
    },
    textM: {
        fontSize: 20,
        color: '#4D2A16',
        marginTop: 15,
        marginBottom: 5
    },
    containerInput: {
        backgroundColor: 'white',
        width: 302,
        height: 48,
        borderRadius: 20,
        padding: 5
    },
    textSelecione: {
        color: 'white',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    containerButtons: {
        flexDirection: 'row',
        width: 302,
        justifyContent: 'space-between'
    },
    button: {
        width: 59,
        height: 39,
        backgroundColor: 'white',
        borderRadius: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAlt: {
        fontSize: 32,
        color: '#844420',
    },
    buttonSalvar: {
        width: 302,
        height: 44,
        backgroundColor: '#2d763d',
        borderRadius: 20,
        marginTop: 36,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textSalvar: {
        fontSize: 20,
        color: 'white'
    },
    buttonSelecionado: {
        backgroundColor: 'black',
    },
});
