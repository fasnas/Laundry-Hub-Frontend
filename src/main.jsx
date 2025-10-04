import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./redux/store.jsx";
import { Provider } from "react-redux";
import UseProvider from "./pages/Context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="787574440519-uumcml3upu05qqnkcd5pn6lbq114g8e6.apps.googleusercontent.com">
      <UseProvider>
        <App />
      </UseProvider>
    </GoogleOAuthProvider>
  </Provider>
);
