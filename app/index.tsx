import { useState } from "react";
import AuthScreen from "./(auth)/_layout";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (<AuthScreen /> );
}
