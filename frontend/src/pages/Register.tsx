import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { registerUser, loginUser, fetchUserInfo } from '../utils/api';
import { useAuth } from '../utils/auth';
import { CreateUserInput, createUserSchema } from '@ifti_taha/streaker-common';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';

// Add this helper function at the top of your component, after the imports
const generateUsername = (name: string): string => {
    // Remove special characters and spaces, convert to lowercase
    const cleanName = name.toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/\s+/g, '');
    
    // Generate a random string
    const randomString = Math.random().toString(36).substring(2, 6);
    
    // Combine name with random string
    return `${cleanName}-${randomString}`;
};

const Register: React.FC = () => {
    const [formData, setFormData] = useState<CreateUserInput>({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login, authUser } = useAuth();

    useEffect(() => {
        if (authUser) {
            navigate('/home');
        }
    }, [authUser, navigate]);

    const [error, setError] = useState<string>('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});
        setLoading(true);

        try {
            // Validate form data using Zod schema
            createUserSchema.parse(formData);

            const response = await registerUser(formData);

            if (response.error) {
                setError(response.message || 'Registration failed. Please try again.');
                return;
            }

            // Automatically log in the user after registration
            const loginResponse = await loginUser({ email: formData.email, password: formData.password });

            if (loginResponse.error || !loginResponse.token) {
                setError(loginResponse.error || loginResponse.message || 'Login failed. Please try again.');
                return;
            }

            // Success case
            login(loginResponse.user, loginResponse.token);
            navigate('/home');
            toast.success('Account created and logged in successfully.');

        } catch (error: any) {
            if (error.errors) {
                // Zod validation errors
                const errors: Record<string, string> = {};
                error.errors.forEach((err: any) => {
                    if (err.path) {
                        const fieldName = err.path[0];
                        errors[fieldName] = err.message;
                    }
                });
                setValidationErrors(errors);
                toast.error('Please fix the errors in the form and try again.');
            } else {
                // API or other errors
                setError(error.message || 'An error occurred during registration');
                toast.error('Please fix the errors in the form and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Replace the existing handleChange function
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'name') {
            // When name field changes, generate and set username
            const suggestedUsername = generateUsername(value);
            setFormData(prev => ({ 
                ...prev, 
                [name]: value,
                username: suggestedUsername 
            }));
        } else {
            // For other fields, just update normally
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const shouldFloat = (fieldName: string) => {
        return focusedField === fieldName || formData[fieldName as keyof CreateUserInput] !== '';
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                setLoading(true);
                setError('');
                setValidationErrors({});
                
                const userInfo = await fetchUserInfo(tokenResponse.access_token);
                
                // Generate a unique username by properly handling dots in email
                const randomString = Math.random().toString(36).substring(2, 8);
                const emailUsername = userInfo.email.split('@')[0].replace(/\./g, ''); // Remove dots from email
                const suggestedUsername = `${emailUsername}-${randomString}`;
                
                // Create the user data
                const googleUserData = {
                    name: userInfo.name,
                    username: suggestedUsername,
                    email: userInfo.email,
                    password: `G${Math.random().toString(36).slice(-8)}${Math.random().toString(36).slice(-8)}`
                };

                // Validate the data using Zod schema
                try {
                    createUserSchema.parse(googleUserData);
                } catch (validationError: any) {
                    const errors: Record<string, string> = {};
                    validationError.errors.forEach((err: any) => {
                        if (err.path) {
                            errors[err.path[0]] = err.message;
                        }
                    });
                    setValidationErrors(errors);
                    toast.error('Invalid data received from Google. Please try again.');
                    return;
                }

                // Attempt to register
                const response = await registerUser(googleUserData);

                if (response.error) {
                    setError(response.message || 'Registration failed');
                    toast.error(response.message || 'Registration failed');
                    return;
                }

                // Attempt to login
                const loginResponse = await loginUser({ 
                    email: googleUserData.email, 
                    password: googleUserData.password 
                });

                if (loginResponse.error || !loginResponse.token) {
                    setError(loginResponse.message || 'Login failed');
                    toast.error(loginResponse.message || 'Login failed');
                    return;
                }

                // Success case
                login(loginResponse.user, loginResponse.token);
                navigate('/home');
                toast.success('Account created and logged in successfully!');

            } catch (error: any) {
                console.error('Google registration error:', error);
                setError(error.message || 'Registration failed. Please try again.');
                toast.error(error.message || 'Registration failed. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google login failed!');
            toast.error('Google login failed!');
            setLoading(false);
        },
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <UserPlus className="w-12 h-12 text-blue-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm" role="alert">
                                <div className="flex">
                                    <div className="py-1">
                                        <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="block sm:inline font-medium">{error}</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="relative">
                                <label
                                    htmlFor="name"
                                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${shouldFloat('name')
                                        ? '-top-2 text-xs bg-white px-1 text-blue-600 z-10'
                                        : 'top-2 text-gray-500'
                                        }`}
                                >
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('name')}
                                    onBlur={handleBlur}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    aria-describedby={validationErrors.name ? "name-error" : undefined}
                                    aria-invalid={!!validationErrors.name}
                                />
                                {validationErrors.name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center" id="name-error">
                                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {validationErrors.name}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Enter your full name as it will appear on your profile
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <label
                                    htmlFor="username"
                                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${shouldFloat('username')
                                        ? '-top-2 text-xs bg-white px-1 text-blue-600 z-10'
                                        : 'top-2 text-gray-500'
                                        }`}
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    readOnly
                                    required
                                    pattern="^\S*$"
                                    title="Username must not contain spaces"
                                    value={formData.username}
                                    onChange={(e) => {
                                        if (e.target.value.includes(' ')) {
                                            setError('Username cannot contain spaces');
                                        } else {
                                            setError('');
                                        }
                                        handleChange(e);
                                    }}
                                    onFocus={() => handleFocus('username')}
                                    onBlur={handleBlur}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    aria-describedby="username-hint"
                                    aria-invalid={!!validationErrors.username}
                                />
                                {validationErrors.username && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center" id="username-error">
                                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {validationErrors.username}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500 flex items-center" id="username-hint">
                                    <svg className="h-4 w-4 mr-1 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 01-1-1v-3a1 1 0 112 0v3a1 1 0 01-1 1z" clipRule="evenodd" />
                                    </svg>
                                    {/* Please enter a unique username without spaces (e.g., dexter-ifti) */}
                                    Your username will be generated automatically
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${shouldFloat('email')
                                        ? '-top-2 text-xs bg-white px-1 text-blue-600 z-10'
                                        : 'top-2 text-gray-500'
                                        }`}
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('email')}
                                    onBlur={handleBlur}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    aria-describedby={validationErrors.email ? "email-error" : "email-hint"}
                                    aria-invalid={!!validationErrors.email}
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center" id="email-error">
                                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {validationErrors.email}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500" id="email-hint">
                                    We'll never share your email with anyone else
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="relative">
                                <label
                                    htmlFor="password"
                                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${shouldFloat('password')
                                        ? '-top-2 text-xs bg-white px-1 text-blue-600 z-10'
                                        : 'top-2 text-gray-500'
                                        }`}
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={handleBlur}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                    aria-describedby={validationErrors.password ? "password-error" : "password-hint"}
                                    aria-invalid={!!validationErrors.password}
                                />
                                {validationErrors.password && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center" id="password-error">
                                        <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {validationErrors.password}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500" id="password-hint">
                                    Password should be at least 8 characters and include letters and numbers
                                </p>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 transform hover:scale-105 active:scale-95"
                                aria-live="polite"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : 'Create Account'}
                            </button>
                        </div>

                        <div className="mt-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        By signing up, you agree to our Terms and Privacy Policy
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div>
                                    <button
                                        onClick={(e: React.MouseEvent) => {
                                            e.preventDefault();
                                            googleLogin();
                                        }}
                                        disabled={loading}
                                        type="button"
                                        className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span>Continue with Google</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
