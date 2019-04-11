import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { DocumentPicker, ImagePicker } from 'expo';

export default class App extends React.Component {

  _testing = async () => {
      
      fetch('http://18.222.219.221:8080/testing')
      .then((response) => {
        response.json();
        console.log(response._bodyText);
        alert(response._bodyText);
      })
    .catch((error) => {
      console.error(error);
    });
  }


  _pickDocument = async () => {
	    let result = await DocumentPicker.getDocumentAsync({});
      extension = 'audio/'+result.name.split('.').pop();
      let formData = new FormData();
        formData.append('audio', {
        uri: result.uri,
        name: result.name,
        type: extension
      });
      let options = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };
      fetch('http://18.222.219.221:8080/combined',options)
      .then((response) => {
        response.json();
        console.log(response._bodyText);
        alert(response._bodyText);
      })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <Button
          title="Testing"
          onPress={this._testing}
        />
        <Button
          title="Select Audio"
          onPress={this._pickDocument}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
