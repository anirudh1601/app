import { View,StyleSheet, Text, TouchableWithoutFeedback,Image, KeyboardAvoidingView, Keyboard, Dimensions, TouchableOpacity } from "react-native";
import Input from "../common/Input";
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import useGlobal from "../core/global";
import api from "../core/api";
import utils from "../core/utils";
import secure from "../core/secure";

const OTP_verification = ({navigation}) => {
    const user = useGlobal(state=>state.user)
    const login = useGlobal(state=>state.login)
    const [OTP, setOTP] = useState("");
    const [OTPError, setOTPError] = useState("");

    const send_verification = async () => {
      try {
        // Retrieve secret and valid values from secure storage
        const secret = await secure.get('secret');
        const valid = String(await secure.get('valid'));
        
        console.log("OTP is", OTP);
        console.log("secret", secret);
        console.log("valid", valid);
  
        // Send API request for OTP verification
        const response = await api({
          method: 'POST',
          url: '/otp_verify/',
          data: {
            username: user.username,
            otp: OTP,
            secret: secret,
            validity: valid,
          },
        });
  
        utils.log('Sign Up:', response.data);
        navigation.navigate('Face_verify');

        
      } catch (error) {
        // Handle errors
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
      }
    };

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
                        marginBottom:30,
                        }}
                    >
                        OTP Verification
                    </Text>
                    <OtpInput
  numberOfDigits={6}
  focusColor="#E0FF05"
  focusStickBlinkingDuration={500}
  onFilled={(text) => setOTP(text)}
  textInputProps={{
    accessibilityLabel: "One-Time Password",
  }}
  theme={{
    pinCodeTextStyle: styles.pinCodeText,

  }}
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
                  onPress={send_verification}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Verify
                  </Text>
                </TouchableOpacity>
              </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    pinCodeText: {
      color: "white",
    },

  });
export default OTP_verification