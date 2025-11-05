import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Alert,
  Button,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../service/firebaseConnections";

export default function DetalhesScreen({ route }) {
  const { idProduto } = route.params;
  const navigation = useNavigation();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    const carregarProduto = async () => {
      try {
        const docRef = doc(db, "produtos", idProduto);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduto(data);
          setNome(data.nome);
          setPreco(String(data.preco));
          setDescricao(data.descricao);
        } else {
          Alert.alert("Erro", "Produto não encontrado!");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        Alert.alert("Erro", "Não foi possível carregar o produto.");
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, []);

  const handleAtualizar = async () => {
    try {
      const produtoRef = doc(db, "produtos", idProduto);
      await updateDoc(produtoRef, {
        nome,
        preco: parseFloat(preco),
        descricao,
      });
      Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      setEditando(false);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      Alert.alert("Erro", "Não foi possível atualizar o produto.");
    }
  };

  const handleExcluir = async () => {
    if (Platform.OS === "web") {
      const confirmacao = window.confirm(
        "Tem certeza que deseja excluir este produto?"
      );
      if (!confirmacao) return;

      try {
        const produtoRef = doc(db, "produtos", idProduto);
        await deleteDoc(produtoRef);
        alert("Produto excluído com sucesso!");
        navigation.goBack();
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto. Tente novamente mais tarde.");
      }
    } else {
      Alert.alert(
        "Confirmação",
        "Tem certeza que deseja excluir este produto?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                const produtoRef = doc(db, "produtos", idProduto);
                await deleteDoc(produtoRef);
                Alert.alert("Sucesso", "Produto excluído com sucesso!");
                navigation.goBack();
              } catch (error) {
                console.error("Erro ao excluir produto:", error);
                Alert.alert(
                  "Erro",
                  "Erro ao excluir produto. Tente novamente mais tarde."
                );
              }
            },
          },
        ]
      );
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Detalhes do Produto</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        editable={editando}
      />

      <Text style={styles.label}>Preço:</Text>
      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        editable={editando}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={descricao}
        onChangeText={setDescricao}
        editable={editando}
        multiline
      />

      <View style={styles.botoes}>
        {!editando ? (
          <Button title="Editar" onPress={() => setEditando(true)} />
        ) : (
          <Button title="Salvar Alterações" onPress={handleAtualizar} />
        )}
      </View>

      <View style={styles.botoes}>
        <Button title="Excluir Produto" color="red" onPress={handleExcluir} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  botoes: {
    marginTop: 10,
  },
});
