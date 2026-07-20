import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../config.js'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity } from '../redux/userSlice'

function useGetShopByCity() {
    const dispatch = useDispatch()
    const { currentCity, socket } = useSelector(state => state.user)

    useEffect(() => {
        if (!currentCity) return
        const fetchShops = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${encodeURIComponent(currentCity)}`, { withCredentials: true })
                dispatch(setShopsInMyCity(result.data))
            } catch (error) {
                console.log(error)
            }
        }

        fetchShops()

        if (!socket) return
        const handleCityUpdate = (payload) => {
            if (!payload?.city) return
            if (payload.city.toLowerCase() === currentCity.toLowerCase()) {
                fetchShops()
            }
        }

        socket.on('city-data-updated', handleCityUpdate)
        return () => {
            socket.off('city-data-updated', handleCityUpdate)
        }
    }, [currentCity, dispatch, socket])
}

export default useGetShopByCity
