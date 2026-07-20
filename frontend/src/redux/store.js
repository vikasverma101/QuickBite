import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import ownerSlice from "./ownerSlice"
import mapSlice from "./mapSlice"
export const store=configureStore({
    reducer:{
        user:userSlice,
        owner:ownerSlice,
        map:mapSlice
    }
})

// Persist cart to localStorage to improve user experience across reloads
store.subscribe(() => {
    try {
        const state = store.getState()
        const payload = {
            cartItems: state.user.cartItems,
            totalAmount: state.user.totalAmount
        }
        localStorage.setItem('quickbite_cart', JSON.stringify(payload))
    } catch (e) {
        // ignore
    }
})