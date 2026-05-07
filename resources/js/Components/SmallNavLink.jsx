import { Link } from '@inertiajs/react';

export default function SmallNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'rounded-lg inline-flex items-center px-3 pt-1 text-md font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'bg-gray-100'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 focus:border-gray-300 focus:text-gray-700') +
                className
            }
        >
            {children}
        </Link>
    );
}
