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


const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/profile/:id', element: <Profile /> },
      { path: '/account/edit', element: <EditProfile /> },
      { path: '/chat',element: <ChatMenu />,children: [
          { path: ':id', element: <ChatConversation /> } // Fixed path
        ]
      },

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
