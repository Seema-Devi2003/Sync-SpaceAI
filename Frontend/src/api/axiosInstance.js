import axios from 'axios'
const axiosInstance = axios.create({
    baseURL : "/api/auth",
     withCredentials : true
})
 export async function registerUser({username, email, password}){
    const response = await axiosInstance.post('/register', {
        username, 
        email,
        password
    })
    console.log('Register API response:', response.data) 
    return response.data
 }

  export async function loginUser({username, email, password}){
    const response = await axiosInstance.post('/login', {
        
        email,
        password
    })
    console.log('Login API response :', response.data)
return response.data
  }

  export async function getMe(){
    const response = await axiosInstance.get('/get-me')
    console.log('GetMe API response:', response.data)
    return response.data
  }

  export async function logOut(){
    const response = await axiosInstance.post('/logout')
    console.log('Logout API response:' , response.data)
    return response.data
  }
