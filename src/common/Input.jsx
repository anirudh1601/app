import { View, TextInput, Dimensions } from "react-native"
import React, { useState } from 'react';

function Input({ title, value, error, setValue, setError, secureTextEntry=false,type="default" }) {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View style={{ alignItems: "center", justifyContent: "center", marginVertical: 16 }}>
			<TextInput
				autoCapitalize="none"
				keyboardType={type}
				autoComplete="off"
				onChangeText={text => {
					setValue(text)
					if (error) {
						setError('')
					}
					// Set focus state based on input value
					if (text.length > 0) {
						setIsFocused(false); // Reset focus state once text is entered
					}
				}}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				secureTextEntry={secureTextEntry}
				placeholder={error ? error : title}
				placeholderTextColor={error ? '#ff5555' : '#666161'}
				style={{
					backgroundColor: '#FFFFFF',
					borderWidth: 1,
					borderColor: error ? '#ff5555' : 'transparent',
					borderRadius: 15,
					height: 54,
					width: Dimensions.get('window').width / 1.1,
					fontSize: 16,
					textAlignVertical: 'center',
					paddingLeft: value || isFocused ? 10 : 30, // Change padding based on value and focus
				}}
				value={value}
			/>
		</View>
	)
}

export default Input
