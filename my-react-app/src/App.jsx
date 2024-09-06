import Register from "./Components/Register"
import Login from "./Components/Login"
import Chat from "./Components/Chat"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
 

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
          <Route element={<ProtectedRoute />}>
            <Route path="/chat" element={<Chat />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App