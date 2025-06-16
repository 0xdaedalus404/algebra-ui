import "./styles/_colors.css";
import "./App.css";
import Layout from "./components/common/Layout";

function App({ children }: { children: React.ReactNode }) {
    return <Layout>{children}</Layout>;
}

export default App;
