import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import GlobalStyles from "./styles/GlobalStyles.js";
import {lazy, Suspense} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {Toaster} from "react-hot-toast";

import {DarkModeProvider} from "./context/DarkModeContext.jsx";
import SpinnerFullPage from "./ui/SpinnerFullPage.jsx";
import ProtectedRoute from "./ui/ProtectedRoute.jsx";
import AppLayout from "./ui/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRouteByEmail from "./ui/ProtectedRouteByEmail.jsx";


const Bookings = lazy(()=> import("./pages/Bookings.jsx"));
const Booking = lazy(()=> import("./pages/Booking.jsx"));
const Cabins = lazy(()=> import("./pages/Cabins.jsx"));
const Cabin = lazy(()=> import("./pages/Cabin.jsx"));
const Users = lazy(()=> import('./pages/Users.jsx'));
const Settings = lazy(()=> import("./pages/Settings.jsx"));
const Checkin = lazy(()=> import("./pages/Checkin.jsx"));
const Checkout = lazy(()=> import("./pages/Checkout.jsx"));
const Guests = lazy(()=> import("./pages/Guests.jsx"));
const Guest = lazy(()=> import("./pages/Guest.jsx"));
const Account = lazy(()=> import("./pages/Account.jsx"));
const Login = lazy(()=> import("./pages/Login.jsx"));
const PageNotFound = lazy(()=> import("./pages/PageNotFound.jsx"));


const queryClient = new QueryClient({
   defaultOptions: {
       queries: {
           staleTime: 60 * 1000, //1 minute
       }
   }
});


function App() {
  return (
      <DarkModeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false}/>
          <GlobalStyles/>
          <BrowserRouter>
              <Suspense fallback={<SpinnerFullPage/>}>
                  <Routes>
                      <Route element={<ProtectedRoute>
                          <AppLayout/>
                      </ProtectedRoute>}>
                          <Route index element={<Navigate replace to='dashboard'/>}/>
                          <Route path='dashboard' element={<Dashboard/>}/>
                          <Route path='bookings' element={<Bookings/>}/>
                          <Route path='bookings/:bookingId' element={<Booking/>}/>
                          <Route path='checkin/:bookingId' element={<Checkin/>}/>
                          <Route path='checkout/:bookingId' element={<Checkout/>}/>
                          <Route path='cabins' element={<Cabins/>}/>
                          <Route path='cabins/:cabinId' element={<Cabin/>}/>
                          <Route path='users' element={<ProtectedRouteByEmail>
                                    <Users/>
                              </ProtectedRouteByEmail>}/>
                          <Route path='guests' element={<Guests/>}/>
                          <Route path='guests/:guestId' element={<Guest/>}/>
                          <Route path='settings' element={<Settings/>}/>
                          <Route path='account' element={<Account/>}/>
                      </Route>
                      <Route path='login' element={<Login/>}/>
                      <Route path='*' element={<PageNotFound/>}/>
                  </Routes>
              </Suspense>
          </BrowserRouter>

          <Toaster position='top-center' gutter={12}
          containerStyle={{margin: '8px'}}
          toastOptions={{
              success: {
                  duration: 3000,
              },
              error: {
                  duration: 4000,
              },
              style: {
                  fontSize: '16px',
                  maxWidth: '500px',
                  padding: '16px 24px',
                  backgroundColor: 'var(--color-grey-0)',
                  color: 'var(--color-grey-700)',
              }
          }}/>
      </QueryClientProvider>
      </DarkModeProvider>
  )
}

export default App
