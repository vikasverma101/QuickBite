import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
    const dispatch = useDispatch()
    const apiKey = import.meta.env.VITE_GEOAPIKEY

    useEffect(() => {
        if (!navigator?.geolocation || !apiKey) return

        const handlePosition = async (position) => {
            try {
                const latitude = position.coords.latitude
                const longitude = position.coords.longitude
                dispatch(setLocation({ lat: latitude, lon: longitude }))
                const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
                const place = result?.data?.results?.[0] || {}
                dispatch(setCurrentCity(place.city || place.county || place.state || ''))
                dispatch(setCurrentState(place.state || ''))
                dispatch(setCurrentAddress(place.address_line2 || place.address_line1 || ''))
                dispatch(setAddress(place.address_line2 || place.address_line1 || ''))
            } catch (error) {
                console.warn('Failed to resolve current city', error)
            }
        }

        navigator.geolocation.getCurrentPosition(handlePosition, (error) => {
            console.warn('Geolocation failed', error)
        }, { enableHighAccuracy: true })
    }, [apiKey, dispatch])
}

export default useGetCity
