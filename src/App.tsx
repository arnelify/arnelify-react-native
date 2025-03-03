import React, { JSX, useState } from 'react';
import { Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';

/**
 * App
 * @returns 
 */
const App = (): JSX.Element => {

  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ARN Framework 0.6.4</Text>
      <Pressable onPress={() => setCount(count + 1)} style={styles.button}>
        <Text style={styles.text}>Native Mobile Button</Text>
      </Pressable>

      <Text>You clicked {count} times!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#5397f7',
  },
  text: {
    color: '#fff',
  },
  counter: {

  },
  title: {
    alignItems: 'center',
    fontSize: 20,
  },
});

export default App;