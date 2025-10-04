import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./redux/store.jsx";
import { Provider } from "react-redux";
import UseProvider from "./pages/Context/userContext.jsx";

const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={CLIENTID}>
      <UseProvider>
        <App />
      </UseProvider>
    </GoogleOAuthProvider>
  </Provider>
);
