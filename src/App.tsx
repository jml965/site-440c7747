import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import HomePage from './pages/Home';
import CategoriesPage from './pages/Categories';
import ListingsPage from './pages/Listings';
import ListingDetailsPage from './pages/ListingDetails';
import CreateListingPage from './pages/CreateListing';
import FavoritesPage from './pages/Favorites';
import MessagesPage from './pages/Messages';
import NotificationsPage from './pages/Notifications';
import ProfilePage from './pages/Profile';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AdminDashboardPage from './pages/admin/Dashboard';
import AdminUsersPage from './pages/admin/Users';
import AdminListingsPage from './pages/admin/AdminListings';
import AdminReportsPage from './pages/admin/Reports';
import AdminCategoriesPage from './pages/admin/AdminCategories';

import Footer from './components/Footer';

import { Toaster } from 'react-hot-toast';
import './index.css';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-gray-50" dir="rtl">
          <Navbar />
          <main className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/listings/:id" element={<ListingDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected User Routes */}
              <Route path="/create-listing" element={
                <ProtectedRoute>
                  <CreateListingPage />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              } />
              <Route path="/admin/listings" element={
                <AdminRoute>
                  <AdminListingsPage />
                </AdminRoute>
              } />
              <Route path="/admin/reports" element={
                <AdminRoute>
                  <AdminReportsPage />
                </AdminRoute>
              } />
              <Route path="/admin/categories" element={
                <AdminRoute>
                  <AdminCategoriesPage />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-center"
            toastOptions={{
              className: 'text-sm font-medium',
              duration: 4000,
              style: {
                direction: 'rtl'
              }
            }}
          />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}