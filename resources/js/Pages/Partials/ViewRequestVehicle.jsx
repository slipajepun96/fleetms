import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
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

export default function ViewRequestVehicle({vehicle_usage, vehicle_usages, vehicles, fuelTransactions}) {
    
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
        start_odometer: vehicle_usage.start_odometer||'0',
        end_odometer: vehicle_usage.end_odometer|| '0',
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

    const setVehicle = (vehicleId) => (e) => {
        setData('vehicle_uuid', vehicleId);
        setCurrentPart(prev => prev + 1);
    }; 
    
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
                                <div className="text-sm">{formatDateTime(vehicle_usage.start_date)}{vehicle_usage.end_date !== vehicle_usage.start_date && ` - ${formatDateTime(vehicle_usage.end_date)}`}</div> 
                                <div className="text-sm">{vehicle_usage.destination}</div> 
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
                                {vehicle_usage.application_status === 'progress' && (
                                    <span class='flex items-center bg-blue-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-blue-600 rounded-full me-1"></span>
                                        In Progress
                                    </span>
                                )}
                                {vehicle_usage.application_status === 'finished' && (
                                    <span class='flex items-center bg-green-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-green-600 rounded-full me-1"></span>
                                        Finished
                                    </span>
                                )}
                                </div>
                            </div>
                        </div>                           
                    </div>    
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Requested Vehicle</DialogTitle>
                    </DialogHeader>
                    <ViewRequestedVehicle />
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
                                <div className="text-sm">{formatDateTime(vehicle_usage.start_date)}{vehicle_usage.end_date !== vehicle_usage.start_date && ` - ${formatDateTime(vehicle_usage.end_date)}`}</div> 
                                <div className="text-sm">{vehicle_usage.destination}</div> 
                                <div className='flex'>
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
                                    {vehicle_usage.application_status === 'progress' && (
                                        <span class='flex items-center bg-blue-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                            <span class="h-1.5 w-1.5 bg-blue-600 rounded-full me-1"></span>
                                            In Progress
                                        </span>
                                    )}
                                    {vehicle_usage.application_status === 'finished' && (
                                        <span class='flex items-center bg-green-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                            <span class="h-1.5 w-1.5 bg-green-600 rounded-full me-1"></span>
                                            Finished
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>                           
                    </div>    
                </DrawerTrigger>
                <DrawerContent className="max-w-xl">
                    <DrawerHeader>
                        <DrawerTitle>Requested Vehicle</DrawerTitle>
                    </DrawerHeader>
                    <ViewRequestedVehicle />
                </DrawerContent>
            </Drawer>
        );

    function ViewRequestedVehicle()
    {
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
            // const month = String(date.getMonth() + 1).padStart(2, '0');
            return date.toLocaleString('en-My', { month: 'long' });
        };

        const getDistanceTraveled = () =>{
            return data.end_odometer-data.start_odometer;
        }

        return(
            <div className='p-4'>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                        <div className='flex'>
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
                            {vehicle_usage.application_status === 'progress' && (
                                <span class='flex items-center bg-blue-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                    <span class="h-1.5 w-1.5 bg-blue-600 rounded-full me-1"></span>
                                    In Progress
                                </span>
                            )}
                            {vehicle_usage.application_status === 'finished' && (
                                <span class='flex items-center bg-green-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                    <span class="h-1.5 w-1.5 bg-green-600 rounded-full me-1"></span>
                                    Finished
                                </span>
                            )}
                        </div>

                        <div>
                            <InputLabel
                                value={
                                    <>
                                        Selected car
                                    </>
                                }
                            />
                            <div className='text-xl'>
                                {getVehiclePlateNumber (vehicle_usage.vehicle_uuid)}
                            </div>
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

                        {vehicle_usage.application_status !== 'finished' && (
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                Start date
                                            </>
                                        }
                                    />
                                    {formatDateTime(vehicle_usage.start_date)}
                                </div>

                                {vehicle_usage.end_date !== vehicle_usage.start_date && (
                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                End date
                                            </>
                                        }
                                    />
                                    {formatDateTime(vehicle_usage.end_date)}
                                </div>
                                )}
                            </div>
                        )}

                        {(vehicle_usage.application_status === 'pending' || vehicle_usage.application_status === 'approved') && (
                            <div className="mt-6">
                            <DeleteRequestVehicle vehicleId={vehicle_usage.id}/>
                        </div> 
                        )}  
                        

                        {vehicle_usage.application_status === 'progress' && (
                            <div className="grid grid-cols-3">  
                                <div className='p-2 flex-row md:flex-col justify-items-center border border-gray-300 rounded-lg'>
                                    <div className='text-xl font-bold'>
                                        {formatDay(vehicle_usage.actual_start_datetime)}
                                    </div>
                                    <div>
                                        {formatMonth(vehicle_usage.actual_start_datetime)}
                                    </div>
                                    <div>
                                        <InputLabel
                                            value={
                                                <>
                                                    Odometer
                                                </>
                                            }
                                        />
                                        {vehicle_usage.start_odometer}
                                    </div>
                                </div>
                            </div>
                            
                        )}

                        {vehicle_usage.application_status === 'finished' && (
                            <div>
                                {formatDay(vehicle_usage.actual_start_datetime) !== formatDay(vehicle_usage.actual_end_datetime)&& (
                                <div className="grid grid-cols-3 items-center">
                                    <div className='p-2 flex-row md:flex-col justify-items-center border border-gray-300 rounded-lg'>
                                        <div className='text-xl font-bold'>
                                            {formatDay(vehicle_usage.actual_start_datetime)}
                                        </div>
                                        <div>
                                            {formatMonth(vehicle_usage.actual_start_datetime)}
                                        </div>
                                        <div className='flex flex-col items-center'>
                                            <InputLabel
                                                value={
                                                    <>
                                                        Odometer
                                                    </>
                                                }
                                            />
                                            <div>
                                                {vehicle_usage.start_odometer}
                                                {formatDay(vehicle_usage.actual_end_datetime) === formatDay(vehicle_usage.actual_start_datetime) &&(
                                                    <span>-{vehicle_usage.end_odometer}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {formatDay(vehicle_usage.actual_end_datetime) !== formatDay(vehicle_usage.actual_start_datetime) && (
                                    <div className='mt-8 justify-items-center'>
                                        <div className='block'>
                                            <ArrowRight />
                                        </div>
                                    </div>
                                    )}

                                    {formatDay(vehicle_usage.actual_end_datetime) !== formatDay(vehicle_usage.actual_start_datetime) &&(
                                        <div className='p-2 flex-row md:flex-col justify-items-center border border-gray-300 rounded-lg'> 
                                            <div className='text-xl font-bold'>
                                                {formatDay(vehicle_usage.actual_end_datetime)}
                                            </div>
                                            <div>
                                                {formatMonth(vehicle_usage.actual_end_datetime)}
                                            </div>
                                            <div className='flex flex-col items-center'>
                                                <InputLabel
                                                    value={
                                                        <>
                                                            Odometer
                                                        </>
                                                    }
                                                />
                                                <div>
                                                    {vehicle_usage.end_odometer}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                )}

                                {formatDay(vehicle_usage.actual_start_datetime) === formatDay(vehicle_usage.actual_end_datetime)&& (
                                <div className="grid grid-cols-1 items-center">
                                    <div className='p-2 flex-row md:flex-col justify-items-center border border-gray-300 rounded-lg'>
                                        <div className='text-xl font-bold'>
                                            {formatDay(vehicle_usage.actual_start_datetime)}
                                        </div>
                                        <div>
                                            {formatMonth(vehicle_usage.actual_start_datetime)}
                                        </div>
                                        <div className='flex flex-col items-center'>
                                            <InputLabel
                                                value={
                                                    <>
                                                        Odometer
                                                    </>
                                                }
                                            />
                                            <div>
                                                {vehicle_usage.start_odometer}
                                                {formatDay(vehicle_usage.actual_end_datetime) === formatDay(vehicle_usage.actual_start_datetime) &&(
                                                    <span>-{vehicle_usage.end_odometer}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
 
                                    {/*{formatDay(vehicle_usage.actual_end_datetime) !== formatDay(vehicle_usage.actual_start_datetime) && (
                                    <div className='mt-9 justify-items-center'>
                                        <div className='block'>
                                            <ArrowRight />
                                        </div>
                                    </div>
                                    )}

                                    {formatDay(vehicle_usage.actual_end_datetime) !== formatDay(vehicle_usage.actual_start_datetime) &&(
                                        <div className='p-2 flex-row md:flex-col justify-items-center border border-gray-300 rounded-lg'> 
                                            <div className='text-xl font-bold'>
                                                {formatDay(vehicle_usage.actual_end_datetime)}
                                            </div>
                                            <div>
                                                {formatMonth(vehicle_usage.actual_end_datetime)}
                                            </div>
                                            <div>
                                                <InputLabel
                                                    value={
                                                        <>
                                                            Odometer
                                                        </>
                                                    }
                                                />
                                                {vehicle_usage.end_odometer}
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                                )}

                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                            Distance Travelled
                                            </>
                                        }
                                    />
                                    {getDistanceTraveled()} KM
                                </div>

                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                Remarks
                                            </>
                                        }
                                    />
                                    {vehicle_usage.notes_on_return ?? '-'}
                                </div>

                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                Fuel Transaction
                                            </>
                                        }
                                    />
                                    <div className='grid grid-cols-2 gap-2'>
                                    {fuelTransactions.map((fuel_transaction) => ( 
                                        <div key={fuel_transaction.id} >
                                            {fuel_transaction.vehicle_usage_uuid === vehicle_usage.id && (   
                                                <> 
                                            {fuel_transaction.fuel_type === 'Diesel' && (
                                                <div className="p-2 text-gray-900 border border-gray-900 bg-gray-500/20 rounded-lg shadow-md">
                                                    <div className='text-xl'>
                                                        RM{fuel_transaction.fuel_total_price}
                                                    </div>
                                                    <div className=''>
                                                        {formatDateTime(fuel_transaction.transaction_date)}
                                                    </div>
                                                    <div className=''>
                                                        {fuel_transaction.fuel_liter} Liter
                                                    </div>
                                                </div>   
                                            )}
                                            {fuel_transaction.fuel_type === 'Petrol' && (
                                                <div className="p-2 text-gray-900 border border-yellow-300 bg-yellow-500/20 rounded-lg shadow-md">
                                                    <div className='text-xl'>
                                                        RM{fuel_transaction.fuel_total_price}
                                                    </div>
                                                    <div className=''>
                                                        {formatDateTime(fuel_transaction.transaction_date)}
                                                    </div>
                                                    <div className=''>
                                                        {fuel_transaction.fuel_liter} Liter
                                                    </div>
                                                </div>   
                                            )}</>  
                                            )}
                                        </div>
                                    ))}
                                </div>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        )
    }
}
