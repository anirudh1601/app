import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import api from '../core/api';
import utils from '../core/utils';
import secure from '../core/secure';
import useGlobal from '../core/global';


const Face_verify = () => {
  const device = useCameraDevice('front');
  const user = useGlobal(state=>state.user)
  const camera = useRef(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const login = useGlobal(state=>state.login)
  const takePhoto = async () => {
    if (camera.current == null) return;

    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'balanced',
        enableAutoStabilization: true,
      });

      const fileUri = `file://${photo.path}`;
      setPhotoUri(fileUri);

      // Convert the photo to base64
      const base64String = await RNFS.readFile(photo.path, 'base64');
      
      // Assuming JPEG format for the image
      const base64Image = `data:image/jpeg;base64,${base64String}`;
      setPhotoBase64(base64Image);

      // utils.log('Base64 of the photo:', base64Image);
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const retakePhoto = () => {
    setPhotoUri(null);
    setPhotoBase64(null);
  };

  const verifyPhoto = async () => {
    try {
      if (photoBase64) {
        console.log('Face verify starts')
        const saved = await secure.get('credentials');
        console.log(saved)
        api({
          method: 'POST',
          url: '/face_verify/',
          data: {
            thumbnail: photoBase64,
            username:user.username,

          },
        })
        .then(response => {
          utils.log('Sign In:', response.data)
          const creds = {
            username:saved.username,
            password:saved.password
          }
          login(creds,response.data.user,response.data.tokens)
        })
        .catch(error => {
          if (error.response) {
            console.log('Error in response')
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log('Request error')
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          console.log(error.config);
        })
      } else {
        Alert.alert('Error', 'No photo to verify. Please take a photo first.');
      }
    } catch (error) {
      console.log('Error verifying photo:', error);
      Alert.alert('Error', 'Failed to verify photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={styles.fullScreenImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <Text style={styles.buttonText}>Retake Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.verifyButton} onPress={verifyPhoto}>
              <Text style={styles.buttonText}>Verify Photo</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {device && (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              ref={camera}
              photo={true}
            />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#E0FF05',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  retakeButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  verifyButton: {
    backgroundColor: '#5CFF5C',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Face_verify;
