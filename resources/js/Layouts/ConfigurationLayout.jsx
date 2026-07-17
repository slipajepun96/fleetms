import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import SmallNavLink from '@/Components/SmallNavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function ConfigurationLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <AuthenticatedLayout>
            <div className='flex flex-col md:flex-row'>
                <div className='md:w-1/6 p-4 md:p-9 text-gray-900 font-semibold md:min-h-screen border-r'>
                    <div className='mt-3 gap-5 flex flex-row md:flex-col'>
                        <SmallNavLink 
                            href={route('entity.index')}
                            active={route().current('entity.index')}>
                            Entity
                        </SmallNavLink>
                        <SmallNavLink 
                            href={route('user.index')}
                            active={route().current('user.index')}>
                            User
                        </SmallNavLink>
                        <SmallNavLink 
                            href={route('status.index')}
                            active={route().current('status.index')}>
                            Status
                        </SmallNavLink>
                        <SmallNavLink 
                            href={route('country.index')}
                            active={route().current('country.index')} >
                            Country
                        </SmallNavLink>
                    </div>
                </div>
                <div className='md:w-5/6'>
                    <main>{children}</main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
