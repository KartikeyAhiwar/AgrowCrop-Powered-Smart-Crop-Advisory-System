import React from 'react';
import { SignIn } from "@clerk/clerk-react";

/**
 * Login Component
 * Uses Clerk's pre-built SignIn component
 */
const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 flex justify-center">
                <SignIn />
            </div>
        </div>
    );
};

export default Login;
