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
    document.querySelector('#pseudonym_session_unique_id').value=cookie['pseudonym_session[unique_id]'] || '';
    document.querySelector('#pseudonym_session_password').value=cookie['pseudonym_session[password]'] || '';
    document.querySelector('#login button').onclick = function(){
        document.cookie = 'pseudonym_session[unique_id]='+document.querySelector('#pseudonym_session_unique_id').value;
        document.cookie = 'pseudonym_session[password]='+document.querySelector('#pseudonym_session_password').value;
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
          source={{ uri: 'https://canvas.rymys.com' }}
          injectedJavaScript={jsCode}
          javaScriptEnabled={true}
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
