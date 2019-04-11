import React from 'react';
import { Button, View, Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation'; // Version can be specified in package.json
import { DocumentPicker } from 'expo';


var filename = "";
//var sentense = "";
var fileUri = "";
var colorArray = [];
colorArray['neutral'] = 'blue';

colorArray['excited'] = 'green';
colorArray['happy'] = 'green';

colorArray['surprise'] = 'pink';

colorArray['frustration'] = 'black';
colorArray['angry'] = 'black';

colorArray['disgust'] = 'red';
colorArray['sad'] = 'red';

colorArray['fear'] = 'violet';


class HomeScreen extends React.Component {
  _loadFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if(result.name){
      filename = result.name;
      fileUri = result.uri;
      type = filename.split('.').pop();
      if(type==="wav" || type==="ogg"|| type==="mp3"){
      this.props.navigation.navigate('Details')}
      else{
        alert("Please select file of specified format");
      }
    }
    else{
      alert("Please Select a AudioFile");
    }
  }
  render() {
    return (
      <View style={{flexDirection:'column',flex:1}}> 

        <View style={{height:'25%', alignItems: 'center', justifyContent: 'center'}}> 
          <Text style={{fontSize:15, paddingLeft:5}}> 
          The converted text from the speech is displayed using different colors which denotes different emotions. </Text>
        </View>

        <View style={{ height:'5%', alignItems: 'center', justifyContent: 'center',backgroundColor:'blue'}}>
          <Text style={{fontSize:15}}>Neutral</Text>
        </View>
        <View style={{ height:'5%', alignItems: 'center', justifyContent: 'center',backgroundColor:'green'}}>
          <Text style={{fontSize:15}}>Happy</Text>
        </View>
        <View style={{ height:'5%', alignItems: 'center', justifyContent: 'center',backgroundColor:'pink'}}>
          <Text style={{fontSize:15}}>Surprised</Text>
        </View>
        <View style={{ height:'5%', alignItems: 'center', justifyContent: 'center',backgroundColor:'black'}}>
          <Text style={{fontSize:15, color:'white'}}>Angry</Text>
        </View>
        <View style={{ height:'5%', alignItems: 'center', justifyContent: 'center',backgroundColor:'red'}}>
          <Text style={{fontSize:15}}>Sad</Text>
        </View>
        <View style={{ height:'5%', alignItems: 'center', justifyContent: 'center',backgroundColor:'violet'}}>
          <Text style={{fontSize:15}}>Fear</Text>
        </View>


        <View style={{ height:'20%', alignItems: 'center', justifyContent: 'center'}}>
          <Button
            title="Select Audio"
            onPress={this._loadFile}
          />
        </View>

        <View style={{ height:'25%', alignItems: 'center', justifyContent: 'center'}}> 
          <Text style={{fontSize:15}}>Select audio file of less than 2 minutes</Text>
          <Text style={{fontSize:15}}>Select audio file of 'mp3', 'wav', 'ogg' type only</Text>
        </View>

      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  _callAPI = async () => {
    this.props.navigation.navigate('Waiting')
    fetch('https://aawas.nitk.ac.in/testing')
      .then((response) => {
        extension = 'audio/'+ filename.split('.').pop();
      let formData = new FormData();
        formData.append('audio', {
        uri: fileUri,
        name: filename,
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
      fetch('https://aawas.nitk.ac.in/combined',options)
      .then((response) => response.json())
      .then(responseJson => {
        //console.log(responseJson);
        sentense = responseJson;
        this.props.navigation.navigate('Response')
      })
    .catch((error) => {
      console.error(error);
      alert("Server is not working");
      this.props.navigation.navigate('Home')
    });
  })
    .catch((error) => {
      console.error(42,error);
      alert("Server is not working");
      this.props.navigation.navigate('Home')
    });
}
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>You have selected - {filename}</Text>
        <Text>Press Proceed to Continue</Text>
        <Button
          title="Proceed"
          onPress={this._callAPI}
        />
      </View>
    );
  }
}

class WaitingScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>"Request is being processed. Please wait.!"</Text>
      </View>
    );
  }
}

class ResponseScreen extends React.Component {
  mapping(){
    return sentense.map((tuple,index) => <Text key={index} style={{fontSize:15, paddingLeft:5,color:colorArray[tuple.emotion] }}>{tuple.word + " "}</Text>);
  }
  render() {
    return (
      <View style={{flexDirection:'column',flex:1}}>
      <View style={{ height:'3%', alignItems: 'center', justifyContent: 'center',backgroundColor:'blue'}}>
          <Text style={{fontSize:10}}>Neutral</Text>
        </View>
        <View style={{ height:'3%', alignItems: 'center', justifyContent: 'center',backgroundColor:'green'}}>
          <Text style={{fontSize:10}}>Happy</Text>
        </View>
        <View style={{ height:'3%', alignItems: 'center', justifyContent: 'center',backgroundColor:'pink'}}>
          <Text style={{fontSize:10}}>Surprised</Text>
        </View>
        <View style={{ height:'3%', alignItems: 'center', justifyContent: 'center',backgroundColor:'black'}}>
          <Text style={{fontSize:10, color:'white'}}>Angry</Text>
        </View>
        <View style={{ height:'3%', alignItems: 'center', justifyContent: 'center',backgroundColor:'red'}}>
          <Text style={{fontSize:10}}>Sad</Text>
        </View>
        <View style={{ height:'3%', alignItems: 'center', justifyContent: 'center',backgroundColor:'violet'}}>
          <Text style={{fontSize:10}}>Fear</Text>
        </View>
        <View style={{ height:'72%', alignItems: 'center', justifyContent: 'center'}}>
        <Text >
          {this.mapping()}
        </Text>
        </View>
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
    Waiting: WaitingScreen,
    Response: ResponseScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
