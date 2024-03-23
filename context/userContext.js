import React, { createContext, useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/APIConstants';

const UserContext = createContext();

const UserProvider = ({ children }) => {

    const [user, setUser] = useState({});
    const [userDashboardInfo, setUserDashboardInfo] = useState({});
    const [formFields, setFormFields] = useState({ rohan: "rohan" });

    const saveUserData = (data) => {
        setUser(data);
    }

    const removeUserDashboardInfo = () => {
        setUserDashboardInfo({});
    }
    const saveUserDashboardinfo = (data) => {
        setUserDashboardInfo(data);
    }

    const removeUserData = () => {
        setUser({});
    }

    const getFormFields = () => {
        let url = `${BASE_URL}/get-headers`
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                setFormFields(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const fetchUserDashboard = () => {
        let url = `${BASE_URL}/landing`;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: url,
            headers: {
                'token': user.token
            }
        };

        axios.request(config)
            .then((response) => {
                if (response.data.status.statusCode === 1) {
                    console.log("dashboard info fetched from context fn.");
                    saveUserDashboardinfo(response.data.data);
                }
                else {
                    console.log(JSON.stringify(response.data));
                }
            })
            .catch((error) => {
                console.log("Error fetching user dashboard form context fn. ", error);
            });
    }

    useEffect(() => {
        getFormFields();
    }, [])

    return (
        <UserContext.Provider value={{ user, saveUserData, removeUserData, formFields, userDashboardInfo, saveUserDashboardinfo, removeUserDashboardInfo, fetchUserDashboard }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider };
