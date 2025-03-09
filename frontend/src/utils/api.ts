import { CreateUserInput, LoginInput } from "@ifti_taha/streaker-common";
import axios from "axios";

const AUTH_BASE_URL = import.meta.env.VITE_LOCAL_AUTH_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_LOCAL_API_ACTIVITY_BASE_URL;
const USER_API_BASE_URL = import.meta.env.VITE_LOCAL_API_USER_BASE_URL;

const auth_api = axios.create({
    baseURL: AUTH_BASE_URL,
    headers: {
        "Content-type": "application/json"
    }
});

const activity_api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-type": "application/json"
    }
});

const user_api = axios.create({
    baseURL: USER_API_BASE_URL,
    headers: {
        "Content-type": "application/json"
    }
})

const registerUser = async (userData: CreateUserInput) => {
    try {
        const response = await auth_api.post("/register", userData);
        return response.data;
    } catch (error: any) {
        // First check for message in error.response.data.message
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        // Then check for error in error.response.data.error
        else if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }
        // Check for direct message string in response data
        else if (typeof error.response?.data === 'string') {
            throw new Error(error.response.data);
        }
        // Check for direct message in network response
        else if (error.response?.statusText) {
            throw new Error(error.response.statusText);
        }
        // If we still can't find the message, log the entire error and use fallback
        else {
            console.error("Registration error:", error);
            throw new Error("Unable to register user. Please try again later.");
        }
    }
};

const loginUser = async (userData: LoginInput) => {
    try {
        const response = await auth_api.post("/login", userData);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        // Then check for error in error.response.data.error
        else if (error.response?.data?.error) {
            throw new Error(error.response.data.error);
        }
        // Check for direct message string in response data
        else if (typeof error.response?.data === 'string') {
            throw new Error(error.response.data);
        }
        // Check for direct message in network response
        else if (error.response?.statusText) {
            throw new Error(error.response.statusText);
        }
        // If we still can't find the message, log the entire error and use fallback
        else {
            console.error("Login error:", error);
            throw new Error("Unable to Login user. Please try again later.");
        }
    }
};

const fetchStreaks = async (token: string) => {
    const response = await activity_api.get('/streak', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // console.log(`Streaks: ${response.data.streak}`);
    return response.data.streak;
};

const fetchLongestStreak = async (token: string) => {
    const response = await activity_api.get('/longest-streak', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    // console.log(`Longest streak: ${response.data.streak}`);
    return response.data.streak;
}

const fetchActivities = async (token: string) => {
    const response = await activity_api.get('/activities', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.activities;
};

const fetchAllActivities = async (token : string, page : number, limit : number) => {
    try {
        const response = await activity_api.get('/all', {
            headers : {
                Authorization : `Bearer ${token}`
            }, 
            params : {
                page : page,
                limit : limit
            }
        });
        // console.log(response.data)
        return response.data;
    } catch (error : any) {
        console.error(`Error in fetching all activities: ${error}`);
        throw new Error(error.response?.data?.message || "Error in fetching all activities");
    }
}

const addActivity = async (token: string, description: string) => {
    // console.log(`Adding activity: ${description}`);
    const response = await activity_api.post('/activities', {
        date: new Date().toISOString(),
        description: description,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    // console.log(`Activity added:`, response.data);
    return response;
}


// dummy 

// Fetch user profile
 const fetchUserProfile = async (token: string) => {
    try {
        const response = await user_api.get('/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept' : 'application/json'
            },
        });
        // console.log('User profile:', response.data);
        return response.data;
    } catch (error : any) {
        console.error('Error fetching user profile:', error.response || error);
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
};

// Update user profile
 const updateUserProfile = async (token: string, profileData: any): Promise<any> => {
    try {
        const response = await user_api.post('/update', profileData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept' : 'application/json'
            }
        });
        return response.data;
    } catch (error : any) {
        console.error('Error updating user profile:', error.response || error);
        throw new Error(error.response?.data?.message || 'Failed to update user profile');
    }
};

// Change user password
const changePassword = async (token: string, oldPassword: string, newPassword: string) => {
    try {
        const response = await user_api.post('/change-password', {
            oldPassword,
            newPassword
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept' : 'application/json'
            }
        });
        return response.data;
    } catch (error : any) {
        console.error('Error changing password:', error.response || error);
        throw new Error(error.response?.data?.message || 'Failed to change password');
    }
}

export { 
    registerUser, 
    loginUser, 
    fetchStreaks, 
    fetchLongestStreak, 
    fetchActivities, 
    fetchAllActivities, 
    addActivity, 
    fetchUserProfile, 
    updateUserProfile, 
    changePassword
};