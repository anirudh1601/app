import { View, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../common/Input";
import useGlobal from "../core/global";
import api from "../core/api";
import utils from "../core/utils";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2Error, setPassword2Error] = useState("");
  const register = useGlobal(state=>state.register)
  const { activeButton, setActiveButton } = useGlobal(state => ({
    activeButton: state.activeButton,
    setActiveButton: state.setActiveButton,
  }));

  const handleNavigation = (button) => {
    setActiveButton(button);
    navigation.navigate(button); // Assuming you navigate to the same page for both buttons; change as needed
  };
  function onSignUp() {
		// Check username
		// const failUsername = !username || username.length < 5
		// if (failUsername) {
		// 	setUsernameError('Username must be >= 5 characters')
		// }
		// // Check password1
		// const failPassword1 = !password1 || password1 < 8
		// if (failPassword1) {
		// 	setPassword1Error('Password is too short')
		// }
		// // Check password2
		// const failPassword2 = password1 !== password2
		// if (failPassword2) {
		// 	setPassword2Error('Passwords don\'t match')
		// }
		// // Break out of the fucntion if there were any issues
		// if (failUsername ||
		// 		failPassword1 ||
		// 		failPassword2) {
		// 	return
		// }

		// Make signin request
		api({
			method: 'POST',
			url: '/signup/',
			data: {
				username: username,
				password: password1
			}
		})
		.then(response => {
			utils.log('Sign Up:', response.data)
			
			const credentials = {
				username: username,
				password: password1
			}
			register(
				credentials,
				response.data.user,
				response.data.tokens
			)
      navigation.navigate('Otp')
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
          <View style={{ flex: 3, justifyContent: "center", paddingHorizontal: 26 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 24,
                fontFamily: "EricaOne-Regular",
                color: "#FFFFFF",
              }}
            >
              SIGNUP
            </Text>
            <View style={{ marginTop: 20 }}>
              <Input
                title="Username"
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
              <Input
                title="Retype Password"
                value={password2}
                error={password2Error}
                setValue={setPassword2}
                setError={setPassword2Error}
                secureTextEntry={true}
              />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E0FF05",
                    height: 52,
                    width: 190,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                  onPress={onSignUp}
                >
                  <Text
                    style={{
                      color: "black",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Register Now
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Centered "LET'S GO" and "REGISTER" buttons with spacing */}
              <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
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
};

export default Signup;
