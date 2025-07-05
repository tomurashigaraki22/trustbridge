"use client"
import { FC } from 'react';

const Logo: FC = () => (
    <div className="flex items-center space-x-2">
        <img src="/trustlogo.jpeg" alt="Logo" className="w-10 h-10 rounded-full" />
        <span className="text-xl font-bold text-black">
            {process.env.NEXT_PUBLIC_APP_NAME || ''}
        </span>
    </div>
);

export default Logo;