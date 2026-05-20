import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import SmallNavLink from '@/Components/SmallNavLink';
import InputLabel from '@/Components/InputLabel';
import { Link } from '@inertiajs/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"

export default function FleetUsage({ vehicle_usages, vehicle, currentView, statement_dates, previous_month_odometer }) {

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({ 
        vehicle_id: vehicle.id,
        selectedMonthYear: '',
    });

    const formatDateTime = (dateTimeString) => 
    {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        // Convert to UTC+8
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.toLocaleString('en-My', { month: 'long' }));
        const year = date.getFullYear();
        
        return `${day} ${month} ${year}`;
    };

    console.log(currentView);
    const [loading, setLoading] = useState(false);

    const submit = (e) => {
            e.preventDefault();
            console.log('onSuccess', data);
    
            post(route('viewReport'), {
                onSuccess: () => {
                    reset()
                }
            })
        };

    const columnUsage= [
        {
            Header: 'Start date',
            accessor: ['start_date'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-sm'>{formatDateTime(row.start_date)} -  {formatDateTime(row.end_date)}</div>
                </div>
            )
        },
        {
            Header: 'Destination',
            accessor: ['destination'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-sm'>{row.destination}</div>
                </div>
            )
        },
        {
            Header: 'Purpose',
            accessor: ['purpose'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-sm'>{row.purpose}</div>
                </div>
            )
        },
        {
            Header: 'Odometer',
            accessor: ['start_odometer'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-sm'>{row.start_odometer} - {row.end_odometer}</div>
                </div>
            )
        },
        {
            Header: 'Status',
            accessor: ['application_status'],
            Cell: ({row}) => (
                <div className="flex">
                    {row.application_status === 'pending' && (
                        <span class='flex items-center bg-amber-200 border border-warning-subtle text-gray-700 text-sm font-medium px-1.5 py-0.5 rounded'>
                            <span class="h-1.5 w-1.5 bg-amber-700 rounded-full me-1"></span>
                            Pending
                        </span>
                    )}
                    {row.application_status === 'approved' && (
                        <span class='flex items-center bg-lime-200 border border-success-subtle text-gray-700 text-sm font-medium px-1.5 py-0.5 rounded'>
                            <span class="h-1.5 w-1.5 bg-lime-600 rounded-full me-1"></span>
                            Approved
                        </span>
                    )}
                    {row.application_status === 'progress' && (
                        <span class='flex items-center bg-blue-200 border border-danger-subtle text-gray-700 text-sm font-medium px-1.5 py-0.5 rounded'>
                            <span class="h-1.5 w-1.5 bg-blue-600 rounded-full me-1"></span>
                            In Progress
                        </span>
                    )}
                    {row.application_status === 'finished' && (
                        <span class='flex items-center bg-green-200 border border-danger-subtle text-gray-700 text-sm font-medium px-1.5 py-0.5 rounded'>
                            <span class="h-1.5 w-1.5 bg-green-600 rounded-full me-1"></span>
                            Finished
                        </span>
                    )}
                </div>
            )
        }
    ]

    return (
        <div>
            <Head title="Home" />
            <div className="py-6 px-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {currentView === 'usage' && (
                        <div className="">
                            <div className="py-2">
                                <div className="md:mx-auto md:max-w-7xl lg:px-8">
                                    <div className="m-2 p-4 text-gray-900 border border-gray-300 rounded-lg shadow"> 
                                        <div className="text-gray-900">                                        
                                            <DataTable columns={columnUsage} data={vehicle_usages} className='mt-4'/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {currentView === 'maintenance' && (
                        <div className="">
                            <div className="py-2">
                                <div className="md:mx-auto md:max-w-7xl lg:px-8">
                                    <div className="m-2 p-4 text-gray-900 border border-gray-300 rounded-lg shadow"> 
                                        <PrimaryButton>+ Log</PrimaryButton>
                                        <div className="text-gray-900">                                        
                                            <DataTable columns={columnUsage} data={vehicle_usages} className='mt-4'/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {currentView === 'report' && (
                        <div className="">
                            <div className="py-2">
                                <div className="md:mx-auto md:max-w-7xl lg:px-8">
                                    <div className="m-2 p-4 text-gray-900 border border-gray-300 rounded-lg shadow"> 
                                        <form onSubmit={submit}>
                                            <div className="text-gray-900">
                                                Generate Report 
                                            </div>
                                            <div className='mt-2 flex gap-2'>
                                                <Select
                                                    onValueChange={(val) => setData('selectedMonthYear', val)}
                                                    value={data.selectedMonthYear}
                                                    disabled={loading}
                                                    className="w-full">
                                                    <SelectTrigger className="w-full bg-white min-w-[120px]">
                                                        <SelectValue placeholder="Month Year" />
                                                    </SelectTrigger>
                                                    <SelectContent 
                                                        id="month_year"
                                                        name="month_year"
                                                    >
                                                        {statement_dates.map((yr) => (
                                                            <SelectItem key={yr.month_year} value={yr.month_year}>{yr.month_year}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <PrimaryButton disabled={data.selectedMonthYear === ''} previous_month_odometer={previous_month_odometer} >
                                                    Generate
                                                </PrimaryButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}