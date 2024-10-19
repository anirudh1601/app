import { View, Text, SafeAreaView, StatusBar,Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'

const Splash = ({navigation}) => {
  return (
    <SafeAreaView style={{flex:1}}>

      <StatusBar barStyle='dark-content' />
      <View 
            style={{backgroundColor:"#1E1E1E",height:Dimensions.get('window').height,width:Dimensions.get('window').width}}
          >
            
        <LinearGradient colors={['#FEF7FF', '#989499']} style={{
          width:Dimensions.get('window').width,
          height:Dimensions.get('window').height/3.4,
          borderTopLeftRadius:0,
          borderTopRightRadius:0,
          borderBottomLeftRadius:50,
          borderBottomRightRadius:50,
          
          alignItems:"center"


        }}>
        <View 
        >
          <Image source={require("../assets/bird.png")} 
            style={{width:257,height:235,}}
          
          />
          
          </View>
          </LinearGradient>
          <View style={{paddingHorizontal:40,marginTop:40,justifyContent:"center",alignItems:'center'}}>
          <Text style={{color:"#FEF7FF",fontSize:40,fontFamily:"Fredoka-Medium",fontWeight:"bold"}}>WELCOME TO</Text>
            <Text style={{color:"#E0FF05",fontSize:40,fontFamily:"EricaOne-Regular",alignItems:"flex-end",}}>
                FORTEENS
            </Text>
            <TouchableOpacity style={{width:126,height:41,borderRadius:26,
            backgroundColor:"#FFFFFF",textAlign:"center",
              justifyContent:"center",marginTop:25}} onPress={()=>navigation.navigate("Signup")}>
              <Text style={{fontSize:16,color:"#000000",fontWeight:"bold",
              fontFamily:"Fredoka-Medium",paddingLeft:10,marginTop:15}}>
                LET'S GO
                
                </Text>
                <Image source={require('../assets/arrow.png')} style={{width:19,bottom:19,left:95}}/>
              </TouchableOpacity>
              <Text style={{justifyContent:"center",textAlign:"center",paddingTop:90,fontWeight:"bold",fontSize:20,
                color:"#FEF7FF"}}>
                Discover Your
                </Text>
                <Text style={{justifyContent:"center",textAlign:"center",paddingTop:10,fontWeight:"bold",fontSize:20,
                color:"#FEF7FF"}}>
                Own Dream House
                </Text>
                </View>
          </View>
          
            {/* <Text style={{color:"#1E1E1E",fontSize:40,paddingLeft:30,fontFamily:"Fredoka-Medium",fontWeight:"bold"}}>WELCOME TO</Text>
            <Text style={{color:"#E0FF05",paddingLeft:150,fontSize:40,fontFamily:"EricaOne-Regular",alignItems:"flex-end",}}>
                FORTEENS
            </Text>
            <Text style={{fontSize:40,justifyContent:"center",textAlign:"center",color:"#000000",fontWeight:"bold",
              paddingTop:50}}>
              >>
              </Text>
              <Text style={{justifyContent:"center",textAlign:"center",paddingTop:90,fontWeight:"bold",fontSize:20,
                color:"#1E1E1E"}}>
                Discover Your
                </Text>
                <Text style={{justifyContent:"center",textAlign:"center",paddingTop:10,fontWeight:"bold",fontSize:20,
                color:"#1E1E1E"}}>
                Own Dream House
                </Text> */}
        

    </SafeAreaView>
  )
}

export default Splash