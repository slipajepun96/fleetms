import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import FileInput from '@/Components/FileInput';
import { useRef, useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import RadioGroup from '@/Components/RadioGroup';
import DeleteRequestVehicle from './DeleteRequestVehicle';
import { useMediaQuery } from '@custom-react-hooks/use-media-query';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger, } from "@/components/ui/drawer"
import { ArrowRight, ArrowDown } from 'lucide-react';

export default function RequestApproval({vehicle_usage, vehicles, users}) {
    
    console.log(vehicles);
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");
    const totalParts = 2;
    const [currentPart, setCurrentPart] = useState(1);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({
        vehicle_uuid: '',
        destination: '',
        purpose: '',
        start_date: '',
        end_date: '',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
            reset();
            setCurrentPart(1);
        }
        
    };
    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);
        if(currentPart !== totalParts){
            return;
        }
        // setData(prev => ({
        //     ...prev,
        // }));
        setIsDialogOpen(false);
        setShouldSubmit(true);
    };

    useEffect(() => {
        if (shouldSubmit) {
            setShouldSubmit(false);
            console.log('Submitting data:', data);
            post(route('vehicle.request'), {
                
                preserveScroll: true,
                onError: errors => {
                    console.group('Submission Errors');
                    console.error('Errors:', errors);
                    console.groupEnd();
                    setIsDialogOpen(true);
                },
                onSuccess: () => {
                    reset();
                    setCurrentPart(1);
                    setIsDialogOpen(false);
                },
            });
        }
    }, [shouldSubmit]);

    const getVehiclePlateNumber = (vehicle_uuid) => {
        const vehicle = vehicles?.find(v => v.id === vehicle_uuid);
        console.log(vehicle_uuid);
        return vehicle ? vehicle.plateNum : 'Unknown Vehicle';
    }

    const getVehicleModel = (vehicle_uuid) => {
        const vehicle = vehicles?.find(v => v.id === vehicle_uuid);
        return vehicle ? vehicle.vehicle_model : 'Unknown Vehicle';
    }

    const getVehicleManufacturer = (vehicle_uuid) => {
        const vehicle = vehicles?.find(v => v.id === vehicle_uuid);
        return vehicle ? vehicle.vehicle_manufacturer : 'Unknown Vehicle';
    } 
    
    const formatDateTime = (dateTimeString) => 
    {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        // Convert to UTC+8
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };
    const formatDay = (dateString) => 
    {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}`;
    };
    const formatMonth = (dateString) => 
    {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return date.toLocaleString('ms-My', { month: 'long' });
    };

    const getName = (user_uuid) => {
        const user = users?.find(u => u.id === user_uuid);
        console.log(user_uuid);
        return user ? user.name : 'Unknown User';
    } 

    if(isDesktop)
    {
        return (
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                    <div className="">
                        <div className="p-4 h-32 text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                            <div className=''>
                                <div className='uppercase font-bold'>
                                    {getVehiclePlateNumber (vehicle_usage.vehicle_uuid)}                                          
                            </div>
                                <div className="">{formatDateTime(vehicle_usage.start_date)}{vehicle_usage.end_date !== vehicle_usage.start_date && ` / ${formatDateTime(vehicle_usage.end_date)}`}</div> 
                                <div className="">{vehicle_usage.destination}</div> 
                                <div className='flex'>
                                {/* <div className="flex items-center bg-amber-500 text-white py-1 px-3 rounded-md">
                                    {vehicle_usage.application_status}
                                </div> */}
                                {vehicle_usage.application_status === 'pending' && (
                                    <span class='flex items-center bg-amber-200 border border-warning-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-amber-700 rounded-full me-1"></span>
                                        Pending
                                    </span>
                                )}
                                {vehicle_usage.application_status === 'approved' && (
                                    <span class='flex items-center bg-lime-200 border border-success-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-lime-600 rounded-full me-1"></span>
                                        Approved
                                    </span>
                                )}
                                {vehicle_usage.application_status === 'rejected' && (
                                    <span class='flex items-center bg-red-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-red-600 rounded-full me-1"></span>
                                        Rejected
                                    </span>
                                )}
                                </div>
                            </div>
                        </div>                           
                    </div>    
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Request for Approval</DialogTitle>
                    </DialogHeader>
                    <RequestApproval />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DrawerTrigger asChild>
                    <div className="">
                        <div className="p-4 h-32 text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                            <div className=''>
                                <div className='uppercase font-bold'>
                                    {getVehiclePlateNumber (vehicle_usage.vehicle_uuid)}                                          
                            </div>
                                <div className="">{formatDateTime(vehicle_usage.start_date)}{vehicle_usage.end_date !== vehicle_usage.start_date && ` / ${formatDateTime(vehicle_usage.end_date)}`}</div> 
                                <div className="">{vehicle_usage.destination}</div> 
                                <div className='flex'>
                                {/* <div className="flex items-center bg-amber-500 text-white py-1 px-3 rounded-md">
                                    {vehicle_usage.application_status}
                                </div> */}
                                {vehicle_usage.application_status === 'pending' && (
                                    <span class='flex items-center bg-amber-200 border border-warning-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-amber-700 rounded-full me-1"></span>
                                        Pending
                                    </span>
                                )}
                                {vehicle_usage.application_status === 'approved' && (
                                    <span class='flex items-center bg-lime-200 border border-success-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-lime-600 rounded-full me-1"></span>
                                        Approved
                                    </span>
                                )}
                                {vehicle_usage.application_status === 'rejected' && (
                                    <span class='flex items-center bg-red-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-red-600 rounded-full me-1"></span>
                                        Rejected
                                    </span>
                                )}
                                </div>
                            </div>
                        </div>                           
                    </div>    
                </DrawerTrigger>
                <DrawerContent className="max-w-xl">
                    <DrawerHeader>
                        <DrawerTitle>Request for Approval</DrawerTitle>
                    </DrawerHeader>
                    <RequestApproval />
                </DrawerContent>
            </Drawer>
        );

    function RequestApproval()
    {
        return(
            <div className='p-4'>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">                      
                        <div>
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Request By
                                        </>
                                    }
                                />
                                {getName(vehicle_usage.user_uuid)}
                            </div>
                                               
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Request Date Time
                                        </>
                                    }
                                />
                                {formatDateTime(vehicle_usage.created_at)}
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Vehicle
                                        </>
                                    }
                                />
                                <p>{getVehiclePlateNumber (vehicle_usage.vehicle_uuid)}</p>
                                <p>({getVehicleManufacturer (vehicle_usage.vehicle_uuid)} {getVehicleModel (vehicle_usage.vehicle_uuid)})</p>
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Destination
                                        </>
                                    }
                                />
                                {vehicle_usage.destination}
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Purpose
                                        </>
                                    }
                                />
                                {vehicle_usage.purpose}
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Usage Date
                                        </>
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-3">  
                                <div className='m-4 p-4 flex-row md:flex-col justify-items-center border border-gray-300 rounded-lg'>
                                    <div className='text-xl font-bold'>
                                        {formatDay(vehicle_usage.start_date)}
                                    </div>
                                    <div>
                                        {formatMonth(vehicle_usage.start_date)}
                                    </div>
                                </div>
                                {vehicle_usage.end_date !== vehicle_usage.start_date && (
                                    <div className='mt-9 justify-items-center'>
                                        <div className='block'>
                                            <ArrowRight />
                                        </div>
                                    </div>
                                )}
                                {vehicle_usage.end_date !== vehicle_usage.start_date && (    
                                    <div className='m-4 p-4 flex-row md:flex-col justify-items-center border border-gray-300 rounded-lg'>
                                        <div className='text-xl font-bold'>
                                            {formatDay(vehicle_usage.end_date)}
                                        </div>
                                        <div>
                                            {formatMonth(vehicle_usage.end_date)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Link href={route('vehicle.reject', vehicle_usage.id)}>
                                    <SecondaryButton className='shadow hover:bg-gray-300 hover:shadow-md'>
                                        Reject
                                    </SecondaryButton>
                                </Link>
                                <Link href={route('vehicle.approve', vehicle_usage.id)}>
                                    <PrimaryButton>
                                        Approve
                                    </PrimaryButton>
                                </Link>
                            </div>

                            {/* <div className="mt-6">
                                <DeleteRequestVehicle vehicleId={vehicle_usage.id}/>
                            </div> */}
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
