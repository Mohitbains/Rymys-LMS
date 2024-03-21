import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { StatusBar } from 'expo-status-bar';

enum MessageTypes {
  save = 'webview/save',
}
const SAVE_FROM_WEB = `(function() {
  var values = [],
  keys = Object.keys(localStorage),
  i = keys.length;
  while ( i-- ) {
      values.push({key: keys[i], value: localStorage.getItem(keys[i])});
  }
  window.ReactNativeWebView.postMessage(JSON.stringify({type: 'webview/save', payload: values}));
})();`;

interface Message {
  type: MessageTypes;
  payload: any;
}

interface SaveData {
  key: string;
  value: string;
}

function handleOnMessage(event: WebViewMessageEvent) {
  const message: Message = JSON.parse(event.nativeEvent.data);
  switch (message.type) {
    case MessageTypes.save: {
      const data: Array<SaveData> = message.payload;
      data.forEach((dt) => {
        AsyncStorage.setItem(dt.key, dt.value);
      });
      break;
    }
    default:
      throw new Error('invalid case');
  }
}

export default function App() {
  const [initScript, setInitScript] = useState<string>();
  const webRef = useRef<WebView>(null);
  async function handleInit() {
    const allKeys = await AsyncStorage.getAllKeys();

    if (allKeys.length === 0) {
      setInitScript(SAVE_FROM_WEB);
    }

    const SAVE_FROM_RN = `(function() {
      ${allKeys.map(
        (key) => `localStorage.setItem(${key}, ${AsyncStorage.getItem(key)});`,
      )}
    })();`;

    setInitScript(SAVE_FROM_RN);
  }

  const refreshHandler = () => {
    setInterval(() => {
      webRef.current?.injectJavaScript(SAVE_FROM_WEB);
    }, 5000);
  };

  useEffect(() => {
    handleInit().then(refreshHandler);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {initScript && (
        <WebView
          ref={webRef}
          injectedJavaScript={initScript}
          source={{ uri: 'https://sistema.mais1cafe.com.br/' }}
          onMessage={handleOnMessage}
          scalesPageToFit={false}
        />
      )}
      <StatusBar style='auto' />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
