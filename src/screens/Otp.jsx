import { View, Text, TouchableWithoutFeedback,Image, KeyboardAvoidingView, Keyboard, Dimensions, TouchableOpacity } from "react-native";
import Input from "../common/Input";
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from "react";
import useGlobal from "../core/global";
import api from "../core/api";
import utils from "../core/utils";


const Otp = ({navigation}) => {
    const user = useGlobal(state=>state.user)
    const [mobilenumber, setMobilenumber] = useState("");
    const [mobilenumberError, setMobilenumberError] = useState("");
    const otp = useGlobal(state=>state.otp)
    const register = useGlobal(state=>state.register)

    function send_OTP(){
        console.log(mobilenumber)
        api({
          method: 'POST',
          url: '/send_otp/',
          data: {
            username: user.username,
            phone_number: mobilenumber
          }
        })
        .then(response => {
          utils.log('Sign Up:', response.data)
          otp(response.data.otp_secret_key,response.data.otp_valid_date)
          navigation.navigate('OTP_verification')
        })
        .catch(error => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          console.log(error.config);
        })
      }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 26,width:Dimensions.get('window').width }}>
            
                    <Text
                        style={{
                        textAlign: "center",
                        fontSize: 24,
                        fontFamily: "EricaOne-Regular",
                        color: "#FFFFFF",
                        }}
                    >
                        Enter your phone number
                    </Text>
                    <Input
                        title="Mobile Number"
                        type="numeric"
                        value={mobilenumber}
                        error={mobilenumberError}
                        setValue={setMobilenumber}
                        setError={setMobilenumberError}
                    />
                    <View style={{ justifyContent: "center", alignItems: "center" }} >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E0FF05",
                    height: 52,
                    width: 190,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30,
                  }}
                  onPress={send_OTP}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Send OTP
                  </Text>
                </TouchableOpacity>
              </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Otp