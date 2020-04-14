import React, {useState, useEffect} from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

import api from './services/api';

export default function App() {
  const [repositories, setRepositories]= useState([]);
  const [title, setTitle]= useState('');
  const [url, setUrl]= useState('');
  const [techs, setTechs]= useState('');

  useEffect(() => {
    // console.log('aki');
    api.get('repositories').then(response => {
      console.log(response.data);
      setRepositories(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    // console.log(`clicked: ${id}`);
    const response = await api.post(`repositories/${id}/like`);
    const likes = response.data.likes;

    setRepositories(repositories.filter( repository => {
      if (repository.id === id ) {
        repository.likes= likes;
      }
      return repository;
    }));
  }

  async function handleAddRepository() {
    let techList = techs.split(',');
    techList = techList.map(tech => tech.trim());

    const response = await api.post('repositories', {
      title,
      url,
      techs: techList,
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);

    setTitle('');
    setUrl('');
    setTechs('');
  }
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repository => repository.id}
          renderItem={({item: repository}) => (
            <View style={styles.repositoryContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.repository}>{repository.title}</Text>
              </View>

              <View style={styles.contend}>

                <View style={styles.likesContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleLikeRepository(repository.id)}
                    testID={`like-button-${repository.id}`}
                  >
                  <Text
                    style={styles.likeText}
                  >
                  Likes 
                  </Text>
                    <Text style={styles.buttonText}>{repository.likes}</Text>
                  </TouchableOpacity>
                  <Text style={styles.hiddenTest}
                      testID={`repository-likes-${repository.id}`}>
                        {(repository.likes == 1)? `${repository.likes} curtida`: `${repository.likes} curtidas`}
                  </Text>
                </View>

                <View style={styles.techsContainer}>
                  {repository.techs.map((tech, i) => (
                    <Text key={i}>{tech}</Text>
                  ))}
                </View>
              </View>
            </View>
          )}
        />
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Título"
            onChangeText={(text) => setTitle(text)}
            value={title}
          />
          <TextInput
            style={styles.input}
            placeholder="URL"
            onChangeText={(text) => setUrl(text)}
            value={url}
          />
          <TextInput
            style={styles.input}
            placeholder="Tecnologias"
            onChangeText={(text) => setTechs(text)}
            value={techs}
          />
          <Text style={styles.small}>Separadas por vírgula</Text>
          <TouchableOpacity style={styles.buttonAdd} onPress={handleAddRepository}>
            <Text style={styles.buttonText}>Adcionar Projeto</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-between',
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "column",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 20,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  contend: {
    flexDirection: 'row',
  },
  likesContainer: {
    flexDirection: "column",
    alignContent: 'center',
    justifyContent: "center",
    alignItems: 'center',
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    width: 50,
    marginTop: 10,
    borderRadius: 25,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#339",
    padding: 15,
  },
  hiddenTest: {
    display: 'none',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#ccc',
    marginTop: 10,
    paddingLeft: 10,
  },
  buttonAdd: {
    marginTop: 10,
    alignItems: 'center',
  },
  small: {
    paddingLeft: 35,
    fontSize: 12,
    color: '#ccf',
  }
});
