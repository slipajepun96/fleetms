import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import VehicleDeleteVehicle from './Partials/VehicleDeleteVehicle';
import UserAuthorisedUser from './Partials/UserAuthorisedUser';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import UserEditUser from './Partials/UserEditUser';

export default function User({ users, user}) {
    console.log(users);

    const columns= [
        {
            Header: 'Name',
            accessor: ['name'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.name}</div>
                    <div className='font-normal'>{row.actual_name ?? '-'}</div> 
                    <div className='font-normal'>{row.designation ?? '-'}</div>
                </div>
            )
        },
        {
            Header: 'Email',
            accessor: ['email'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.email}</div> 
                </div>
            )
        },
        {
            Header: 'Entity',
            accessor: ['entity'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.entity}</div> 
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: ['is_authorised'],
            Cell: ({row}) => {
                 return ( 
                    <div className="flex space-x-2 gap-2">
                        {row.is_authorised === 0 ? (
                            <div className="flex items-center bg-green-300 rounded-xl font-bold px-2 py-0.5 text-green-800 uppercase text-xs font-semibold">
                                Not Authorised
                            </div>
                        ): (
                            <div className="flex items-center bg-yellow-300 rounded-xl font-bold px-2 py-0.5 text-yellow-800 uppercase text-xs font-semibold">
                                Authorised
                            </div>
                        )}
                    </div>
                )
            }
        },
        {
            Header: 'Action',
            accessor:'actions',
            Cell: ({row}) => (
                <div className="flex space-x-2 gap-2">
                    <UserAuthorisedUser user={row}/>
                    <UserEditUser user={row}/>
                </div>
            )
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Vehicle
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-2">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="p-4 text-gray-900 border border-gray-300 rounded-lg shadow">
                        <div className="p-6 text-gray-900">
                            <DataTable columns={columns} data={users} className='mt-4'/>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
