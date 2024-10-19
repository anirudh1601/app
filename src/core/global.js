// useStore.js
import {create} from 'zustand';
import secure from './secure';
import api, { ADDRESS } from './api';
import utils from './utils';
import { act } from 'react';
import ReconnectingWebSocket from 'react-native-reconnecting-websocket'
import PushNotificationIOS from '@react-native-community/push-notification-ios';


function responseMessageSend(set,get,data){
  const messagesList = [data,...get().messagesList]
  console.log(messagesList)
  set((state)=>({
    messagesList:messagesList

  }))
  PushNotificationIOS.addNotificationRequest({
    id:'1',
    title:'New message',
    body:'hello'
  })
}

function responseMessageList(set,get,data){

  set((state)=>({
    messagesList:[...get().messagesList, ...data.messages]

  }))
}

function responseChatList(set, get, chatList) {
	set((state) => ({
		chatList: chatList
	}))
}

function responseRequestAccept(set,get,connection){
  const user = get().user
  if (user.username === connection.request_receiver.username) {
		const requestList = [...get().requestList]
		const requestIndex = requestList.findIndex(
			request => request.id === connection.id
		)
		if (requestIndex >= 0) {
			requestList.splice(requestIndex, 1)
			set((state) => ({
				requestList: requestList
			}))
		}
	} 
	// If the corresponding user is contained within the  
	// searchList for the  acceptor or the  acceptee, update 
	// the state of the searchlist item

	const sl = get().searchList
	if (sl === null) {
		return
	}
	const searchList = [...sl]

	let  searchIndex = -1
	// If this user  accepted
	if (user.username === connection.request_receiver.username) {
		searchIndex = searchList.findIndex(
			user => user.username === connection.request_sender.username
      
		)
    if (searchIndex === 0 ){
      
      connection.request_receiver.status = 'accepted'
      console.log('connection receiver',connection.request_receiver.status)
      set((state)=>({
        profile:connection.request_receiver
      }))
    }
    if (searchIndex >= 0) {
      searchList[searchIndex].status = 'accepted'
      set((state) => ({
        searchList: searchList
        
      }))
    }
	// If the other user accepted
	} else {
		searchIndex = searchList.findIndex(
			user => user.username === connection.request_receiver.username
		)
    if (searchIndex >= 0) {
      searchList[searchIndex].status = 'not-accepted'
      set((state) => ({
        searchList: searchList
      }))
    }
	}
}

function responseRequestList(set,get,requestList){
  set((state)=>({
    requestList:requestList
  }))
}




function requestSent(set,get,connection){
  const user = get().user
  //if i am the user sending request change the follow button
  if (user.username == connection.request_sender.username){
    const searchList = [...get().searchList] //... because to deconstruct the list
    const searchIndex = searchList.findIndex(
      request => request.username === connection.request_receiver.username
    )
    console.log("Current search list:", searchIndex);
    if (searchIndex === 0 ){
      
      connection.request_receiver.status = 'pending-them'
      console.log('connection receiver',connection.request_receiver.status)
      set((state)=>({
        profile:connection.request_receiver
      }))
    }

    else if (searchIndex >=0){
      searchList[searchIndex].status = 'pending-them'
      set((state)=>({
        searchList:searchList
      }))
    }

  }
  

  else{
    set((state)=>({
      searchList:connection
    }))
  }
  
}

function responseRequestCancel(set, get, connection) {
  const user = get().user;
  
  // Ensure the user is logged in
  if (user.username) {
    const searchList = [...get().searchList]; // Clone searchList
    
    const searchIndex = searchList.findIndex(
      request => request.username === connection
    );
    if (searchIndex === 0 ){
      
      connection.status = 'not-accepted'
      console.log('connection receiver',connection)
      set((state)=>({
        profile:connection
      }))
    }
    // If the request is found in the searchList, update its status
    if (searchIndex >= 0) {
      
      searchList[searchIndex].status = 'not-accepted'; // Mark as not accepted
      console.log("Updated searchList:", searchList);
      // Update state with the modified searchList
      set((state) => ({
        searchList: searchList
      }));
    }
  } 
  // In case no user is found, reset searchList with data
  else {
    set((state) => ({
      searchList: connection
    }));
  }
}


function responseStatus(set,get,data){
  if (data.active === "active"){
    set((state=>({
      active:true,
    })))
  }
}

function responseSearch(set,get,data){
  set((state)=>({
    searchList:data
  }))
}




const useGlobal = create((set,get) => ({

  
  activeButton: 'Signup', 
  setActiveButton: (button) => set({ activeButton: button }),
  
  initialized:false,
  active:false,


  refreshTokens: async () => {
    const tokens = await secure.get('tokens');
    if (tokens && tokens.refresh) {
      try {
        const response = await api({
          method: 'POST',
          url: '/token/refresh/',  
          data: {
            refresh: tokens.refresh,
          },
        });
        if (response.status === 200) {
          const newTokens = response.data;
          secure.set('tokens', newTokens);
          utils.log('Tokens refreshed', newTokens);
        } else {
          throw 'Token refresh failed';
        }
      } catch (error) {
        utils.log('useGlobal.refreshTokens:', error);
      }
    }
  },

  init: async () => {
    const credentials = await secure.get('credentials')

    if (credentials){

      try{
        const response = await api({
          method: 'POST',
          url: '/signin/',
          data: {
            username: credentials.username,
            password: credentials.password
          }
        })
        if (response.status !== 200){
          throw 'Auth error'
        }
        const user = response.data.user
        const tokens = response.data.tokens
        console.log('init active',user.is_active)
        if(user.is_active === false){
          secure.set('tokens', tokens)
          set((state=>({
            initialized:true,
            authenticated:true,
            user:user,
            active:false
          })))
        }
        secure.set('tokens', tokens)
        set((state=>({
          
          initialized:true,
          authenticated:true,
          user:user,
          active:true
        })))
        return
      }catch(error){
          utils.log('useGlobal.init:',error)
      } 
    }
    set((state=>({
      initialized:true,
    })))
  },

  // authenticate
  authenticated:false,
  
  user:{},
  login:(credentials,user,tokens)=>{
    console.log("login active",user.is_active)
    secure.set('credentials',credentials)
    secure.set('tokens', tokens)
    if (user.is_active === false){
      set((state=>({
        authenticated:true,
        user:user,
        active:false
      })))
    }
    else{
      set((state=>({
        authenticated:true,
        user:user,
        active:true
      })))
    }
  },


  register: (credentials, user, tokens) => {
    console.log("regoster active",user.is_active)
		secure.set('credentials', credentials)
		secure.set('tokens', tokens)
		set((state) => ({
			authenticated: false,
			user: user
		}))
	},

  otp:(secret,valid)=>{
    secure.set('secret',secret)
    secure.set('valid',valid)
  },

  logout:()=>{
    secure.wipe()
    set((state=>({
      authenticated:false,
      user:{}
    })))
  },



  //-------------------------
  //  Websocket
  //-------------------------
  socket:null,
  

  socketConnect:async()=>{
    const tokens = await secure.get('tokens');
    const socket = new ReconnectingWebSocket(
      `wss://${ADDRESS}/chat/?token=${tokens.access}`
    )

    socket.onopen=()=>{
      console.log('open',socket)
      socket.send(JSON.stringify({
        source:'request.list',
      }))
      socket.send(JSON.stringify({
        source:'chat.list',
      }))
      utils.log('onpen')
    }
    socket.onmessage=(event)=>{
      const parsed= JSON.parse(event.data)
      utils.log('onmessage',parsed)
      const responses = {
        // 'thumbnail':uploadThumbnail,
        'search':responseSearch,
        'task_status':responseStatus,
        'request.send':requestSent,
        'request.list':responseRequestList,
        'request.accept':responseRequestAccept,
        'request.cancel':responseRequestCancel,
        'chat.list':responseChatList,
        'message.list':responseMessageList,
        'chat.message':responseMessageSend,
      }
      const resp = responses[parsed.source]
      if(!resp){
        utils.log('parsed.source'+parsed.source+'not found')
        return
      }
      resp(set,get,parsed.data)

      if (parsed.active === "active"){
        set((state=>({
          active:true,
        })))
      }
    }
    socket.onclose=(e)=>{
      utils.log('onclose',e)
    }
    socket.onerror=(e)=>{
      utils.log('onerror',e)
    }
    set((state) => ({
			socket: socket
		}))
  },

  socketClose: () => {
		const socket =  get().socket
    console.log(socket)
		if (socket) {
			socket.close()
		}
		set((state) => ({
			socket: null
		}))
	},


  //--------------------------
  //     upload thumbnail     
  //--------------------------

  uploadThumbnail: (file) => {
		const socket = get().socket
    console.log('socket is ',socket)
		socket.send(JSON.stringify({
			source: 'thumbnail',
			base64: file.base64,
			filename: file.fileName
		}))
	},

  //--------------------------
  //    SearchList     
  //--------------------------

  searchList:null,
  searchUsers: (query) => {
    if(query){
      const socket = get().socket
      socket.send(JSON.stringify({
        source: 'search',
        query: query,
      }))
    }else{
      set((state)=>({
        searchList:null
      }))
    }
		
	},

  //--------------------------
  //    Requests     
  //--------------------------

  requestsList:null,
  chatList:null,
  profile:null,
  requestConnect: (username) => {
    if(username){
      const socket = get().socket
      socket.send(JSON.stringify({
        source: 'request.send',
        request_receiver: username,
      }))
    }else{
      set((state)=>({
        searchList:null,
        profile:null,
      }))
    }
		
	},

  requestAccept: (username) => {
    if(username){
      const socket = get().socket
      socket.send(JSON.stringify({
        source: 'request.accept',
        request_receiver: username,
      }))
    }else{
      set((state)=>({
        searchList:null,
        profile:null,
      }))
    }
		
	},

  cancelRequest: (username) => {
    if(username){
      const socket = get().socket
      socket.send(JSON.stringify({
        source: 'request.cancel',
        request_receiver: username,
      }))
    }else{
      set((state)=>({
        searchList:null,
        profile:null,
      }))
    }
		
	},

  getChat:() => {
    const socket = get().socket
    socket.send(JSON.stringify({
      source:'chat.list',
    }))
  },



  //--------------------------
  //   Messages  
  //--------------------------
  
  messageSend: (connectionId,message,other_user,message_type) =>{
    const socket = get().socket
    socket.send(JSON.stringify({
      source:'chat.message',
      connectionId:connectionId,
      message_type:message_type,
      other_user:other_user,
      message:message

    }))
  },

  messagesList:[],

  messageList: (connectionId,friend,page=0) =>{
    if ( page === 0){
      set((state)=>({
        messagesList:[],
      }))
    }
    const socket = get().socket
    socket.send(JSON.stringify({
      source:'message.list',
      connectionId:connectionId,
      page:page,


    }))
  },
  
}));

export default useGlobal;
