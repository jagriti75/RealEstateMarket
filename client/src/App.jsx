import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import { Navbar } from "./Navbar";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Profile } from "./pages/Profile";
import {CreateListing} from "./pages/CreateListing";
import {UpdateListing} from "./pages/UpdateListing";
import { About } from "./pages/About";
import { PrivateRoute } from "./PrivateRoute";
import { Listing } from "./pages/Listing";
import {Search} from "./pages/Search";

function App() {

  return (
    <BrowserRouter >
      <div className={styles.app}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/listing/:listingId" element={<Listing/>} />
          <Route path="/search" element={<Search/>}/>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path='/update/:listingId'
            element={<UpdateListing />}/>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
