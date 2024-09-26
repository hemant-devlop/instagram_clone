import Signup from './components/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { useEffect } from 'react'
import ChatConversation from './components/ChatConversation'
import ChatMenu from './components/ChatMenu'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoute from './components/ProtectedRoute'
import PageNotFound from './components/PageNotFound'
import StoryFeed from './components/StoryFeed'


const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute> ,
    children: [
      { path: '/', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: '/profile/:id', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: '/account/edit', element: <ProtectedRoute><EditProfile /></ProtectedRoute> },
      { path: '/chat',element: <ProtectedRoute><ChatMenu /></ProtectedRoute>,children: [
          { path: ':id', element: <ProtectedRoute><ChatConversation /></ProtectedRoute> }
        ]
      },
      {path:'*',element:<PageNotFound/>}

    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> }
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    let socketio;
    if (user) {
      socketio = io('http://localhost:8000', {
        query: {
          userId: user._id
        },
        transports: ['websocket', 'polling']
      });

      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      });
      
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      socketio.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
      });

      return () => {
        socketio?.close();
        dispatch(setSocket(null))
  
      }
    } else {
      socketio?.close();
      dispatch(setSocket(null))
      
    }
  }, [user, dispatch])
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
