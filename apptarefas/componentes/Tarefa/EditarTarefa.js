import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from "react-native";
import api from '../../service/api';


function EditarTarefa({ route, navigation }) {
    // A tarefa já vem da lista (navigation.navigate('EditarTarefa', { item }))
    const itemRota = route?.params?.item;
    const id = itemRota?.id;

    const [tarefa, setTarefas] = useState(itemRota ?? null);

    // Preenche o formulário na hora com os dados que vieram da lista
    const [titulo, setTitulo] = useState(itemRota?.titulo ?? "");
    const [descricao, setDescricao] = useState(itemRota?.descricao ?? "");
    const [responsavel, setResponsavel] = useState(itemRota?.responsavel?.nome ?? "");

    // Tenta buscar a versão mais recente na API. A rota GET /tarefas/:id ainda está
    // comentada no backend (tarefaRoutes.js); enquanto isso, ficam os dados da lista.
    const buscarTarefa = async () => {
        if (!id) {
            console.log("Nenhuma tarefa selecionada para editar.");
            return;
        }
        try {
            const resposta = await api.get(`/tarefas/${id}`);
            const respTarefa = resposta.data?.tarefa;
            if (!respTarefa) return;

            setTarefas(respTarefa);
            setTitulo(respTarefa.titulo ?? "");
            setDescricao(respTarefa.descricao ?? "");
            setResponsavel(respTarefa.responsavel?.nome ?? "");

        } catch (error) {
            console.log("Não foi possível buscar a tarefa na API, usando os dados da lista: " + (error.response?.data?.mensagem || error.response?.data?.erro || error.message));
        } finally {
            console.log("Busca de tarefa finalizada.");
        }
    }
    useEffect(() => {
        buscarTarefa();
    }, []);

    const atualizar = async () => {
        console.log("Atualizar")
    }

    if (!id) {
        return (
            <View style={estilo.container}>
                <View style={estilo.todo}>
                    <View style={estilo.topo}>
                        <Text style={estilo.textoTopo}>Editar Tarefa</Text>
                    </View>
                </View>
                <View style={estilo.cadastrarTarefa}>
                    <Text>Nenhuma tarefa selecionada para editar.</Text>
                    <Text>Volte para a lista de tarefas e toque em "Editar" novamente.</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={estilo.container}>
            <View style={estilo.todo}>
                <View style={estilo.topo}>
                    <Text style={estilo.textoTopo}>Editar Tarefa</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={estilo.cadastrarTarefa}>
                <View style={estilo.itemLista}>
                    <Text style={estilo.rotulo}>Título da tarefa</Text>
                    <TextInput
                        value={titulo}
                        onChangeText={setTitulo}
                        style={estilo.input}
                    />

                    <Text style={estilo.rotulo}>Descrição:</Text>
                    <TextInput
                        value={descricao}
                        onChangeText={setDescricao}
                        multiline={true}
                        numberOfLines={4}
                        style={estilo.inputDescricao}
                    />

                    <Text style={estilo.rotulo}>Responsável:</Text>
                    <TextInput
                        value={responsavel}
                        onChangeText={setResponsavel}
                        style={estilo.input}
                    />
                    <View style={estilo.acao}>
                        <TouchableOpacity
                            onPress={atualizar}
                            style={estilo.botaoSalvar}
                        >
                            <Text style={estilo.textoBotao}>Atualizar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </View>
    )
}

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f4f7',
    },

    todo: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },

    topo: {
        width: '100%',
        height: 80,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
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
    },

    textoTopo: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    cadastrarTarefa: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    itemLista: {
        width: '100%',
        height: 400,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,

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

    rotulo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#222222',
        marginBottom: 8,
    },

    input: {
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 7,
        height: 40,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10
    },
    inputDescricao: {
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 7,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10
    },
    acao: {
        width: '100%',
        minHeight: 45,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    botaoSalvar: {
        flex: 1,
        height: 50,
        width: 130,
        marginBottom: 10,
        backgroundColor: '#025e37',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBotao: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
})

export default EditarTarefa;