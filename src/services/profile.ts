import api from "./index";

export default {
    getCurrentUser: async () => {
        const response = await api.get('/profile/basic-info');
        return response.data;
    }
};