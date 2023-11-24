import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';

import images from '~/assets/images';
import ErrorMessage from '~/components/ErrorMessage';
import Image from '~/components/Image/Image';
import config from '~/config';
import { registerUser } from '~/redux/apiRequest';
import { registerValidationSchema } from './validationSchema';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(registerValidationSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const { username, email, password } = errors;

    const { mutate } = useMutation({
        mutationFn: (data) => registerUser(data, dispatch, navigate),
        onSuccess: (data) => {
            if (data) {
                toast.success('Sign up successfully');
            } else {
                toast.error('Sign up failed!');
            }
        },
    });

    const onSubmitForm = (data) => {
        mutate(data);
    };

    return (
        <section
            class="bg-gray-300 min-h-screen flex items-center justify-center"
            style={{
                backgroundImage: `url(https://wallpapersmug.com/download/2048x1152/7a22c5/forest_mountains_sunset_cool_weather_minimalism.jpg)`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <div class="bg-gray-100 flex rounded-2xl shadow-lg w-1/2">
                <div className="flex flex-col items-center justify-center p-12 max-sm:w-full">
                    <Image src={images.logo} alt="Logo" className="w-24 rounded-md" />
                    <h1 className="mt-6 mb-2 text-3xl font-semibold">Create an account</h1>
                    <p className="text-[#555] text-2xl">Sign Up to Get Started.</p>

                    <form
                        className="flex flex-col items-center w-full gap-4 mt-10"
                        onSubmit={handleSubmit(onSubmitForm)}
                    >
                        <div className="flex flex-col w-full">
                            <input
                                className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                {...register('username')}
                            />
                            <ErrorMessage name={username} />
                        </div>
                        <div className="flex flex-col w-full">
                            <input
                                className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                {...register('email')}
                            />
                            <ErrorMessage name={email} />
                        </div>
                        <div className="flex flex-col w-full">
                            <input
                                className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                {...register('password')}
                            />
                            <ErrorMessage name={password} />
                        </div>
                        <button className="bg-[#333] border-[1px] border-solid border-[#333] text-white w-full p-4 rounded-md text-2xl hover:bg-opacity-90">
                            Create account
                        </button>
                    </form>

                    <span className="my-6 text-[#555] text-2xl">-----OR-----</span>

                    <div className="flex flex-col items-center w-full gap-4">
                        <button className="bg-white border-[1px] border-solid border-[#ccc] text-2xl text-[#333] w-full p-4 rounded-md hover:bg-[rgba(0,0,0,0.05)]">
                            <FontAwesomeIcon icon={faGoogle} className="text-red-600" />
                            <span className="ml-3">Sign up with Google</span>
                        </button>
                    </div>

                    <p className="mt-8 text-2xl">
                        Already have an account?{' '}
                        <Link className="font-medium" to={config.routes.login}>
                            Login
                        </Link>
                    </p>
                </div>
                <div className="flex-1 p-8 max-sm:hidden">
                    <Image
                        className="object-cover h-full rounded-2xl"
                        src={images.backgroundRegister}
                        alt="Register background"
                    />
                </div>
            </div>
        </section>
    );
}

export default Register;
