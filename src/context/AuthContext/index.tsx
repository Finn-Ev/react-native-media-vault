import { createContext, useContext, useEffect, useState } from "react";

import {
  getSelectedAuthMethodFromStorage,
  saveSelectedAuthMethodToStorage,
} from "./storage";
import { AppState } from "react-native";

export type AuthMethod = "biometric" | "pin";

export interface IAuthContext {
  selectedAuthMethod: AuthMethod | null;
  setSelectedAuthMethod: (authMethod: AuthMethod) => void;
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: React.FC = ({ children }) => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "active" && authenticated) {
        _setAuthenticated(false);
        console.log("App goes to background", { authenticated });
      }
    });
    console.log("AppState.addEventListener");
    return () => {
      subscription.remove();
    };
  }, []);

  const [selectedAuthMethod, _setSelectedAuthMethod] =
    useState<AuthMethod | null>(null);

  const [authenticated, _setAuthenticated] = useState(false);

  const setSelectedAuthMethod = async (authMethod: AuthMethod) => {
    await saveSelectedAuthMethodToStorage(authMethod);
    _setSelectedAuthMethod(authMethod);
  };

  const setAuthenticated = async (authenticated: boolean) => {
    console.log("setAuthenticated", authenticated);
    _setAuthenticated(authenticated);
  };

  useEffect(() => {
    getSelectedAuthMethodFromStorage().then((authMethod) => {
      if (authMethod) {
        setSelectedAuthMethod(authMethod);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        selectedAuthMethod,
        setSelectedAuthMethod,
        authenticated,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
