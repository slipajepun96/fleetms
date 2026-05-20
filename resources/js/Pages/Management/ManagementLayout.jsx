import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SmallNavLink from '@/Components/SmallNavLink';
import InputLabel from '@/Components/InputLabel';
import FleetUsage from './FleetUsage';

export default function ManagementLayout({ header, children, vehicles, vehicle_usages, statement_dates, previous_month_odometer }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    
    const [currentView, setCurrentView] = useState('usage');

    const formatDateTime = (dateTimeString) => 
    {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        // Convert to UTC+8
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.toLocaleString('en-My', { month: 'long' }));
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    };

    const changeCurrentView = (target) =>
    {
        setCurrentView (now=>target);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Detail" />
            <div className="py-6 px-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div>
                        <div className="font-bold">
                            Fleet Details
                        </div>
                        <div className='text-xl font-bold'>
                            {vehicles.plateNum}
                        </div>

                        <div className=''>
                            <div className="text-gray-900 border border-gray-900 rounded-lg shadow-md">
                                <div className='m-2'>
                                    <InputLabel
                                        value={
                                            <>
                                                Details
                                            </>
                                        }
                                        />
                                    <div>
                                        <InputLabel
                                        value={
                                            <>
                                                Vehicle
                                            </>
                                        }
                                        />
                                        {vehicles.vehicle_manufacturer} {vehicles.vehicle_model}
                                    </div>

                                    <div className='grid grid-cols-2'>
                                        <div>
                                            <InputLabel
                                            value={
                                                <>
                                                    Insurance expiry date
                                                </>
                                            }
                                            />
                                            {formatDateTime(vehicles.insurance_expiry)}
                                        </div>

                                        <div>
                                            <InputLabel
                                            value={
                                                <>
                                                    Roadtax expiry date
                                                </>
                                            }
                                            />
                                            {formatDateTime(vehicles.roadtax_expiry)}
                                        </div>
                                    </div>
                                    
                                    <div className='grid grid-cols-2'>
                                    <div>
                                        <InputLabel
                                        value={
                                            <>
                                                Vehicle Type
                                            </>
                                        }
                                        />
                                        {vehicles.vehicle_type}
                                    </div>
                                    
                                    {vehicles.vehicle_type === 'Designated' && (
                                    <div>
                                        <InputLabel
                                        value={
                                            <>
                                                Designated person
                                            </>
                                        }
                                        />
                                        {vehicles.designated_person}
                                    </div>
                                    )}

                                    <div>
                                        <InputLabel
                                        value={
                                            <>
                                                Owner
                                            </>
                                        }
                                        />
                                        {vehicles.owner_entity}
                                    </div>
                                    </div>

                                    <div>
                                        <InputLabel
                                        value={
                                            <>
                                                Current Odometer
                                            </>
                                        }
                                        />
                                        {vehicles.current_odometer}
                                    </div>

                                    <div className='p-2 text-right text-sm font-bold'>Edit in Configuration!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row'>
                        <div className='md:w-1/6 p-4 md:p-9 text-gray-900 font-semibold md:min-h-screen border-r'>
                            <div className='mt-3 gap-5 flex flex-row md:flex-col'>
                                <div onClick={()=>setCurrentView('usage')} className="shadow hover:shadow-md">Usage</div>
                                <div onClick={()=>setCurrentView('maintenance')} className="shadow hover:shadow-md">Maintenance</div>
                                <div onClick={()=>setCurrentView('report')} className="shadow hover:shadow-md">Report</div>
                            </div>
                        </div>
                        <div className='md:w-5/6'>
                            <main>{children}</main>
                            <FleetUsage vehicle_usages={vehicle_usages} vehicle={vehicles} currentView={currentView} statement_dates={statement_dates} previous_month_odometer={previous_month_odometer}/>
                        </div>
                    </div>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}
