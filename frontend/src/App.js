import {Outlet} from "react-router";
import {Header} from "./Components/Header";
import {Footer} from "./Components/Footer";

export default function App() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-700 text-gray-900 overflow-x-hidden">
      {/* Header */}
      <Header />
      {/*  Page Container */}
      <Outlet />
        {/* Footer */}
        <Footer />
    </div>
  );
}
