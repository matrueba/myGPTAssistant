import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView} from 'react-native';
import  GPTHandler  from './GPTHandler';


export default function App (){
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const gptHandler = new GPTHandler();
  gptHandler.initThread();



  const handleSubmit =  async () => {
    const message = await gptHandler.getGPTResponse(question);
    setConversation([...conversation, { question: question + "\n", answer: message + "\n"}]);
    setQuestion('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>
        Pregúntale a tu asistente
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Mensaje para tu asistente ..."
        value={question}
        onChangeText={setQuestion}
        onSubmitEditing={handleSubmit}
      />
      <ScrollView style={styles.conversationContainer}>
        {conversation.map((entry, index) => (
          <View key={index} style={styles.messageContainer}>
            <Text style={styles.questionText}>Tú: {entry.question}</Text>
            <Text style={styles.answerText}>Asistente: {entry.answer}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  displayText: {
    marginTop: 20,
    fontSize: 18,
  },
  titleText: {
    marginTop: 20,
    fontSize: 22,
  },
});

