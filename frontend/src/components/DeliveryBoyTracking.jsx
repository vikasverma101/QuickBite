import React from 'react'
import scooter from "../assets/scooter.png"
import home from "../assets/home.png"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'

const deliveryBoyIcon = new L.Icon({
    iconUrl: scooter,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
})
const customerIcon = new L.Icon({
    iconUrl: home,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
})

function DeliveryBoyTracking({ data }) {
    const deliveryBoyLat = data.deliveryBoyLocation?.lat
    const deliveryBoylon = data.deliveryBoyLocation?.lon
    const customerLat = data.customerLocation?.lat
    const customerlon = data.customerLocation?.lon

    const hasValidLocations = [deliveryBoyLat, deliveryBoylon, customerLat, customerlon].every(coord => typeof coord === 'number' && !Number.isNaN(coord))
    if (!hasValidLocations) {
        return (
            <div className='mt-3 h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100 p-6 text-center text-slate-700 shadow-md'>
                <p className='font-semibold'>Location data is unavailable right now.</p>
                <p className='mt-2 text-sm'>Please wait while the delivery boy shares the location or try again shortly.</p>
            </div>
        )
    }

    const path = [
        [deliveryBoyLat, deliveryBoylon],
        [customerLat, customerlon]
    ]

    const center = [deliveryBoyLat, deliveryBoylon]

    return (
        <div className='mt-3 h-[400px] w-full overflow-hidden rounded-2xl shadow-md'>
            <MapContainer
                className={'h-full w-full'}
                center={center}
                zoom={16}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[deliveryBoyLat, deliveryBoylon]} icon={deliveryBoyIcon}>
                    <Popup>Delivery Boy</Popup>
                </Marker>
                <Marker position={[customerLat, customerlon]} icon={customerIcon}>
                    <Popup>Customer</Popup>
                </Marker>
                <Polyline positions={path} color='#ff4d2d' weight={4} />
            </MapContainer>
        </div>
    )
}

export default DeliveryBoyTracking
