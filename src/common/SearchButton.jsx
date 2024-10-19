import { View, Text ,TouchableOpacity, StyleSheet} from 'react-native'
import React, { useState } from 'react'
import useGlobal from '../core/global';

function SearchButton({ user }) {
    const requestConnect = useGlobal(state => state.requestConnect);
    const cancelRequest = useGlobal(state => state.cancelRequest);
    const requestAccept = useGlobal(state => state.requestAccept);
    const profile = useGlobal(state=>state.profile)
    const searchList = useGlobal(state=>state.searchList)

    const data = {};
    let updatedUser = profile?.username === user.username ? profile : searchList.find(u => u.username === user.username) || user;
    console.log(updatedUser)
    switch (updatedUser.status) {
      case 'accepted':
        data.text = 'Following';
        data.disabled = false;

        data.onPress = () => cancelRequest(updatedUser.username);
        break;
      case 'not-accepted':
        data.text = 'Follow';
        data.disabled = false;
        data.onPress = () => requestConnect(updatedUser.username);
        break;
      case 'pending-them':
        data.text = 'Requested';
        data.disabled = false;
        data.onPress = () => cancelRequest(updatedUser.username);
        break;
      case 'pending-me':
        data.text = 'Accept';
        data.disabled = false;
        data.onPress = () => requestAccept(updatedUser.username);
        break;
      default:
        break;
    }

    return (
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: data.text==='Following' ? '#29AB87' : '#081d40' }]}
          disabled={data.disabled}
          onPress={data.onPress}
        >
          <Text style={{ color: data.text === 'Following' ? 'black' : 'white', fontWeight: 'bold' }}>
            {data.text}
          </Text>
        </TouchableOpacity>
      );
}  
const styles = StyleSheet.create({
    searchButton: {
        paddingHorizontal: 14,
        height: 36,
        width:109,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,

      }
})
export default SearchButton

