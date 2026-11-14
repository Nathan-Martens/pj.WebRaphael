import { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import api from '../../service/api';

function Login({ navigation }) {
    const [email, setEmail] = useState('nathan@gmail.com');
    const [senha, setSenha] = useState('123456');

    const entrar = async () => {
        if (!email || !senha) {
            Alert.alert("AtenÃ§Ã£o", "Preencha todos os campos para continuar.");
            return;
        }

        try {
            const response = await api.post('/responsaveis/autenticar', {
                email,
                senha
            });
            //implementar o if para validar se chegou o token
            const usuario = JSON.stringify(response.data);
            const tokenAPI = '123456';
            //const tokenAPI = JSON.stringify(response.data.token)

            await AsyncStorage.setItem('token', tokenAPI);
            await AsyncStorage.setItem('usuario', usuario);

            Alert.alert("Sucesso", "Login realizado com sucesso!");
            console.log("ok")
            navigation.replace('Main');

        } catch (error) {
            console.log(error.response.data.mensagem);
            Alert.alert("Erro", error.response?.data?.mensagem || "E-mail ou senha invÃ¡lidos.");
        }
    };

    return (
        <ScrollView style={estilo.container} contentContainerStyle={estilo.conteudoScroll}>
            <View style={estilo.topo}>
                <Text style={estilo.textoTopo}>Acessar o Sistema</Text>
            </View>

            <View style={estilo.cartaoDetalhes}>
                <View style={estilo.blocoInfo}>
                    <Text style={estilo.label}>E-mail *</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="seu@email.com"
                        placeholderTextColor="#9ca3af"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={estilo.blocoInfo}>
                    <Text style={estilo.label}>Senha *</Text>
                    <TextInput
                        style={estilo.input}
                        placeholder="Sua senha"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry={true}
                        value={senha}
                        onChangeText={setSenha}
                    />
                </View>

                <TouchableOpacity style={estilo.botaoSalvar} onPress={entrar}>
                    <Text style={estilo.textoBotaoSalvar}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f4f7',
    },
    conteudoScroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 30,
        alignItems: 'center',
        paddingTop: 10,
    },
    topo: {
        width: '100%',
        backgroundColor: '#2563eb',
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: {
                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.15)",
            },
            default: {
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
            },
        }),
        marginBottom: 15,
    },
    textoTopo: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cartaoDetalhes: {
        width: '92%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        ...Platform.select({
            web: {
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            },
            default: {
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
    },
    blocoInfo: {
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4b5563',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        color: '#1f2937',
    },
    botaoSalvar: {
        backgroundColor: '#16a34a',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
    },
    textoBotaoSalvar: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Login;