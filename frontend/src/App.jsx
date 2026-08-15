import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Listings from './pages/Listings'
import Login from './pages/Login'
import Register from './pages/Register'
import OwnerDashboard from './pages/OwnerDashboard'
import TenantDashboard from './pages/TenantDashboard'
import Chat from './pages/Chat'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CreateListing from './pages/CreateListing'
import CreateTenantProfile from './pages/CreateTenantProfile'
import ListingDetails from './pages/ListingDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="listings/:id" element={<ListingDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
              path="owner"
              element={
                  <ProtectedRoute role="owner">
                      <OwnerDashboard />
                  </ProtectedRoute>
              }
          />
          <Route
              path="tenant"
              element={
                  <ProtectedRoute role="tenant">
                      <TenantDashboard />
                  </ProtectedRoute>
              }
          />
          <Route
              path="chat"
              element={
                  <ProtectedRoute>
                      <Chat />
                  </ProtectedRoute>
              }
          />
          <Route
              path="admin"
              element={
                  <ProtectedRoute role="admin">
                      <AdminDashboard />
                  </ProtectedRoute>
              }
          />
          <Route
                path="create-listing"
                element={
                    <ProtectedRoute role="owner">
                        <CreateListing />
                    </ProtectedRoute>
                }
            />
          <Route
                path="edit-listing/:id"
                element={
                    <ProtectedRoute role="owner">
                        <CreateListing />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tenant-profile"
                element={
                    <ProtectedRoute role="tenant">
                        <CreateTenantProfile />
                    </ProtectedRoute>
                }
            />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
