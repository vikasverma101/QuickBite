import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../config.js'
import { useSelector } from 'react-redux'

function useUpdateLocation() {
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        if (!navigator?.geolocation || !userData) return

        const updateLocation = async (lat, lon) => {
            try {
                await axios.post(`${serverUrl}/api/user/update-location`, { lat, lon }, { withCredentials: true })
            } catch (error) {
                console.warn('Location update failed', error)
            }
        }

        const watchId = navigator.geolocation.watchPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude)
        }, (error) => {
            console.warn('Location watch failed', error)
        }, { enableHighAccuracy: true })

        return () => {
            if (watchId != null) {
                navigator.geolocation.clearWatch(watchId)
            }
        }
    }, [userData])
}

export default useUpdateLocation
