import React, { useState, useEffect } from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity, Alert } from "react-native";
import { obterPerguntaEAlternativas, obterPerguntasPorTema } from '../services/db';

export default function Resultado({ navigation, route }) {
    const { porcentagem } = route.params;
    const [perguntas, setPerguntas] = useState([]);
    const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [perguntaAtual, setPerguntaAtual] = useState({});
console.log(porcentagem)

    useEffect(() => {
        carregaPerguntas();
    }, []);

    async function carregaPerguntas() {
        const perguntasData = await obterPerguntasPorTema(tema.id);
        const pergunta = await obterPerguntaEAlternativas(perguntasData[0].id);
        setPerguntas(perguntasData);
        setPerguntaAtual(pergunta);
    }

    const confirmarResposta = async () => {
        if (respostaSelecionada === null) {
            Alert.alert('Erro', 'Por favor, selecione uma resposta antes de confirmar.');
            return;
        }

        const correta = perguntaAtual.alternativas.find(alt => alt.correta)?.letra;

        if (respostaSelecionada === correta) {
            Alert.alert('Correto!', 'Você acertou a resposta!');
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
            Alert.alert('Fim do Quiz', 'Você completou todas as perguntas!');
            navigation.navigate('Home');
        }
    };

    return (
        <View style={styles.container}>
    <TouchableOpacity style={styles.seta} onPress={() => navigation.navigate('Home')}>
        <Image style={styles.logo} source={require('../imagens/seta.png')} />
    </TouchableOpacity>
    {porcentagem < 60 ? (  <Text style={styles.textG}>Não foi dessa vez!!</Text>  )
     : (  <Text style={styles.textG}>Parabéns!!</Text> )}
   

    <View style={styles.containerQuiz}>
        {porcentagem < 60 ? (
            <Text style={styles.textPergunta}> Você acertou apenas {porcentagem}% do teste.</Text>
        ) : (
            <Text style={styles.textPergunta}>Você acertou {porcentagem}% do teste!</Text>
        )}
        
        <TouchableOpacity style={styles.buttonConfirmar} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.textResposta}>Início</Text>
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
        width: '100%',
        margin: 19,
    },
    textResposta: {
        color: 'white',
        fontSize: 16
    },
    containerQuiz: {
        backgroundColor: '#EADBC7',
        width: 302,
        height: 413,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 27
    },
    textPergunta: {
        fontSize: 16,
        marginBottom: 49
    },
    buttonConfirmar: {
        backgroundColor: '#0A9B19',
        width: 243,
        height: 37,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    }
});
