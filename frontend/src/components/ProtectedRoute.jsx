import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {  //here {children} is component as props
    const navigate=useNavigate();
    const {user}=useSelector(store=>store.auth);
    useEffect(()=>{
        if(!user){
            navigate('/login') 
        }
    },[])
  return <>{children}</>
}

export default ProtectedRoute
