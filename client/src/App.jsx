import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Room from "./pages/Room"
import { SocketProvider } from "./providers/Socket"

function App() {
  return (
    <div>
      <SocketProvider>
      <Routes>
        
          <Route path="/" element={ <Home /> } />  
          <Route path="/room/:roomId" element={<Room />} /> 
        
      </Routes>
      </SocketProvider>
    </div>
  )

  
}

export default App
