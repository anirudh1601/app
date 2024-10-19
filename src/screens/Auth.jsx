import { View, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../common/Input";
import useGlobal from "../core/global";
import api from "../core/api";
import utils from "../core/utils";
import { useEffect } from "react";
const Auth = ({ navigation }) => {
  const [isSignin, setIsSignin] = useState(true);
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2Error, setPassword2Error] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const login = useGlobal(state => state.login);
  const register = useGlobal(state => state.register);

  const { activeButton, setActiveButton } = useGlobal(state => ({
    activeButton: state.activeButton,
    setActiveButton: state.setActiveButton,
  }));

  useEffect(() => {
    // Set "Signup" as the default active button when the component mounts
    setActiveButton("Signup");
    setIsSignin(false)
  }, []);
  const handleNavigation = (button) => {
    setActiveButton(button);
    setIsSignin(button === 'Signin');
  };

  const onSignIn = () => {
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
        username: username,
        password: password1
      };
      utils.log('Sign In:', response.data);
      login(creds, response.data.user, response.data.tokens);
    })
    .catch(error => handleError(error));
  };

  const onSignUp = () => {
    api({
      method: 'POST',
      url: '/signup/',
      data: {
        username: username,
        password: password1,
        phone: phone
      }
    })
    .then(response => {
      utils.log('Sign Up:', response.data);
      const credentials = {
        username: username,
        password: password1
      };
      register(credentials, response.data.user, response.data.tokens);
      navigation.navigate('Otp');
    })
    .catch(error => handleError(error));
  };

  const handleError = (error) => {
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
  };

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
              {isSignin ? 'SIGNIN' : 'SIGNUP'}
            </Text>
            <View style={{ marginTop: 20 }}>
              <Input
                title="Username"
                value={username}
                error={usernameError}
                setValue={setUsername}
                setError={setUsernameError}
              />
              {isSignin ? (
                <>
                  <Input
                    title="Password"
                    value={password1}
                    error={password1Error}
                    setValue={setPassword1}
                    setError={setPassword1Error}
                    secureTextEntry={true}
                  />
                  <View style={{justifyContent:'center',alignItems:'center'}}>
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
                </>
              ) : (
                <>
                  
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
                  <View style={{justifyContent:'center',alignItems:'center'}}>
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
                      REGISTER NOW
                    </Text>
                  </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={{ marginTop: 30, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: activeButton === "Signup" ? "#29AB87" : "transparent",
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
                    backgroundColor: activeButton === "Signin" ? "#29AB87" : "transparent",
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

export default Auth;
