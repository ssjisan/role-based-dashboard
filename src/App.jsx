import { BrowserRouter } from "react-router";
import MainRoute from "./Router/MainRouter";
import { Toaster } from "react-hot-toast";
import DataStore from "./DataStore/DataStore";
import Theme from "./Theme/index";

function App() {
  return (
    <BrowserRouter>
      <DataStore>
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: "#59B259",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#59B259",
              },
            },
            error: {
              style: {
                background: "#EC4034",
                color: "#fff",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#EC4034",
              },
            },
          }}
        />
        <Theme>
          <MainRoute />
        </Theme>
      </DataStore>
    </BrowserRouter>
  );
}

export default App;
