import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';

const Profile = () => {
    const { id } = useParams();
    const token = useSelector((state) => state.auth.login.currentUser.accessToken);
    const [avatarUrl, setAvatarUrl] = useState('');

    const defaultAvatar =
        'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png';

    const schema = yup.object().shape({
        username: yup.string().min(5, 'Username phải hơn 5 kí tự').required('Username là bắt buộc'),
        email: yup.string().email('Vui lòng nhập đúng định dạng email').required('Email là bắt buộc'),
        avatar: yup.mixed().required('Vui lòng chọn ảnh'),
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const getUserById = async () => {
            try {
                const res = await axios.get(`/v1/user/${id}`, {
                    headers: { token: `Bearer ${token}` },
                });
                setValue('username', res.data.data.username);
                setValue('email', res.data.data.email);
                setAvatarUrl(res.data.data.avatar);
            } catch (error) {
                console.log(error);
            }
        };
        getUserById();
    }, [id, token, setValue]);

    const handleSelectFile = (e) => {
        setValue('avatar', e.target.files[0]);
        setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    };

    const handleUpdate = async (data) => {
        try {
            await axios.put(`/v1/user/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: `Bearer ${token}`,
                },
            });
            toast.success('Cập nhật hồ sơ thành công!');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-[500px] mx-auto">
            <div className="flex flex-col items-center justify-center p-12 max-sm:w-full">
                <h1 className="mt-6 mb-2 text-3xl font-semibold">Profile</h1>
                <p className="text-[#555] text-2xl">Please enter your details.</p>
                <form
                    className="flex flex-col items-center w-full gap-4 mt-10"
                    onSubmit={handleSubmit(handleUpdate)}
                    encType="multipart/form-data"
                >
                    <div className="w-full">
                        <input
                            className={`w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md ${
                                errors.username ? 'border-red-500' : ''
                            }`}
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            {...register('username')}
                        />
                        <p className="text-red-500">{errors.username?.message}</p>
                    </div>

                    <div className="w-full">
                        <input
                            disabled
                            className={`w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md ${
                                errors.email ? 'border-red-500' : ''
                            }`}
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            {...register('email')}
                        />
                        <p className="text-red-500">{errors.email?.message}</p>
                    </div>

                    <div className="w-full">
                        <input
                            onChange={handleSelectFile}
                            className={`w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md ${
                                errors.avatar ? 'border-red-500' : ''
                            }`}
                            type="file"
                            name="avatar"
                            placeholder="Enter your avatar"
                        />
                        <p className="text-red-500">{errors.avatar?.message}</p>
                    </div>

                    <img
                        src={avatarUrl ? avatarUrl : defaultAvatar}
                        className="w-[100px] h-[100px] object-cover rounded-full border-[1px] border-solid border-[#999]"
                        alt="Avatar"
                    />

                    <button
                        type="submit"
                        className="w-[130px] text-2xl p-4 rounded-md bg-[#2564cf] text-white hover:bg-opacity-80"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
