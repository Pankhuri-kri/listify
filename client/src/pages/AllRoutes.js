import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedPage from '../components/ProtectedPage'
import Home from './Home/Home'
import Profile from './Profile/Profile'
import SingleProduct from './ProductInfo/SingleProduct'
import Admin from './Admin/Admin'
import Login from './Login/Login'
import Register from './Register/Register'
import Chats from './Chat/Chats'
import ChatWindow from './Chat/ChatWindow'
import SetupAdmin from './SetupAdmin/SetupAdmin'

const AllRoutes = () => {
  return (
    <div> 
         <Routes>
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Home />
              </ProtectedPage>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedPage>
                <Profile />
              </ProtectedPage>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedPage>
                <SingleProduct />
              </ProtectedPage>
            }
          />
           <Route
            path="/admin"
            element={
              <ProtectedPage>
                <Admin />
              </ProtectedPage>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedPage>
                <Chats />
              </ProtectedPage>
            }
          />
          <Route
            path="/chat/:chatId"
            element={
              <ProtectedPage>
                <ChatWindow />
              </ProtectedPage>
            }
          />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route
            path="/setup-admin"
            element={
              <ProtectedPage>
                <SetupAdmin />
              </ProtectedPage>
            }
          />
          <Route />
        </Routes>
    </div>
  )
}

export default AllRoutes