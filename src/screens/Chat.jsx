import React, { useState, useEffect, useRef,useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import useGlobal from '../core/global'; // Zustand for state management
import Reanimated from 'react-native-reanimated'; // Animated View
import Empty from '../common/Empty'; // Empty screen component for no data
import Cell from '../common/Cell'; // Cell for search result row
import Thumbnail from '../common/Thumbnail'; // Thumbnail for user image
import utils from '../core/utils';
import SearchButton from '../common/SearchButton';


function FriendRow({ navigation, item }) {
  const currentUser = useGlobal(state=>state.user)
  const friendUser = item.connection_user_1.username === currentUser.username 
    ? item.connection_user_2 
    : item.connection_user_1;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Messages', item)}>
      <View style={styles.friendRow}>
        <Thumbnail url={friendUser.thumbnail} size={50} />
        <View style={styles.friendTextContainer}>
          <Text style={styles.friendUsername}>{friendUser.username}</Text>
          <Text style={styles.friendUpdatedTime}>Hello</Text>
        </View>
          <View style={{flexDirection:'column',position:'absolute',right:10}}>
          <View style={styles.notificationCircle}>
            <Text style={styles.notificationText}>5</Text>
          </View>
          <Text style={styles.friendUpdatedTime}>{utils.formatTime(item.updated)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// function SearchButton({ user }) {
//   const requestConnect = useGlobal(state => state.requestConnect);
//   const cancelRequest = useGlobal(state => state.cancelRequest);
//   const requestAccept = useGlobal(state => state.requestAccept);
//   const data = {};
//   switch (user.status) {
//     case 'accepted':
//       data.text = 'Following';
//       data.disabled = false;
//       data.onPress = () => cancelRequest(user.username);
//       break;
//     case 'not-accepted':
//       data.text = 'Follow';
//       data.disabled = false;
//       data.onPress = () => requestConnect(user.username);
//       break;
//     case 'pending-them':
//       data.text = 'Requested';
//       data.disabled = false;
//       data.onPress = () => cancelRequest(user.username);
//       break;
//     case 'pending-me':
//       data.text = 'Accept';
//       data.disabled = false;
//       data.onPress = () => requestAccept(user.username);
//       break;
//     default:
//       break;
//   }

//   return (
//     <TouchableOpacity
//       style={[styles.searchButton, { backgroundColor: data.disabled ? '#505055' : '#202020' }]}
//       disabled={data.disabled}
//       onPress={data.onPress}
//     >
//       <Text style={{ color: data.disabled ? '#808080' : 'white', fontWeight: 'bold' }}>
//         {data.text}
//       </Text>
//     </TouchableOpacity>
//   );
// }

const Chat = () => {
  const { height, width } = Dimensions.get('window');
  const colorScheme = useColorScheme()
  const isDarkMode = colorScheme === 'dark'
  const animation = useSharedValue(0);
  const search = useSharedValue(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredData, setfilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [value, setValue] = useState(0);
  const searchList = useGlobal(state => state.searchList);
  const currentUser = useGlobal(state=>state.user)
  const searchUsers = useGlobal(state => state.searchUsers);
  const chatList = useGlobal(state => state.chatList);
  const getChat = useGlobal(state => state.getChat);
  const navigation = useNavigation()

  // Create a ref for the TextInput
  const searchInputRef = useRef(null);

  // Custom function to check if a string contains another string
  const contains = (str, query) => {
    return str.toLowerCase().includes(query.toLowerCase());
  };

  const isUserInChat = (username) => {
    return chatList.some(
      chat => chat.connection_user_1.username === username || chat.connection_user_2.username === username
    );
  };

  const Separator = () => (
    <View style={{ height: 20 }} />
  );

  const onRefresh = () => {
    getChat();
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const searchAnimation = useAnimatedStyle(() => {
    return {
      width: search.value === 1
        ? withTiming(300, { duration: 500 })
        : withTiming(0, { duration: 500 }),
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(width, { duration: 500 }),
      height: withTiming(height, { duration: 500 }),
      borderTopLeftRadius: withTiming(animation.value === 1 ? 0 : 40),
      borderTopRightRadius: withTiming(animation.value === 1 ? 0 : 40),

      elevation: 10,
      alignItems: 'center',
      position: 'absolute',
      marginTop: 20,
    };
  });

  useEffect(() => {
    if (query.trim()) {
      const formattedQuery = query.toLowerCase();
      const filteredData = chatList.filter(user =>
        contains(user.connection_user_1.username, formattedQuery) ||
        contains(user.connection_user_2.username, formattedQuery)
      );
      
      if (filteredData.length > 0) {
        setfilteredData(filteredData);
        console.log('filteredData', filteredData);
      } else {
        setfilteredData([]);
        searchUsers(query);
      }
    } else {
      setfilteredData([]);
    }
  }, [query]);
  const backgroundColor = 'rgba(255, 255, 255, 1)' // Background stays the same in both light and dark modes
  const textColor = isDarkMode ? '#000' : '#FFF'
  const cardBackgroundColor = isDarkMode ? 'rgba(253, 241, 245, 1)' : '#1e1e1e'
  const back = isDarkMode ? "#FFF" : '#494949'
  const borderColor = isDarkMode ? '#494949' : '#FFF' 
  const handleSearchIconPress = useCallback(() => {
    setValue(prevValue => {
      const newValue = prevValue === 1 ? 0 : 1;
      setIsSearchVisible(newValue === 1); // Show search box if newValue is 1
      search.value = newValue; // Update search.sharedValue
      return newValue;
    });
  }, [search]);

  useEffect(() => {
    // Focus on the TextInput when search is visible
    if (value === 1 && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100); // Delay to ensure the input is rendered
    }
  }, [value]);

  const renderSearchRow = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate("Other_Profile", { user: item })} 
      style={[styles.rowContainer, { backgroundColor: cardBackgroundColor }]}
    >
      <View style={[styles.userContainer, { backgroundColor: back, borderColor: borderColor }]}>
        <View style={styles.innerRow}>
          <View style={styles.thumbnailContainer}>
            <Thumbnail url={item.thumbnail} size={62} />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.searchUsername, { color: textColor }]} numberOfLines={1} ellipsizeMode='tail' >{item.username}</Text>
          </View>
          {/* Adding flexible space before the button */}
          <View style={{ flex: 1 }} />
          <View style={styles.buttonContainer}>
            <SearchButton user={item} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Reanimated.View style={[animatedStyle,{backgroundColor:cardBackgroundColor}]}>
            <View style={[styles.header]} >


              
            </View>
            {value === 0 && (
              <>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>DAILY TASK!</Text>
              </View>
              <View style={styles.taskContainer}>
                <Text style={{fontSize:10,flexWrap:'wrap'}}>uis nostrud exercitation ullamco laboris nisi ut aliquip </Text>
                <View style={{width:50,height:20,backgroundColor:'orange',marginLeft:120,marginTop:10,borderRadius:2,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity>
                  <Text style={{fontSize:10}}>01:00:00</Text>
                </TouchableOpacity>
              </View>
              </View>
              <Text style={{marginTop:30,color:'rgba(255, 0, 0, 1)',fontFamily:'Fredoka-Medium',fontSize:10,justifyContent:'center',alignItems:'center',marginLeft:20}}>uis nostrud exercitation ullamco laboris nisi ut aliquip! </Text>
              </>
            )}
            <View style={[styles.header]} >
              <View style={[styles.searchContainer,]}>
                  <TextInput
                    ref={searchInputRef}  // Set ref to TextInput
                    style={[styles.searchInput,{backgroundColor:back,color:textColor}]}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search..."
                    placeholderTextColor={textColor}
                  />

              </View>  
            </View>

            <View style={{
              flexDirection:'row',
              justifyContent:'space-evenly',

            }}>
              <View>
                <Text>All</Text>
              </View>
              <View>
              <Text>unread</Text>
              </View>
            </View>
            <FlatList
              style={{ paddingTop: 30 }}
              data={isSearchVisible && query.trim() && filteredData.length === 0 ? searchList : filteredData.length > 0 ? filteredData : chatList}
              renderItem={isSearchVisible && query.trim() && filteredData.length === 0 ? renderSearchRow : ({ item }) => {
                if(currentUser.username === item.connection_user_2.username){
                  if (isUserInChat(item.connection_user_2.username)) {
                  
                    return <FriendRow navigation={navigation} item={item} />;
                  } else {
                    return null;
                  }
                }
                else if (currentUser.username === item.connection_user_1.username){
                  if (isUserInChat(item.connection_user_1.username)) {
                  
                    return <FriendRow navigation={navigation} item={item} />;
                  } else {
                    return null;
                  }
                }
                
              }}
              keyExtractor={(item) => isSearchVisible && query.trim() === 0 && filteredData.length === 0 ? item.username : item.username}
              ListEmptyComponent={() =>
                isSearchVisible && query.trim() ? (
                  <Empty icon="triangle-exclamation" message={`No users found for "${query}"`} centered={false} />
                ) : (
                  <Empty icon="inbox" message="No messages yet" />
                )
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#E0FF05']}
                  tintColor="#E0FF05"
                  titleColor="#000000"
                  progressBackgroundColor="#E0FF05"
                />
              }
              ItemSeparatorComponent={Separator}
            />
          </Reanimated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchInput: {
    height: 52,
    borderRadius: 26,
    padding: 16,
    fontSize: 16,
    flex: 1,
    paddingLeft: 50,
    width: '85%',
  },
  toggleButton: {
    padding: 16,
    right: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    marginLeft:70
  },
  title: {
    fontWeight: '800',
    fontSize: 10,
    textAlign: 'left',
    fontFamily:"Fredoka-Medium"
  },
  manage: {
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'right',
    color: '#8A8CA9',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: Dimensions.get('window').width/1.09,
    backgroundColor:'rgba(255, 255, 255, 1)',
    height:76,
    borderRadius:15
  },
  friendTextContainer: {
    flexDirection: 'column',
    marginLeft: 12,
  },
  friendUsername: {
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 4,
  },
  friendUpdatedTime: {
    fontWeight: '400',
    fontSize: 14,
    color: '#606060',
  },
  notificationCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  notificationText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  searchButton: {
    paddingHorizontal: 14,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  searchUsername: {
    fontWeight:700,
    width:120,
    marginBottom: 4,
    fontSize:14,

  },
  rowContainer: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 16,
    paddingVertical: 0,
    
  },
  userContainer: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    // Android shadow
    elevation: 5, // Adds shadow for Android
    // iOS shadow
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 }, // Position of the shadow
    shadowOpacity: 0.1, // Opacity of the shadow
    shadowRadius: 5, // Blur effect of the shadow
  },
  innerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  thumbnailContainer: {
    marginLeft:20,
  },
  userInfo: {
    flex: 1,
    paddingLeft: 15,
    width:120
  },
  buttonContainer: {
    marginRight: 15, // Adds space between button and right edge
  },
  taskContainer:{
    width:335,
    height:75,
    backgroundColor:'rgba(255, 255, 255, 1)',
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff', // Set the background color of the task container
    shadowColor: 'blue', // Set the first shadow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, 
    shadowRadius: 10, // Adjust the shadow radius for the blur effect
    elevation: 15, // For Android shadow
    position: 'relative',
    // Additional glow effect
    shadowColor: 'rgba(235, 129, 69, 1)',
    shadowRadius: 30,
    shadowOpacity: 0.8,

  }
});



export default Chat;



