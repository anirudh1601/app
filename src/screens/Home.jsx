import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity,Image,SafeAreaView } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Chat from './Chat';
import Camera from './Camera';
import Profile from './Profile';
import useGlobal from '../core/global';
import Feed from './Feed';
import utils from '../core/utils';
import { Dimensions } from 'react-native';




const Home = ({ navigation }) => {
  const user = useGlobal(state=>state.user)
  const socketConnect = useGlobal(state => state.socketConnect);
  const socketClose = useGlobal(state => state.socketClose);

  const handleTasksPress = () => {
    console.log('Tasks icon pressed');
  };
  
  const handleProfilePress = () => {
  
    if (navigation) {
      navigation.navigate('Profile');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    socketConnect();
    return () => {
      socketClose();
    };
  }, []);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'chat', title: 'Chat' },
    { key: 'camera', title: 'Camera' },
    { key: 'feed', title: 'Feed' },
  ]);

  const renderScene = SceneMap({
    chat: Chat,
    camera: Camera,
    feed: Feed,
  });

const TabIcon = ({ route, focused }) => {
  let iconName;

  if (route.key === 'chat') {
    iconName = require('../assets/chaticon.png');
  } else if (route.key === 'camera') {
    iconName = require('../assets/cameraicon.png');
  } else if (route.key === 'feed') {
    iconName = require('../assets/profileicon.png');
  }

  // Animation setup
  const scaleValue = new Animated.Value(1);

  Animated.timing(scaleValue, {
    toValue: focused ? 1.2 : 1,
    duration: 300,
    useNativeDriver: true,
  }).start();

  const scaleInterpolate = scaleValue.interpolate({
    inputRange: [1, 1.2],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.iconContainer}>
      <Animated.Image
        source={iconName}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? 'black' : '#8E8E93',
          transform: [{ scale: scaleInterpolate }],
        }}
      />
      
    </View>
  );
};


  return (
    <>


    <View style={styles.header}>
      <View style={{marginTop:20,}}>
      <View style={{marginTop:20,flexDirection:'row',justifyContent:'space-between'}}>
        <TouchableOpacity onPress={handleProfilePress} style={{marginLeft:15}}>
              <View style={styles.profileCircle}>
                <Image source={utils.thumbnail(user.thumbnail)}style={styles.profileImage} />
              </View>
            </TouchableOpacity>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleTasksPress}>
              <Image source={require("../assets/tasks.png")} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.addUser} onPress={()=>navigation.navigate("Notification")}>
              <View style={styles.addUserContainer}>
                <Image source={require("../assets/addfriend.png")} style={{ width: 18, height: 18 }} />
              </View>
            </TouchableOpacity>
            </View>
          </View>
          </View>
        </View>
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.content}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: '100%' }}
          renderTabBar={() => null} // Disable the top navigation bar
        />
      </View>
      <View style={styles.tabBar}>
        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => setIndex(i)}
          >
            <TabIcon route={route} focused={index === i} />
          </TouchableOpacity>
        ))}
      </View>
    </GestureHandlerRootView>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingBottom: 10,
    height: 60,
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    marginLeft: 4, // Adjust this value to control the space between the icon and the label
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  label: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  header: {

    backgroundColor: 'rgba(255, 255, 255, 1)', // Match the background color
  },
  title: {
    fontSize: 12,
    fontFamily: "EricaOne-Regular",
    fontWeight: "400",
  },
  iconsContainer: {
    width: 80,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 34,
    height: 34,
    right:20
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height:Dimensions.get('window').height,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8, // Increased for a more pronounced shadow
    },
    shadowRadius: 15, // Increased for a softer and larger shadow
    shadowOpacity: 0.8, // Darker shadow
    alignItems: "center",
    marginTop: 20,
    elevation: 10, // Increased for Android
  },
  userContainer: {
    marginTop: 20,
    width: Dimensions.get('window').width / 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomColor: '#E0FF05', 
    borderBottomWidth: 1,
  },
  addUser: {
    width: 43,
    height: 43,
    borderRadius: 60,
    right:8,
    backgroundColor: '#7ED3B2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  addUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Home;
