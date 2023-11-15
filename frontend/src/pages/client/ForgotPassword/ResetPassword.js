import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './style.css'
const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = () => {
        if (password !== confirmPassword) {
            toast.error('Password and confirm password do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validatePassword()) return;
        try {
            await axios.post('/v1/auth/reset-password', { token, password });
            toast.success('Reset password successfully');
            navigate('/login');
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center p-8 max-w-4xl mt-40 rounded-xl lg:shadow-lg mx-auto  bg-white">
        <h1 className="mt-6 mb-4 text-4xl font-semibold">Reset your password</h1>
        <p className="text-gray-600 text-lg mb-6">Please enter your new password.</p>
    
        <form className="w-full mt-4 p-10">
            <div className="flex flex-col w-full gap-4">
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 mb-2 br text-xl rounded-md"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                />
                <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 br text-xl rounded-md"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                />
                <button
                    onClick={handleSubmit}
                    className="w-full mt-6 px-4 py-3 bg-custom-pink text-white rounded-md transition duration-300 font-semibold"
                >
                    Reset
                </button>
            </div>
        </form>
    </div>
    
    );
};

export default ResetPassword;
