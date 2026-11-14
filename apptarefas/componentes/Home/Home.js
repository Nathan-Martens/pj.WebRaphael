import { StyleSheet, View, Text, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import api from '../../service/api';

const STATUS_CONFIG = {
  PENDENTE: {
    titulo: 'Pendentes',
    cor: '#f59e0b',
    corClara: '#fef3c7',
    icone: 'hourglass-outline',
  },
  EM_ANDAMENTO: {
    titulo: 'Em andamento',
    cor: '#2563eb',
    corClara: '#dbeafe',
    icone: 'sync-outline',
  },
  CONCLUIDO: {
    titulo: 'Concluídas',
    cor: '#16a34a',
    corClara: '#dcfce7',
    icone: 'checkmark-circle-outline',
  },
};

export default function Home({ navigation }) {

  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const [filtroEmAndamento, setFiltroEmAndamento] = useState([]);
  const [filtroConcluido, setFiltroConcluido] = useState([]);
  const [filtroPendente, setFiltroPendente] = useState([]);

  const buscarTarefa = async () => {
    try {
      const resposta = await api.get("/tarefas");
      setTarefas(resposta.data);
      const resp = resposta.data;

      const emAndamento = resp.filter((item) => item.status === "EM_ANDAMENTO");
      const concluido = resp.filter((item) => item.status === "CONCLUIDO");
      const pendente = resp.filter((item) => item.status === "PENDENTE");

      setFiltroEmAndamento(emAndamento);
      setFiltroConcluido(concluido);
      setFiltroPendente(pendente);

    } catch (error) {
      console.log("Erro ao buscar serviço: " + error.response.data.mensagem);
    } finally {
      console.log("Busca de tarefas finalziada!!");
    }
  }

  useEffect(() => {
    buscarTarefa()
  }, [])

  const aoAtualizar = () => {
    setAtualizando(true);
    buscarTarefa();
  };

  const percentualConcluido = tarefas.length > 0
    ? Math.round((filtroConcluido.length / tarefas.length) * 100)
    : 0;

  const renderListaStatus = (status, lista) => {
    const config = STATUS_CONFIG[status];
    return (
      <View style={styles.secaoLista} key={status}>
        <View style={styles.secaoTitulo}>
          <Ionicons name={config.icone} size={18} color={config.cor} />
          <Text style={[styles.secaoTituloTexto, { color: config.cor }]}>
            {config.titulo} ({lista.length})
          </Text>
        </View>

        {lista.length === 0 ? (
          <Text style={styles.listaVazia}>Nenhuma tarefa aqui.</Text>
        ) : (
          lista.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemTarefa, { borderLeftColor: config.cor }]}
              onPress={() => navigation?.navigate('ListarTarefa', { item })}
            >
              <Text style={styles.itemTarefaTitulo} numberOfLines={1}>{item.titulo}</Text>
              {!!item.responsavel?.nome && (
                <Text style={styles.itemTarefaResponsavel}>{item.responsavel.nome}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topo}>
          <Text style={styles.textoTopo}>Início</Text>
        </View>
        <View style={styles.carregandoContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.carregandoTexto}>Carregando suas tarefas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.topo}>
        <Text style={styles.textoTopo}>Início</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.conteudo}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} colors={['#2563eb']} />
        }
      >
        <Text style={styles.subtitulo}>Dashboard</Text>

        <View style={styles.metricas}>
          <Text style={styles.titulo}>Métricas de Tarefas</Text>

          <View style={styles.cardContainer}>
            <View style={[styles.card, styles.cardAtribuidas]}>
              <Ionicons name="list-outline" size={22} color="#7c3aed" style={styles.cardIcone} />
              <Text style={[styles.resultado, { color: '#7c3aed' }]}>{tarefas.length}</Text>
              <Text style={[styles.label, { color: '#7c3aed' }]}>Atribuídas</Text>
            </View>

            <View style={[styles.card, styles.cardPendente]}>
              <Ionicons name="hourglass-outline" size={22} color="#f59e0b" style={styles.cardIcone} />
              <Text style={[styles.resultado, { color: '#f59e0b' }]}>{filtroPendente.length}</Text>
              <Text style={[styles.label, { color: '#f59e0b' }]}>Pendentes</Text>
            </View>

            <View style={[styles.card, styles.cardEmAndamento]}>
              <Ionicons name="sync-outline" size={22} color="#2563eb" style={styles.cardIcone} />
              <Text style={[styles.resultado, { color: '#2563eb' }]}>{filtroEmAndamento.length}</Text>
              <Text style={[styles.label, { color: '#2563eb' }]}>Em andamento</Text>
            </View>

            <View style={[styles.card, styles.cardConcluido]}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#16a34a" style={styles.cardIcone} />
              <Text style={[styles.resultado, { color: '#16a34a' }]}>{filtroConcluido.length}</Text>
              <Text style={[styles.label, { color: '#16a34a' }]}>Concluídas</Text>
            </View>
          </View>

          <View style={styles.progressoContainer}>
            <View style={styles.progressoTextoLinha}>
              <Text style={styles.progressoLabel}>Progresso geral</Text>
              <Text style={styles.progressoPercentual}>{percentualConcluido}%</Text>
            </View>
            <View style={styles.progressoBarraFundo}>
              <View style={[styles.progressoBarraPreenchida, { width: `${percentualConcluido}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.listasWrapper}>
          {renderListaStatus('EM_ANDAMENTO', filtroEmAndamento)}
          {renderListaStatus('PENDENTE', filtroPendente)}
          {renderListaStatus('CONCLUIDO', filtroConcluido)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2563eb',
  },
  topo: {
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoTopo: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  conteudo: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 30,
  },
  carregandoContainer: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carregandoTexto: {
    marginTop: 10,
    color: '#555555',
    fontSize: 14,
  },
  subtitulo: {
    width: '100%',
    fontSize: 14,
    color: '#777777',
    marginBottom: 10,
  },
  metricas: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 16,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: '#e0e0e0',

    ...Platform.select({
        web: {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
        },
        default: {
            elevation: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
        },
    }),
  },
  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 14,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 10,
  },
  card: {
    width: '47%',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 14,
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardAtribuidas: {
    backgroundColor: '#ede9fe',
  },
  cardEmAndamento: {
    backgroundColor: '#dbeafe',
  },
  cardConcluido: {
    backgroundColor: '#dcfce7',
  },
  cardPendente: {
    backgroundColor: '#fef3c7',
  },
  cardIcone: {
    marginBottom: 6,
  },
  label: {
    fontWeight: '600',
    fontSize: 12,
    marginTop: 2,
  },
  resultado: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressoContainer: {
    width: '100%',
    marginTop: 18,
  },
  progressoTextoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },
  progressoPercentual: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  progressoBarraFundo: {
    width: '100%',
    height: 10,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressoBarraPreenchida: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#16a34a',
  },
  listasWrapper: {
    width: '100%',
  },
  secaoLista: {
    width: '100%',
    marginBottom: 16,
  },
  secaoTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  secaoTituloTexto: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  listaVazia: {
    fontSize: 13,
    color: '#999999',
    fontStyle: 'italic',
    paddingLeft: 4,
  },
  itemTarefa: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderLeftWidth: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,

    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#e0e0e0',
    borderRightColor: '#e0e0e0',
    borderBottomColor: '#e0e0e0',

    ...Platform.select({
        web: {
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.06)",
        },
        default: {
            elevation: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 2,
        },
    }),
  },
  itemTarefaTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
  },
  itemTarefaResponsavel: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
});
