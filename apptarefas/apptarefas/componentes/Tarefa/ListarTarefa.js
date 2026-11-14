import { Text, View, StyleSheet } from "react-native";
import React from 'react';

// Formata datas da API para o padrão brasileiro (dd/mm/aaaa).
// "2026-11-10" (só data) é tratada à parte para não voltar um dia por causa do fuso horário.
function formatarData(valor) {
    if (!valor) return "—";
    const somenteData = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
    if (somenteData) {
        return `${somenteData[3]}/${somenteData[2]}/${somenteData[1]}`;
    }
    const data = new Date(valor);
    if (isNaN(data.getTime())) return String(valor);
    return data.toLocaleDateString("pt-BR");
}

function ListarTarefa({ route }) {

    const item = route?.params?.item;

    if (!item) {
        return (
            <View style={estilo.container}>
                <Text>Nenhuma tarefa selecionada.</Text>
                <Text>Volte para a lista de tarefas e toque em "Ver Mais" novamente.</Text>
            </View>
        )
    }

    return (
        <View>
            <Text>Listando a Tarefa </Text>
            <Text>Número da Tarefa: {item.id}</Text>
            <Text style={estilo.titulo}>{item.titulo}</Text>
            <Text style={estilo.descricao}>{item.descricao}</Text>
            <Text style={estilo.responsavel}>Responsável: {item.responsavel?.nome ?? "Não definido"}</Text>
            <View>
                <Text style={estilo.data}>Criado em: {formatarData(item.createdAt ?? item.data_criacao)}</Text>
                <Text style={estilo.data}>Atualizado em: {formatarData(item.updatedAt ?? item.data_atualizacao)}</Text>
                <Text style={estilo.data}>Prazo: {formatarData(item.data_limite)}</Text>
                <Text style={estilo.status}>Prioridade: {item.prioridade ?? "—"}</Text>
                <Text style={estilo.status}>Status: {item.status}</Text>
            </View>
        </View>
    )
}
const estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e2e2e2',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    topo: {},
    textoTopo: {},
    listaTarefas: {
        width: '90%',
        backgroundColor: '#ebc5c5',
        alignItems: 'center',
    },
    itemLista: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'black',
        width: '95%',
        paddingLeft: 10,
        paddingBottom: 10,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 5,
    },
    descricao: {},
    responsavel: {},
    data: {},
    status: {},
})


export default ListarTarefa;
