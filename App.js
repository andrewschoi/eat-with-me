import * as React from "react";
import { UserProvider } from "./contexts/userContext";
import Main from "./views/main";
export default function App() {
  return (
    <UserProvider>
      <Main />
    </UserProvider>
  );
}
