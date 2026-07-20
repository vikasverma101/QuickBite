import { createSlice, current } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isAuthLoading: true,
    currentCity: null,
    currentState: null,
    currentAddress: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cartItems: (() => { try { return JSON.parse(localStorage.getItem('quickbite_cart'))?.cartItems || [] } catch(e){ return [] } })(),
    totalAmount: (() => { try { return JSON.parse(localStorage.getItem('quickbite_cart'))?.totalAmount || 0 } catch(e){ return 0 } })(),
    myOrders: [],
    searchItems: null,
    searchQuery: '',
    searchFilters: {
      veg: false,
      nonVeg: false,
      minRating: 0,
      priceRange: [0, 1000],
      delivery: 'any',
      cuisine: '',
      offers: false,
      sort: 'relevance',
    },
    socket: null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
      state.isAuthLoading = false
    },
    setAuthLoading: (state, action) => {
      state.isAuthLoading = action.payload
    },
    setCurrentCity: (state, action) => {
      state.currentCity = action.payload
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload
    },
    setShopsInMyCity: (state, action) => {
      state.shopInMyCity = action.payload
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload
    },
    setSocket: (state, action) => {
      state.socket = action.payload
    },
    addToCart: (state, action) => {
      const cartItem = action.payload
      const existingItem = state.cartItems.find(i => i.id == cartItem.id)
      if (existingItem) {
        existingItem.quantity += cartItem.quantity
      } else {
        state.cartItems.push(cartItem)
      }

      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    },

    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload
    }

    ,

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cartItems.find(i => i.id == id)
      if (item) {
        item.quantity = quantity
      }
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    },

    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(i => i.id !== action.payload)
      state.totalAmount = state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    },

    setMyOrders: (state, action) => {
      state.myOrders = action.payload
    },
    addMyOrder: (state, action) => {
      state.myOrders = [action.payload, ...state.myOrders]
    }

    ,
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload
      const order = state.myOrders.find(o => o._id == orderId)
      if (order) {
        if (Array.isArray(order.shopOrders)) {
          const shopOrder = order.shopOrders.find(so => String(so.shop?._id || so.shop) === String(shopId))
          if (shopOrder) {
            shopOrder.status = status
          }
        } else if (order.shopOrders && String(order.shopOrders.shop?._id || order.shopOrders.shop) === String(shopId)) {
          order.shopOrders.status = status
        }
      }
    },

    updateRealtimeOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload
      const order = state.myOrders.find(o => o._id == orderId)
      if (order) {
        if (Array.isArray(order.shopOrders)) {
          const shopOrder = order.shopOrders.find(so => String(so.shop?._id || so.shop) === String(shopId))
          if (shopOrder) {
            shopOrder.status = status
          }
        } else if (order.shopOrders && String(order.shopOrders.shop?._id || order.shopOrders.shop) === String(shopId)) {
          order.shopOrders.status = status
        }
      }
    },

    setSearchItems: (state, action) => {
      state.searchItems = action.payload
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },

    setSearchFilters: (state, action) => {
      state.searchFilters = { ...state.searchFilters, ...action.payload }
    }
  }
})

export const { setUserData, setAuthLoading, setCurrentAddress, setCurrentCity, setCurrentState, setShopsInMyCity, setItemsInMyCity, addToCart, updateQuantity, removeCartItem, setMyOrders, addMyOrder, updateOrderStatus, setSearchItems, setSearchQuery, setSearchFilters, setTotalAmount, setSocket, updateRealtimeOrderStatus } = userSlice.actions
export default userSlice.reducer