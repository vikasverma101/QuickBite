import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../config.js'
import { useDispatch } from 'react-redux'
import { setUserData, setAuthLoading } from '../redux/userSlice'

function useGetCurrentUser() {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchUser = async () => {
            dispatch(setAuthLoading(true))
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
                dispatch(setUserData(result.data))
            } catch (error) {
                dispatch(setUserData(null))
                console.error('Failed to fetch current user', error)
            }
        }
        fetchUser()
    }, [dispatch])
}

export default useGetCurrentUser
