import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { CirclePlus, ArrowLeft, TextSearch, QrCode, MoreHorizontalIcon, MailCheckIcon, ArchiveIcon, ClockIcon,Trash2Icon, Eye, ListFilterIcon, TagIcon} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover';
import { Calendar } from '@/Components/ui/calendar';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import PrimaryButton from '@/Components/PrimaryButton';
import CreateNewEventForm from '../Partials/CreateNewEventForm';
import DataTable from '@/Components/DataTable';
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ViewEventDetails from '../Partials/ViewEventDetails';
import ViewQRLinkShare from '../Partials/ViewQRLinkShare';
import ViewAttendanceList from '../Partials/ViewAttendanceList';
import DeleteEvent from '../Partials/DeleteEvent';
import RequestVehicle from '../Partials/RequestVehicle';
import ViewRequestVehicle from '../Partials/ViewRequestVehicle';
import RequestApproval from '../Partials/RequestApproval';
import StartUse from '../Partials/StartUse';
import InProgress from '../Partials/InProgress';

export default function ManagementIndex({events, vehicles, vehicle_usage, vehicle_usages, approver_status, users, current_entity}) {
    const [showForm, setShowForm] = useState(false);
    const [openEventDate, setOpenEventDate] = useState(false);
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const { flash } = usePage().props;
    const [usage_data, setUsageData] = useState([]);

    useEffect(() => {
        entityVehicleUsage(vehicle_usages, vehicles, current_entity);
    }, [vehicle_usages, vehicles, current_entity]);

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

    function entityVehicleUsage(vehicle_usages, vehicles, current_entity, usage_data){
        // ambil semua vehicle utk entity semasa
        const entityVehicles = vehicles.filter(
            vehicle => vehicle.owner_entity === current_entity
        );

        // ambil semua uuid vehicle
        const vehicleUuids = entityVehicles.map(
            vehicle => vehicle.id
        );

        // filter usage ikut vehicle uuid
        const entity_vehicle_usage = vehicle_usages.filter(
            usage => vehicleUuids.includes(usage.vehicle_uuid)
        );
        console.log(entity_vehicle_usage);
        setUsageData(entity_vehicle_usage);
        
    }

    const displayEventForm = (type) => {
        // reset();
        setShowForm(type);
    };

    const handleFormSubmitSuccess = () => {
        setShowForm(false);
    };

    const getVehiclePlateNumber = (vehicle_uuid) => {
        const vehicle = vehicles.find(v => v.id === vehicle_uuid);
        console.log(vehicle_uuid)
        return vehicle ? vehicle.plateNum : 'Unknown Vehicle';
    }

    const getName = (user_uuid) => {
        const user = users?.find(u => u.id === user_uuid);
        return user ? user.name : 'Unknown User';
    } 

    const getVehicleModel = (vehicle_uuid) => {
        const vehicle = vehicles?.find(v => v.id === vehicle_uuid);
        return vehicle ? vehicle.vehicle_model : 'Unknown Vehicle';
    }

    const getVehicleManufacturer = (vehicle_uuid) => {
        const vehicle = vehicles?.find(v => v.id === vehicle_uuid);
        return vehicle ? vehicle.vehicle_manufacturer : 'Unknown Vehicle';
    } 

    const columns= [
        {
            Header: 'Plate Number',
            accessor: ['purpose'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{getVehiclePlateNumber (row.vehicle_uuid)}</div>
                </div>
            )
        },
        {
            Header: 'Name',
            accessor: ['name'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-sm'>{getName (row.user_uuid)}</div>
                </div>
            )
        },
        {
            Header: 'Date',
            accessor: ['start_date'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-sm'>{formatDateTime(row.start_date)}{row.end_date !== row.start_date && ` - ${formatDateTime(row.end_date)}`}</div>
                    <div className='text-sm'>{formatDateTime(row.actual_start_datetime)}{row.actual_end_datetime !== row.actual_start_datetime && ` - ${formatDateTime(row.actual_end_datetime)}`}</div>
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
                    {row.application_status === 'rejected' && (
                        <span class='flex items-center bg-red-200 border border-danger-subtle text-gray-700 text-sm font-medium px-1.5 py-0.5 rounded'>
                            <span class="h-1.5 w-1.5 bg-red-600 rounded-full me-1"></span>
                            Rejected
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

    console.log(vehicle_usages);

    return (
        <AuthenticatedLayout>
            <Head title="Home" />
            <div className="py-6 px-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div>
                        <div className="p-2 font-bold">
                            My Fleet
                        </div>
   
                        <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-6 my-2 ">
                            {vehicles.map((vehicle) => (
                                <Link href={route('fleetDetail', vehicle.id)}>
                                    <div class="rounded-lg bg-gradient-to-bl from-gray-300 to-gray-500">
                                        <div className="p-4 text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                                            <div className='uppercase font-bold'>
                                                {vehicle.plateNum}
                                            </div>
                                            <div className=''>
                                                {vehicle.vehicle_manufacturer} {vehicle.vehicle_model}
                                            </div>
                                        </div>
                                    </div>
                                </Link> 
                            ))}                                     
                        </div> 
                    </div>
                    {/* {entityVehicleUsage(vehicle_usages, vehicles, current_entity)} */}
                    <div className="p-2 md:p-2 text-gray-900 border-t-2 border-gray-700">
                        <div className="font-bold">
                            Fleet Movement
                        </div>
                        <div className="py-2">
                            <div className="md:mx-auto md:max-w-7xl lg:px-8">
                                <div className="m-2 p-4 text-gray-900 border border-gray-300 rounded-lg shadow"> 
                                    <div className="text-gray-900">                                        
                                        <DataTable columns={columns} data={usage_data} className='mt-4'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {flash?.success && (
                        <div className='bg-green-200 p-2 my-2 rounded-lg'>
                            {flash.success}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );

    

}
