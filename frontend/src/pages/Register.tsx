import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { registerUser } from '../utils/api';
import { useAuth } from '../utils/auth';
import { CreateUserInput, createUserSchema } from '@ifti_taha/streaker-common';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
    const [formData, setFormData] = useState<CreateUserInput>({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const navigate = useNavigate();
    const { authUser } = useAuth();

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

            // Success case
            navigate('/login');
            toast.success('Account created successfully. Please log in to continue.');

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    // Determine if a field should have a floating label
    const shouldFloat = (fieldName: string) => {
        return focusedField === fieldName || formData[fieldName as keyof CreateUserInput] !== '';
    };

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
                                    Please enter a unique username without spaces (e.g., dexter@ifti)
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;