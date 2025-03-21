import { create } from 'zustand'
import axiosInstance from '../lib/axios.js'
import { toast } from 'react-toastify'
import {io} from 'socket.io-client'

const BASE_URL = 'http://localhost:5001'

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSignInUp: false,
  isLoginIn: false,
  isUpdateingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,


  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data })
      get().connectSocket()
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSignInUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      // ✅ Show success message
      toast.success("Account created successfully");
      // ✅ Return a Promise so that `.then()` will work
      get().connectSocket()
      return Promise.resolve();
    } catch (error) {
      toast.error((error.response?.data?.message || "Something went wrong"));
      return Promise.reject(error);
    } finally {
      set({ isSignInUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket()
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
      try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket()
      set({ authUser: null });
      // ✅ Show success message
      toast.success("Logged out successfully");
      // ✅ Return a Promise so that `.then()` will work
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error((error.response?.data?.message || "Something went wrong"));
    } 
  },
  
  updateProfile : async(data)=>{
      set({isUpdateingProfile:true})
      try {
        const res = await axiosInstance.put('/auth/update-profile',data)
        set({authUser:res.data})
        toast.success("Profile updated successfully")
      } catch (error) {
        console.log("Error in update profilePic");
        toast.error(error.response.data.message)
      }finally{
        set({isUpdateingProfile:false})
      }
  },

  connectSocket : () =>{
    const {authUser} = get()
    if(!authUser || get().socket?.connected
    ) return

      const socket = io(BASE_URL,{
        query:{
          userId:authUser._id
        }
      })

      socket.connect()
      set({socket:socket})

      socket.on("getOnlineUsers" ,(userIds) =>{
        set({onlineUsers:userIds})
      })
  },
  
  disconnectSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null })
      console.log("Socket disconnected")
    }
  },

}))

