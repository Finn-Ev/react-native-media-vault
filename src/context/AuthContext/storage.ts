import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthMethod } from "./index";

export const saveAuthPinToStorage = async (value: string) => {
  try {
    await AsyncStorage.setItem("authPinCode", value);
  } catch (e) {
    console.warn(e.message);
  }
};

export const getAuthPinFromFromStorage = async () => {
  try {
    const value = await AsyncStorage.getItem("authPinCode");
    if (value) {
      return value;
    } else return null;
  } catch (e) {
    console.warn(e.message);
    return null;
  }
};
