import { FlatList,View, Text, TouchableOpacity,TextInput, Keyboard, Platform, InputAccessoryView, Dimensions } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useGlobal from '../core/global';
import Thumbnail from '../common/Thumbnail';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"

import { KeyboardAvoidingView,TouchableWithoutFeedback } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
function MessageHeader({ friend }) {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
      
      <TouchableOpacity onPress={() => navigation.navigate("Home")} >
      <FontAwesomeIcon
            icon='left-long'
            size={18}
            color={'black'}
          />
      </TouchableOpacity>
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Thumbnail url={friend.thumbnail} size={50} />
      <Text style={{ marginLeft: 10, fontSize: 15, fontWeight: 'bold' ,marginTop:10,color:'rgba(41, 41, 65, 1)'}}>
        {friend.username}
      </Text>
    </View>
    <TouchableOpacity>
    <FontAwesomeIcon
            icon='ellipsis-vertical'
            size={18}
            color={'black'}
          />
    </TouchableOpacity>
    </View>
  );
}


function MessageInput({message,setMessage,onSend,sendImage}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        paddingBottom: 10, // Optional padding from the bottom
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 25,
          borderColor: '#d0d0d0',
          backgroundColor: 'rgba(255, 255, 255, 1)',
          height: 50,
          width: Dimensions.get('window').width / 1.1,
          paddingHorizontal: 10,
          // Box shadow for iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          // Box shadow for Android
          elevation: 5,
        }}
      >
        <TextInput
          placeholder="Message..."
          placeholderTextColor='#909090'
          value={message}
          onChangeText={setMessage}
          style={{
            flex: 1,
            height: '100%',
            paddingLeft: 10,
            paddingRight: 50, // Ensure there is space for the icons
          }}
        />

        {/* Smile Icon */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 45,
            width: 30,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={()=>{
            launchImageLibrary({includeBase64:true},(response)=>{
              if(response.didCancel)return
              const file = response.assets[0]
              sendImage(file)
            })
          }}
        >
          <FontAwesomeIcon
            icon='face-smile'
            size={22}
            color={'#303040'}
          />
        </TouchableOpacity>

        {/* Send Icon */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
            width: 30,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(239, 149, 82, 1)',
            borderRadius: 15
          }}
          onPress={onSend}
        >
          <FontAwesomeIcon
            icon='paper-plane'
            size={18}
            color={'white'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MessageBubbleMe({ text }) {
	return (
		<View
			style={{
				flexDirection: 'row',
				padding: 4,
				paddingRight: 12
			}}
		>
			<View style={{ flex: 1}} />
			<View
				style={{
					backgroundColor: 'rgba(239, 149, 82, 1)',
					borderRadius: 15,
					maxWidth: '75%',
					paddingHorizontal: 16,
					paddingVertical: 12,
					justifyContent: 'center',
					marginRight: 8,
					minHeight: 42
				}}
			>
				<Text
					style={{
						color: 'white',
						fontSize: 16,
						lineHeight: 18
					}}
				>
					{text}
				</Text>
			</View>
			
		</View>
	)
}


function MessageBubbleFriend({ text='', friend, typing=false }) {
	return (
		<View
			style={{
				flexDirection: 'row',
				padding: 4,
				paddingLeft: 16
			}}
		>

			<View
				style={{
					backgroundColor: 'rgba(235, 234, 234, 1)',
					borderRadius: 15,
					maxWidth: '75%',
					paddingHorizontal: 16,
					paddingVertical: 12,
					justifyContent: 'center',
					marginLeft: 8,
					minHeight: 42
				}}
			>
				{typing ? (
					<View style={{ flexDirection: 'row' }}>
						<MessageTypingAnimation offset={0} />
						<MessageTypingAnimation offset={1} />
						<MessageTypingAnimation offset={2} />
					</View>
				) : (
					<Text
						style={{
							color: '#202020',
							fontSize: 16,
							lineHeight: 18
						}}
					>
						{text}
					</Text>
				)}
				
			</View>
			<View style={{ flex: 1}} />
		</View>
	)
}


function MessageBubble({ index, message, friend }) {


	return message.is_me ? (
		<MessageBubbleMe text={message.message} />
	) : (
		<MessageBubbleFriend text={message.message} friend={friend} />
	)
}


const Messages = ({ route }) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  const item = route.params;
  const connectionId = item.id 
  const currentUser = useGlobal((state) => state.user);
  const messageSend = useGlobal(state=>state.messageSend)
  const messageList = useGlobal(state=>state.messageList)
  const messagesList = useGlobal(state=>state.messagesList)
  const friendUser =
    item.connection_user_1.username === currentUser.username
      ? item.connection_user_2
      : item.connection_user_1;
    
  const [message,setMessage] = useState('')

  useEffect(()=>{
    messageList(connectionId)
  },[])

  function onSend(){

    const cleaned = message.replace(/\s+/g,' ').trim()

    if (cleaned.length === 0) return
    messageSend(connectionId,cleaned,friendUser.username,'text')
    setMessage('');

  }

  function sendImage(file){
    messageSend(connectionId,file,friendUser.username,'image')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MessageHeader friend={friendUser} />
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{
          flex:1,
        }}> 
        <FlatList

					automaticallyAdjustKeyboardInsets={true}
					contentContainerStyle={{
						paddingTop: 10,

					}}
					data={ [...messagesList]}
					inverted={true}
					keyExtractor={item => item.id}
					renderItem={({ item, index}) => (
						<MessageBubble
							index={index}
							message={item}
							friend={friendUser}
						/>
					)}
				/>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {Platform.OS === 'ios' ? (
        <InputAccessoryView>
        <MessageInput message={message} setMessage={setMessage} onSend={onSend} sendImage={sendImage}/>
        </InputAccessoryView>
      ):(
        <MessageInput message={message} setMessage={setMessage} onSend={onSend} sendImage={sendImage}/>
      )}
    </SafeAreaView>
  );
};

export default Messages;
