import { View, Text, TouchableWithoutFeedback,Image, KeyboardAvoidingView, Keyboard, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../common/Input";
import useGlobal from "../core/global";
import LinearGradient from 'react-native-linear-gradient'
import api from "../core/api";
import utils from "../core/utils";

const Signin = ({ navigation }) => {
  const [username, setUsername] = useState("");

  const [password1, setPassword1] = useState("");

  const [usernameError, setUsernameError] = useState("");

  const [password1Error, setPassword1Error] = useState("");
  const login = useGlobal(state=>state.login)

  const { activeButton, setActiveButton } = useGlobal(state => ({
    activeButton: state.activeButton,
    setActiveButton: state.setActiveButton,
  })); // Set "Signin" as the default active button

  const handleNavigation = (button) => {
    setActiveButton(button);
    navigation.navigate(button); // Navigate to the selected page
  };

  function onSignIn(){
    console.log(username,password1)
    api({
			method: 'POST',
			url: '/signin/',
			data: {
				username: username,
				password: password1
			}
		})
		.then(response => {
      const creds = {
        username:username,
        password:password1
      }
			utils.log('Sign In:', response.data)
      login(creds,response.data.user,response.data.tokens)
    })
    .catch(error => {
			if (error.response) {
        console.log('error in response')
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			} else if (error.request) {
        console.log('req error')
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
              SIGNIN
            </Text>
            <View style={{ marginTop: 20 }}>
              <Input
                title="Username or Mobile Number"
                value={username}
                error={usernameError}
                setValue={setUsername}
                setError={setUsernameError}
              />
              <Input
                title="Password"
                value={password1}
                error={password1Error}
                setValue={setPassword1}
                setError={setPassword1Error}
                secureTextEntry={true}
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
                  onPress={onSignIn}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    SIGN IN
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Centered "LET'S GO" and "REGISTER" buttons with spacing */}
              <View style={{ marginTop: 90, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: activeButton === "Signup" ? "#29AB87" : "transparent", // Conditionally set background color
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                  onPress={() => handleNavigation("Signup")}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Fredoka-Medium",
                    }}
                  >
                    REGISTER
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: activeButton === "Signin" ? "#29AB87" : "transparent", // Conditionally set background color
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}
                  onPress={() => handleNavigation("Signin")}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Fredoka-Medium",
                    }}
                  >
                    SIGN IN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default Signin;
