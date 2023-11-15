import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import images from '~/assets/images';
import ErrorMessage from '~/components/ErrorMessage';
import Image from '~/components/Image/Image';
import config from '~/config';
import { signInWithGoogle } from '~/firebaseConfig';
import { loginUser } from '~/redux/apiRequest';
import { loginValidationSchema } from './validationSchema';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(loginValidationSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const { username, password } = errors;

    const { mutate } = useMutation({
        mutationFn: (data) => loginUser(data, dispatch, navigate),
        onSuccess: (data) => {
            if (data) {
                toast.success('Login successfully');
            } else {
                toast.error('Login failed!');
            }
        },
    });

    const onSubmitForm = (data) => {
        mutate(data);
    };

    const handleSignInGoogle = () => {
        signInWithGoogle();
    };

    return (
        <div className="flex h-screen">
            <div className="flex flex-col items-center justify-center p-12 max-sm:w-full">
                <Image src={images.logo} alt="Logo" className="w-24 rounded-md" />
                <h1 className="mt-6 mb-2 text-3xl font-semibold">Welcome back</h1>
                <p className="text-[#555] text-2xl">Please enter your details.</p>

                <form className="flex flex-col items-center w-full gap-4 mt-10" onSubmit={handleSubmit(onSubmitForm)}>
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
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            {...register('password')}
                        />
                        <ErrorMessage name={password} />
                    </div>
                    <button className="bg-[#333] border-[1px] border-solid border-[#333] text-white w-full p-4 rounded-md text-2xl hover:bg-opacity-90">
                        Continue
                    </button>
                </form>

                <span className="my-6 text-[#555] text-2xl">OR</span>
                          <a href="/forgot-password">Forgot Password</a>
                <div className="flex flex-col items-center w-full gap-4">
                    <button
                        className="bg-white border-[1px] border-solid border-[#ccc] text-2xl text-[#333] w-full p-4 rounded-md hover:bg-[rgba(0,0,0,0.05)]"
                        onClick={handleSignInGoogle}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="text-red-600" />
                        <span className="ml-3">Continue with Google</span>
                    </button>
                </div>

                <p className="mt-8 text-2xl">
                    Don't have an account?{' '}
                    <Link className="font-medium" to={config.routes.register}>
                        Sign up
                    </Link>
                </p>
            </div>
            <div className="flex-1 max-sm:hidden">
                <Image
                    className="rounded-tl-[60px] rounded-bl-[60px] object-cover h-screen w-full"
                    src={images.backgroundLogin}
                    alt="Login background"
                />
            </div>
        </div>
    );
}

export default Login;
