import { FC } from 'react';

const Logo: FC = () => (
    <div className="flex items-center space-x-2">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                fill="#8B5CF6"
            />
            <path
                d="M22 16C22 19.3137 19.3137 22 16 22C12.6863 22 10 19.3137 10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16Z"
                fill="white"
            />
        </svg>
        <span className="text-xl font-bold text-white">
            {process.env.NEXT_PUBLIC_APP_NAME || ''}
        </span>
    </div>
);

export default Logo;