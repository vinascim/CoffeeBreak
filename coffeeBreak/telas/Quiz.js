import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity, Alert } from "react-native";
import { obterTemas, obterPerguntaEAlternativas, obterPerguntasPorTema } from '../services/db';

export default function Quiz({ navigation, route }) {
    const { tema } = route.params;
    const [perguntas, setPerguntas] = useState([]);
    const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [perguntaAtual, setPerguntaAtual] = useState({});
    const [quantidadeAcertos, setQuantidadeAcertos] = useState(0);

    useEffect(() => {
        carregaPerguntas();
    }, []);

    async function carregaPerguntas() {
        const perguntasData = await obterPerguntasPorTema(tema.id);
        if (perguntasData.length > 0) {
            const pergunta = await obterPerguntaEAlternativas(perguntasData[0].id);
            setPerguntas(perguntasData);
            setPerguntaAtual(pergunta);
        } else {
            Alert.alert('Erro', 'Nenhuma pergunta encontrada para este tema.');
            navigation.goBack();
        }
    }

    const confirmarResposta = async () => {
        if (respostaSelecionada === null) {
            Alert.alert('Erro', 'Por favor, selecione uma resposta antes de confirmar.');
            return;
        }
    
        let novosAcertos = quantidadeAcertos;
    
        const correta = perguntaAtual.alternativas.find(alt => alt.correta)?.letra;
    
        if (respostaSelecionada === correta) {
            Alert.alert('Correto!', 'Você acertou a resposta!');
            novosAcertos += 1;  // Incrementa localmente
            setQuantidadeAcertos(novosAcertos); // Atualiza o estado
        } else {
            Alert.alert('Incorreto', `A resposta correta era a alternativa ${correta}.`);
        }
    
        const proximaPerguntaIndex = perguntaAtualIndex + 1;
    
        if (proximaPerguntaIndex < perguntas.length) {
            const proximaPergunta = await obterPerguntaEAlternativas(perguntas[proximaPerguntaIndex].id);
            setPerguntaAtual(proximaPergunta);
            setPerguntaAtualIndex(proximaPerguntaIndex);
            setRespostaSelecionada(null);
        } else {
            let porcentagem = (novosAcertos / perguntas.length) * 100;
            porcentagem = Math.ceil(porcentagem);
            navigation.navigate('Resultado', { porcentagem });
        }
    };
    

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.seta} onPress={() => navigation.navigate('Home')}>
                <Image style={styles.logo} source={require('../imagens/seta.png')} />
            </TouchableOpacity>
            <Text style={styles.textG}>{tema.nome}</Text>

            <View style={styles.containerQuiz}>
                <Text style={styles.textPergunta}>{perguntaAtual.texto}</Text>

                {perguntaAtual.alternativas && perguntaAtual.alternativas.map((alt) => (
                    <TouchableOpacity
                        key={alt.letra}
                        style={[styles.buttonResposta, respostaSelecionada === alt.letra && styles.buttonSelecionado]}
                        onPress={() => setRespostaSelecionada(alt.letra)}
                    >
                        <Text style={styles.textResposta}>{alt.texto}</Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity style={styles.buttonConfirmar} onPress={confirmarResposta}>
                    <Text style={styles.textResposta}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        width: '100%',
        margin: 19,
    },
    buttonResposta: {
        width: 243,
        height: 37,
        backgroundColor: '#E47A3F',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 19,
    },
    buttonSelecionado: {
        backgroundColor: '#d1f7d1',
    },
    textResposta: {
        color: 'white',
        fontSize: 16,
    },
    containerQuiz: {
        backgroundColor: '#EADBC7',
        width: 302,
        height: 413,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 27,
    },
    textPergunta: {
        fontSize: 16,
        marginBottom: 49,
    },
    buttonConfirmar: {
        backgroundColor: '#0A9B19',
        width: 243,
        height: 37,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
});
