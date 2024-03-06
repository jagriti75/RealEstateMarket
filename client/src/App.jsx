import React from "react";
import {BrowserRouter , Routes , Route} from "react-router-dom";
import styles from "./App.module.css";
import { Navbar } from "./Navbar";
import {Home} from "./pages/Home";
import {SignIn} from "./pages/SignIn";
import  {SignUp}  from "./pages/SignUp";
import {Profile} from "./pages/Profile";
import {About}  from "./pages/About";
import { PrivateRoute } from "./PrivateRoute";

function App() {

  return (
    <BrowserRouter >
    <div className={styles.app}>
    <Navbar/>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route element={<PrivateRoute/>}>
      <Route path="/profile" element={<Profile/>}/>
      </Route>
      <Route path="/about" element={<About/>}/>
      </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
