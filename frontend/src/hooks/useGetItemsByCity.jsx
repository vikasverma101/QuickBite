import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../config.js'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice'

function useGetItemsByCity() {
    const dispatch = useDispatch()
    const { currentCity, socket } = useSelector(state => state.user)

    useEffect(() => {
        if (!currentCity) return
        const fetchItems = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-by-city/${encodeURIComponent(currentCity)}`, { withCredentials: true })
                dispatch(setItemsInMyCity(result.data))
            } catch (error) {
                console.log(error)
            }
        }

        fetchItems()

        if (!socket) return
        const handleCityUpdate = (payload) => {
            if (!payload?.city) return
            if (payload.city.toLowerCase() === currentCity.toLowerCase()) {
                fetchItems()
            }
        }

        socket.on('city-data-updated', handleCityUpdate)
        return () => {
            socket.off('city-data-updated', handleCityUpdate)
        }
    }, [currentCity, dispatch, socket])
}

export default useGetItemsByCity
