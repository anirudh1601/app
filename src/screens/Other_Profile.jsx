import { View, Text, Dimensions, StatusBar, StyleSheet, Image, useColorScheme } from 'react-native'
import React from 'react'
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler'
import SearchButton from '../common/SearchButton'
import utils from '../core/utils'
import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import useGlobal from '../core/global'

const Other_Profile = ({ navigation, route }) => {
    const user = route.params.user
    const profile = useGlobal(state=>state.profile)
    const screenWidth = Dimensions.get('window').width
    const colorScheme = useColorScheme()

    const handleGesture = ({ nativeEvent }) => {
        const { translationX, state } = nativeEvent

        if (state === State.END && translationX < -screenWidth / 2) {
            navigation.goBack()
        }
        if (state === State.END && translationX > screenWidth / 2) {
            navigation.goBack()
        }
        if (state === State.END && translationX > screenWidth / 3) {
            navigation.goBack()
        }
    }

    const isDarkMode = colorScheme === 'dark'
    const backgroundColor = '#E0FF05' // Background stays the same in both light and dark modes
    const textColor = isDarkMode ? '#000' : '#FFF'
    const cardBackgroundColor = isDarkMode ? '#FFF' : '#1e1e1e'
    const back = isDarkMode ? "#FFF" : '#494949'
    const borderColor = isDarkMode ? '#FFF' : '#494949' // Border color changes based on dark/light mode

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
                <View style={{ flex: 1 }}>
                    <View style={{
                        flex: 1,
                        backgroundColor: backgroundColor,
                    }}>
                        <StatusBar hidden={true} />
                        <TouchableOpacity onPress={handleSearchIconPress} style={styles.toggleButton}>
                <FontAwesomeIcon
                  icon={value === 1 ? 'times' : 'search'}
                  size={24}
                  color="#505050"
                />
              </TouchableOpacity>
                    </View>
                    <View style={{ flex: 3, backgroundColor: cardBackgroundColor }}>
                        <View style={[styles.card, { backgroundColor: back, borderColor: borderColor }]}>
                            <View style={styles.profileContainer}>
                                <Image source={utils.thumbnail(user.thumbnail)} style={styles.profileImage} />
                            </View>
                            <View style={styles.detailsContainer}>
                                <Text style={[styles.profileName, { color: textColor }]}>{user.username}</Text>
                                <View style={styles.buttonRow}>
                                    <SearchButton user={user} />
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 15, backgroundColor: 'white', borderRadius: 12, width: 32, height: 32 }}>
                                        <Image source={require("../assets/share.png")} style={styles.shareIcon} />
                                    </View>
                                </View>
                                
                            </View>
                            <Text style={{ color: textColor, alignSelf: 'flex-start', paddingLeft: 10, top: -30, fontSize: 13, fontWeight: '500'}}>About</Text>
                            <Text style={{ color: textColor, alignSelf: 'flex-start', paddingLeft: 10, top: -30, paddingTop: 5}}>Loream ipsum</Text>
                        </View>
                    </View>
                </View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '85%',
        top: '-12%',
        left: '8%',
        height: 265,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2, // Add border width
        // Android shadow
        elevation: 5, // Adds shadow for Android
        // iOS shadow
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 5 }, // Position of the shadow
        shadowOpacity: 0.1, // Opacity of the shadow
        shadowRadius: 5, // Blur effect of the shadow
    },
    profileContainer: {
        width: 95,
        height: 95,
        top: '-30%',
        borderRadius: 95 / 2, // Make the container circular
        overflow: 'hidden', // Ensure the image stays inside the circle
        backgroundColor: 'black',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5, // Spacing between image and name
    },
    detailsContainer: {
        position: 'relative',
        top: -65, // Adjust this based on your layout to keep it centered
        alignItems: 'center', // Center align both the text and the buttons
    },
    buttonRow: {
        flexDirection: 'row',
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareIcon: {
        width: 20, // Slightly larger for better visibility
        height: 20,
    }
})

export default Other_Profile
