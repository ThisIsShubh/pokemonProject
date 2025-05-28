import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { FilterProvider } from './Context/FilterContext.jsx';
import './index.css'
import Layout from './components/Layout.jsx';
import Home from './pages/Home/Home.jsx';
import PokeDetails from './pages/PokeDetails/PokeDetails.jsx';
import Regionview from './pages/Regionview/Regionview.jsx';
import Groupview from './pages/Groupview/Groupview.jsx';
import Typeview from './pages/Typeview/Typeview.jsx';
import All from './pages/All/all.jsx';

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path="/region/:regionName" element={<Regionview />} />
      <Route path='/all' element={<All/>} />
      <Route path='/group/:groupName' element={<Groupview/>}/>
      <Route path='/type/:typeName' element={<Typeview/>}/>
      <Route path='/pokemon/:name' element={<PokeDetails/>} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <FilterProvider>
      <RouterProvider router={router}/>
    </FilterProvider>
      
  // </StrictMode>,
)
