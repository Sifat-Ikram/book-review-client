import { Outlet } from "react-router-dom";
import Navbar from "./components/shared/Navbar";

const App = () => {
  return (
    <div>
      <Navbar />
      <div className="w-4/5 mx-auto">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default App;
