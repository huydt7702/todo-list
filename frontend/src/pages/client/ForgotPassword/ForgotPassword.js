import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    console.log(email);
    const handleSunmit = async () => {
        try {
            await axios.post(
                'v1/auth/forgot-password',
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            toast.success('Please check your email');
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };
    return (
        <div className="h-screen flex flex-col justify-center align-items ">
            <div className="flex flex-col items-center justify-center p-8  ">
                <div className="w-full flex flex-col items-center">
                    <div className="flex flex-col items-center gap-4 mt-10 w-2/5 p-10 pl-12 pr-12 border-1 rounded-lg shadow-[8px_8px_50px_rgba(3,0,71,0.09)] ">
                        <h1 className="mt-6 mb-2 text-3xl font-semibold">Forgot Password</h1>
                        <p className="text-[#555] text-2xl">Please enter your email.</p>
                        <input
                            className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                            type="text"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                        <button
                            onClick={handleSunmit}
                            className="w-full text-2xl p-4 bg-[#2564CF] text-white font-medium border-[1px] border-solid border-[#999] rounded-md hover:opacity-80"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
