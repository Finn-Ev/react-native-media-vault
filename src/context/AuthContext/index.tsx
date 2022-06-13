import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { getAuthPinFromFromStorage, saveAuthPinToStorage } from "./storage";

export type AuthMethod = "biometric" | "pin";

export interface IAuthContext {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  selectedPinCode: string;
  setSelectedPinCode: (pinCode: string) => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: React.FC = ({ children }) => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active" && authenticated) {
        setAuthenticated(false);
        console.log("App goes to background", { authenticated });
      }
    });
    // console.log("AppState.addEventListener");
    return () => {
      subscription.remove();
    };
  }, []);

  const [authenticated, setAuthenticated] = useState(false);

  const [selectedPinCode, _setSelectedPinCode] = useState("");

  const setSelectedPinCode = async (pinCode: string) => {
    await saveAuthPinToStorage(pinCode);
    _setSelectedPinCode(pinCode);
  };

  useEffect(() => {
    (async () => {
      const pinCode = await getAuthPinFromFromStorage();
      if (pinCode) {
        _setSelectedPinCode(pinCode);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        selectedPinCode,
        setSelectedPinCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
