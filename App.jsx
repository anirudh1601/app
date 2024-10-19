import React, { useEffect } from 'react';
import { StatusBar,useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useGlobal from './src/core/global';
import './src/core/fontawesome'
import Splash from './src/screens/Splash';
import Auth from './src/screens/Auth';
import Signup from './src/screens/Signup';
import Signin from './src/screens/Signin';
import Otp from './src/screens/Otp';
import OTP_verification from './src/screens/OTP_verification';
import Face_verify from './src/screens/Face_verify';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import Chat from './src/screens/Chat';
import Search from './src/screens/Search';
import Notification from './src/screens/Notification';
import Other_Profile from './src/screens/Other_Profile';
import Messages from './src/screens/Messages';

const Stack = createNativeStackNavigator();

function App() {
  const colorScheme = useColorScheme()
  const initialized = useGlobal((state) => state.initialized);
  const authenticated = useGlobal((state) => state.authenticated);
  const init = useGlobal((state) => state.init);
  const refreshTokens = useGlobal((state) => state.refreshTokens);

  useEffect(() => {
    init();

    if (authenticated) {
      const tokenRefreshInterval = setInterval(() => {
        refreshTokens();
      }, 180000);

      return () => clearInterval(tokenRefreshInterval); 
    }
  }, [authenticated]);

  return (
    <NavigationContainer>
      <StatusBar barStyle='dark-content' />
      <Stack.Navigator
        screenOptions={{
          gestureEnabled:true,
          gestureDirection:'horizontal'
        }}
      >
        {!initialized ? (
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        ) : !authenticated ? (
          <>
            <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
            
            <Stack.Screen name="Otp" component={Otp} options={{ headerShown: false }} />
            <Stack.Screen name="OTP_verification" component={OTP_verification} options={{ headerShown: false }} />
            <Stack.Screen name="Face_verify" component={Face_verify} options={{ headerShown: false }} />
          </>
        ) : (authenticated && initialized) ? (
          <>
          
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile}  />
          <Stack.Screen name="Search" component={Search} options={{headerShown:false}} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Other_Profile" component={Other_Profile} options={{headerShown:false}}/>
          <Stack.Screen name="Messages" component={Messages} options={{headerShown:false}}/>
          </>
        ):
          <>
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
