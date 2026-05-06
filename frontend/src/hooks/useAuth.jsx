// api
import api from '../utils/api'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useAuth() {

    async function register(user) {
        try {
            const data = await api.post('/auth/register', user).then((res) => {
                return res.data
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    async function login(email, password) {

    }

}
