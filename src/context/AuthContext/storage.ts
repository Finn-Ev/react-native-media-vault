import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthMethod } from "./index";

export const saveSelectedAuthMethodToStorage = async (value: AuthMethod) => {
  try {
    await AsyncStorage.setItem("selectedAuthMethod", value);
  } catch (e) {
    console.warn(e.message);
  }
};

export const getSelectedAuthMethodFromStorage = async () => {
  try {
    const value = await AsyncStorage.getItem("selectedAuthMethod");
    if (value) {
      return value as AuthMethod;
    } else return null;
  } catch (e) {
    console.warn(e.message);
    return null;
  }
};
