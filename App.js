import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function App() {
  const [matched, setMatched] = useState(false);

  const findPersonToEatWith = () => {
    // Simulate a successful match for demonstration purposes
    setMatched(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>eat with me</Text>
      {!matched ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={findPersonToEatWith}>
            <Text style={styles.buttonText}>find someone to eat with</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.matchContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: 'https://example.com/path/to/profile/image.jpg' }}
          />
          <Text style={styles.matchText}>You matched with John Doe!</Text>
          <Text style={styles.matchText}>Enjoy your meal together!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  matchContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  matchText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
