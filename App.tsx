import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import messaging from '@react-native-firebase/messaging';
const useGetToken = () => {
  useEffect((): (() => void) | void => {
    const logToken = async () => {
      const token = await messaging().getToken();
      console.log('token: ', token);
    };

    logToken();
  }, []);
};

const useInitialRoute = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Home');

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );

      if (remoteMessage.data?.type) {
        setInitialRoute(remoteMessage.data.type);
      }
      setLoading(false);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (!remoteMessage) {
          console.log('No initial notification');

          return setLoading(false);
        }

        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        if (remoteMessage.data?.type) {
          setInitialRoute(remoteMessage.data.type);
        }

        setLoading(false);
      });
  }, []);

  return {
    loading,
    initialRoute,
  };
};

const App = () => {
  useGetToken();

  const {loading, initialRoute} = useInitialRoute();
  console.log('initialRoute: ', initialRoute);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionDescription}>
                {loading ? 'loading inital route' : initialRoute}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionDescription: {
    fontSize: 20,
    color: Colors.dark,
  },
});

export default App;
