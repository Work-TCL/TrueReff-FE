import axiosInstance from "./http-common";

export const getProfileAPI = async () => {
    try {
        const response = await axiosInstance.get('/user/me')
        return response
    } catch (error) {
        throw error || new Error('profile get failed');
    }
}