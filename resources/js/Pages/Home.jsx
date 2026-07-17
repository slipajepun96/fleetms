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
import CreateNewEventForm from './Partials/CreateNewEventForm';
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
import ViewEventDetails from './Partials/ViewEventDetails';
import ViewQRLinkShare from './Partials/ViewQRLinkShare';
import ViewAttendanceList from './Partials/ViewAttendanceList';
import DeleteEvent from './Partials/DeleteEvent';
import AddForeignWorker from './AddForeignWorker';
import ViewRequestVehicle from './Partials/ViewRequestVehicle';
import RequestApproval from './Partials/RequestApproval';
import StartUse from './Partials/StartUse';
import InProgress from './Partials/InProgress';
import AddPassport from './Partials/AddPassport';
import EditWorker from './Partials/EditWorker';

export default function Home({events, vehicles, vehicle, mainForeignWorkers, fwpassports, fwpermits}) {
    const [showForm, setShowForm] = useState(false);
    const [openEventDate, setOpenEventDate] = useState(false);
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const { flash } = usePage().props;
    const [usage_data, setUsageData] = useState([]);

    const dateFormat = (date) => {
        return format(date, 'dd MMM yyyy');
    }

    const displayEventForm = (type) => {
        // reset();
        setShowForm(type);
    };

    const handleFormSubmitSuccess = () => {
        setShowForm(false);
    };

    // function entityVehicleUsage(vehicle_usages, vehicles, current_entity, usage_data){
    //     // ambil semua vehicle utk entity semasa
    //     const entityVehicles = vehicles.filter(
    //         vehicle => vehicle.owner_entity === current_entity
    //     );

    //     // ambil semua uuid vehicle
    //     const vehicleUuids = entityVehicles.map(
    //         vehicle => vehicle.id
    //     );

    //     // filter usage ikut vehicle uuid
    //     const entity_vehicle_usage = vehicle_usages.filter(
    //         usage => vehicleUuids.includes(usage.vehicle_uuid)
    //     );
    //     console.log(entity_vehicle_usage);
    //     setUsageData(entity_vehicle_usage);
        
    // }

    const getPassportnumber = (fw_main_uuid) => {
        const fwpassport = fwpassports.find(v => v.fw_main_uuid === fw_main_uuid);
        return fwpassport ? fwpassport.pass_number : 'Unknown Passport';
    }

    const getPermitnumber = (fw_passport_uuid) => {
        const fwpermit = fwpermits.find(v => v.fw_passport_uuid === fw_passport_uuid);
        return fwpermit ? fwpermit.permit_number : 'Unknown Permit';
    }

    const columns=[
        {
            Header: 'Name',
            accessor: ['fw_name'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.fw_name}</div> 
                </div>
            )
        },
        {
            Header: 'Date of Birth',
            accessor: ['fw_dob'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{dateFormat(row.fw_dob)}</div> 
                </div>
            )
        },
        {
            Header: 'Gender',
            accessor: ['fw_gender'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.fw_gender}</div> 
                </div>
            )
        },
        {
            Header: 'Country',
            accessor: ['fw_country'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.fw_country}</div> 
                </div>
            )
        },
        {
            Header: 'Passport Number',
            accessor: ['id'],
            Cell: ({row}) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{getPassportnumber(row.id)}</div> 
                </div>
            )
        },
        {
            Header: 'Permit Number',
            accessor: ['id'],
            Cell: ({row}) => {
                const fwpassport = fwpassports.find(v => v.fw_main_uuid === row.id);
                return (
                    <div className="flex flex-col">
                        <div className='font-semibold'>{fwpassport ? getPermitnumber(fwpassport.id) : 'No Passport'}</div> 
                    </div>
                );
            }
        },
        {
            Header: 'Action',
            accessor:'actions',
            Cell: ({row}) => (
                <div className="flex space-x-2 gap-2">
                    <AddPassport mainForeignWorkers={row} fwpassports={row}/>
                    <EditWorker />
                </div>
            )
        },
    ]

    return (
        <AuthenticatedLayout>
            <Head title="Home" />

            <div className="py-6 px-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* <div className="overflow-hidden bg-gradient-to-bl from-black  to-slate-500 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-white">
                            Make Your Attendance Easy with <b>attend</b>!
                        </div>
                    </div> */}
                    <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-6 my-2">
                        <div>
                            <Link 
                                href={route('fworker.add')}>
                                    <div className="grid flex-1 gap-2 my-2">
                                        <div className="p-4 h-32 text-gray-900 border border-gray-300 bg-amber-700 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                                            <div className='text-xl font-bold'>
                                                FW Foreign Worker                            
                                            </div>
                                        </div>
                                    </div> 
                            </Link>
                            {/* <AddForeignWorker /> */}
                            {/* <RequestVehicle vehicles={vehicles}/> */}
                        </div>
                        <div>
                            {/* <StartUse vehicle_usages={vehicle_usages} vehicles={vehicles} requests_approved={requests_approved} vehicle={vehicle} /> */}
                        </div>
                    </div>

                    <div className="p-2 md:p-2 text-gray-900 border-t-2 border-gray-700 bg-white rounded">
                        <div className="font-bold">
                            Foreign Worker
                        </div>
                        {/* <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                            {vehicle_in_progress.map((vehicle_in_progress) => (
                                <InProgress vehicle_usage={vehicle_in_progress} vehicles={vehicles} fuelTransactions={fuelTransactions}/>
                            ))}{vehicle_in_progress.length === 0 && (
                                <div>Nothing Started</div>
                            )}
                        </div> */}
                        <div className="m-2 p-4 text-gray-900 border border-gray-300 rounded-lg shadow">
                            <div className="text-gray-900">
                                <DataTable columns={columns} data={mainForeignWorkers} className='mt-4'/>
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
