import EncryptedStorage from "react-native-encrypted-storage";
import utils from "./utils";

async function set(key,object) {
    try{
        await EncryptedStorage.setItem(key,JSON.stringify(object))

    }catch(error){
        utils.log('secure.set:',error)
    }
}


async function get(key,object) {
    try{
        const data = await EncryptedStorage.getItem(key)
        if (data !== undefined){
            return JSON.parse(data)
        }

    }catch(error){
        utils.log('secure.get:',error)
    }
}

async function remove(key,object) {
    try{
        await EncryptedStorage.removeItem(key)

    }catch(error){
        utils.log('secure.remove:',error)
    }
}



async function wipe(key,object) {
    try{
        await EncryptedStorage.clear()

    }catch(error){
        utils.log('secure.wipe:',error)
    }
}



export default {set,get,wipe,remove}