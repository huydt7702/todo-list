import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
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
        <div>
            {/* Form reset password */}
            <div className="flex flex-col items-center justify-center p-12 max-sm:w-full">
                <h1 className="mt-6 mb-2 text-3xl font-semibold">Reset Password</h1>
                <p className="text-[#555] text-2xl">Please enter your new password.</p>

                <div className="flex flex-col items-center w-full gap-4 mt-10">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                    />
                    <input
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                        type="password"
                        name="confirmPassword"
                        placeholder="Enter your confirm password"
                    />
                    <button
                        onClick={handleSubmit}
                        className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
