import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
const Profile = () => {
    const { id } = useParams();
    const token = useSelector((state) => state.auth.login.currentUser.accessToken);
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        avatar: '',
    });

    useEffect(() => {
        const getUserById = async () => {
            const res = await axios.get(`/v1/user/${id}`, {
                headers: { token: `Bearer ${token}` },
            });
            setUserInfo(res.data.data);
        };
        getUserById();
    }, [id, token]);

    const handleSlectFile = (e) => {
        setUserInfo({ ...userInfo, avatar: e.target.files[0] || userInfo.avatar });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/v1/user/${id}`, userInfo, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: `Bearer ${token}`,
                },
            });
            toast.success('Update profile successfully!');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center p-12 max-sm:w-full">
                <h1 className="mt-6 mb-2 text-3xl font-semibold">Profile</h1>
                <p className="text-[#555] text-2xl">Please enter your details.</p>
                <form className="flex flex-col items-center w-full gap-4 mt-10" encType="multipart/form-data">
                    <input
                        className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={userInfo.username}
                        onChange={(e) => {
                            setUserInfo({ ...userInfo, username: e.target.value });
                        }}
                    />
                    <input
                        className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                        type="text"
                        name="email"
                        placeholder="Enter your email"
                        value={userInfo.email}
                        onChange={(e) => {
                            setUserInfo({ ...userInfo, email: e.target.value });
                        }}
                    />
                    <input
                        onChange={handleSlectFile}
                        className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                        type="file"
                        name="avatar"
                        placeholder="Enter your avatar"
                    />
                    <img
                        src={
                            userInfo.avatar
                                ? userInfo.avatar
                                : 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'
                        }
                        className="w-[100px] h-[100px] object-cover rounded-full border-[1px] border-solid border-[#999]"
                        alt=""
                    />
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
