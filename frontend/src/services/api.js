import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function login(credentials) {
  return api.post('/auth/login', credentials)
}

export function register(credentials) {
  return api.post('/auth/register', credentials)
}

export function fetchListings(params) {
  return api.get('/listings', { params })
}

export function fetchDashboardStats(role) {
  return api.get(`/dashboard/${role}`)
}

export function sendMessage(payload) {
  return api.post('/chat/send', payload)
}

export function fetchChatMessages(listingId) {
  return api.get(`/chat/${listingId}`)
}

export function fetchMyListings() {
    return api.get("/listings/my");
}

export function fetchOwnerInterests() {
    return api.get("/interest/owner");
}

export function updateInterest(id, status) {
    return api.patch(`/interest/${id}`, {
        status
    });
}

export function markListingFilled(id) {
    return api.patch(`/listings/${id}/fill`);
}

export function fetchTenantProfile() {
  return api.get("/tenant/profile");
}

export function fetchCompatibility(listingId) {
  return api.get(`/compatibility/${listingId}`);
}

export function sendInterest(listingId) {
  return api.post(`/interest/${listingId}`);
}

export function fetchMyInterests() {
  return api.get("/interest/my");
}

export function openChat(userId) {
    return `/chat?user=${userId}`;
}

export function createListing(data) {
    return api.post("/listings", data);
}

export function updateListing(id, data) {
    return api.put(`/listings/${id}`, data);
}

export function deleteListing(id) {
    return api.delete(`/listings/${id}`);
}

export function createTenantProfile(data) {
    return api.post("/tenant/profile", data);
}

export function updateTenantProfile(data) {
    return api.put("/tenant/profile", data);
}

export function adminFetchUsers() {
    return api.get("/admin/users");
}

export function adminDeleteUser(id) {
    return api.delete(`/admin/users/${id}`);
}

export function adminFetchListings() {
    return api.get("/admin/listings");
}

export function adminDeleteListing(id) {
    return api.delete(`/admin/listings/${id}`);
}

export function adminFetchInterests() {
    return api.get("/admin/interests");
}

api.interceptors.request.use((config)=>{

const token = localStorage.getItem("token");

if(token){

config.headers.Authorization=
`Bearer ${token}`;

}

return config;

});