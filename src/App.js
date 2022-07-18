import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Profile from "./components/profile/Profile";
import Login from './components/Login';
import PrivateRoute from "./components/AuthRoute/PrivateRoute";
import Form from './components/profile/Form'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />

        <Route
          path="/product"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-product/:id"
          element={
            <PrivateRoute>
              <Form />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
