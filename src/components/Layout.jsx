import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import React from 'react'
import Footer from "./footer";

function Layout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Layout
