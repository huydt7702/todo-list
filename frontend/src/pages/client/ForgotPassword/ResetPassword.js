import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

import ErrorMessage from '~/components/ErrorMessage';
import config from '~/config';
import './style.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const schema = Yup.object().shape({
        password: Yup.string()
            .required()
            .min(6, 'Password must be at least 6 characters')
            .max(16, 'Please enter up to 16 characters'),
        confirmPassword: Yup.string()
            .required()
            .oneOf([Yup.ref('password')], 'Confirm Password must match password'),
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });

    const { password, confirmPassword } = errors;

    const validatePassword = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            toast.error('Password and confirm password do not match');
            return false;
        }
        return true;
    };

    const onSubmitForm = async ({ password, confirmPassword }) => {
        if (!validatePassword(password, confirmPassword)) return;
        try {
            await axios.post('/v1/auth/reset-password', { token, password });
            toast.success('Reset password successfully');
            navigate(config.routes.login);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center max-w-4xl p-8 mx-auto mt-40 bg-white rounded-xl lg:shadow-lg">
            <h1 className="mt-6 mb-4 text-4xl font-semibold">Reset your password</h1>
            <p className="text-[#555] text-2xl">Please enter your new password.</p>

            <form className="w-full p-10 mt-4" onSubmit={handleSubmit(onSubmitForm)}>
                <div className="flex flex-col w-full gap-4">
                    <div>
                        <input
                            className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                            type="password"
                            name="password"
                            {...register('password')}
                            placeholder="Enter your password"
                        />
                        <ErrorMessage name={password} />
                    </div>
                    <div>
                        <input
                            className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                            type="password"
                            name="confirmPassword"
                            {...register('confirmPassword')}
                            placeholder="Confirm your password"
                        />
                        <ErrorMessage name={confirmPassword} />
                    </div>
                    <button className="w-full text-2xl p-4 bg-[#2564CF] text-white font-medium border-[1px] border-solid border-[#999] rounded-md hover:opacity-80">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
