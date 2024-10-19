import axios from 'axios'
import { Platform } from 'react-native'


export const ADDRESS = 'f2e0-2405-201-e022-48bb-cd2c-f985-16fa-e1ea.ngrok-free.app'

const api = axios.create({
	baseURL: 'https://' + ADDRESS,
	headers: {
		'Content-Type': 'application/json'
	}
})

export default api