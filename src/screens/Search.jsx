import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import Empty from "../common/Empty";
import Thumbnail from "../common/Thumbnail";
import useGlobal from "../core/global";
import Cell from "../common/Cell";
import SearchButton from "../common/SearchButton";

// function SearchButton({ user }) {
//   const requestConnect = useGlobal(state => state.requestConnect);
//   const data = {};

//   switch (user.status) {
//     case "accepted":
//       data.text = 'Following';
//       data.disabled = false;
//       data.onPress = () => cancelConnection(user.username);
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
//       data.onPress = () => {};
//       break;
//     default: break;
//   }

//   return (
//     <TouchableOpacity
//       style={{
//         backgroundColor: data.disabled ? '#505055' : '#202020',
//         paddingHorizontal: 14,
//         height: 36,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 18
//       }}
//       disabled={data.disabled}
//       onPress={data.onPress}
//     >
//       <Text
//         style={{
//           color: data.disabled ? '#808080' : 'white',
//           fontWeight: 'bold'
//         }}
//       >
//         {data.text}
//       </Text>
//     </TouchableOpacity>
//   );
// }

function SearchRow({ user }) {
  return (
    <Cell>
      <Thumbnail
        url={user.thumbnail}
        size={76}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            color: '#202020',
            marginBottom: 4
          }}
        >
          {user.username}
        </Text>
      </View>
      <SearchButton user={user} />
    </Cell>
  );
}

function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const searchList = useGlobal(state => state.searchList);
  const searchUsers = useGlobal(state => state.searchUsers);

  useEffect(() => {
    searchUsers(query);
  }, [query]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderColor: '#f0f0f0',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <TextInput
          style={{
            backgroundColor: '#e1e2e4',
            height: 52,
            borderRadius: 26,
            padding: 16,
            fontSize: 16,
            flex: 1,
            paddingLeft: 50
          }}
          value={query}
          onChangeText={setQuery}
          placeholder='Search...'
          placeholderTextColor='#b0b0b0'
        />
        <FontAwesomeIcon
          icon='magnifying-glass'
          size={20}
          color='#505050'
          style={{
            position: 'absolute',
            left: 38,
            top: 30
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.cancelButton}
        >
          <FontAwesomeIcon
            icon='times' // 'times' icon for cancel
            size={24}
            color='#505050'
          />
        </TouchableOpacity>
      </View>

      {searchList === null ? (
        <Empty
          icon='magnifying-glass'
          message='Search for friends'
          centered={false}
        />
      ) : searchList.length === 0 ? (
        <Empty
          icon='triangle-exclamation'
          message={'No users found for "' + query + '"'}
          centered={false}
        />
      ) : (
        <FlatList
          data={searchList}
          renderItem={({ item }) => (
            <SearchRow user={item} />
          )}
          keyExtractor={item => item.username}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    padding: 10,
    marginLeft: 8,
  },
});

export default SearchScreen;
