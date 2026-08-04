
import './App.css';
import Home from './screens/Home';
import Login from './screens/Login';
import Signup from './screens/Signup';
import MyOrder from "./screens/MyOrder";
import PrivateRoute from "./components/PrivateRoute";

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { CartProvider } from './components/ContextReducer';
function App() {
  return (
    <CartProvider>

    
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/createuser" element={<Signup />} />
          <Route path="/myOrder"element={<PrivateRoute> <MyOrder /></PrivateRoute>}/>
          
        </Routes>
      </div>
    </Router>
    </CartProvider>
  );
}

export default App;
