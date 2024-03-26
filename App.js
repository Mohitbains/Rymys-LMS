/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

import {
  BackHandler,
  Platform,
  ActivityIndicator,
  AppRegistry,
} from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  webView = {
    canGoBack: false,
    ref: null,
  };
  /** For Loading And Back Button Press**/

  onAndroidBackPress = () => {
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    return false;
  };

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.onAndroidBackPress,
      );
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.webView.ref.reload();
    this.setState({ refreshing: false });
  };
  /** For Loading And Back Button Press**/
  render() {
    let jsCode = `
    var cookie={};
    document.cookie.split('; ').forEach(function(i){cookie[i.split('=')[0]]=i.split('=')[1]});
    document.querySelector('#username').value=cookie['username'] || '';
    document.querySelector('#password').value=cookie['password'] || '';
    document.querySelector('.Button Button--primary').onclick = function(){
        document.cookie = 'username='+document.querySelector('#username').value;
        document.cookie = 'password='+document.querySelector('#password').value;
    };
`;

    return (
      <>
        <StatusBar backgroundColor='#2888a1' />
        <WebView
          ref={(webView) => {
            this.webView.ref = webView;
          }}
          onNavigationStateChange={(navState) => {
            this.webView.canGoBack = navState.canGoBack;
          }}
          source={{
            uri: 'https://canvas.rymys.com/',
          }}
          javaScriptEnabled={true}
          injectedJavaScript={jsCode}
          domStorageEnabled={true}
          cacheEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          pullToRefreshEnabled={true}
          style={{ marginTop: 30 }}
        />
      </>
    );
  }
}
AppRegistry.registerComponent('App', () => App);
