import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { Transition } from '@headlessui/react';
import { useForm, router } from '@inertiajs/react';
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
import EndUse from './AddPassport';
import FuelTransaction from './EditWorker';

export default function InProgress({vehicle_usage, vehicles, users, vehicle_usages, fuelTransactions}) {
    
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
        actual_start_datetime: '',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
            reset();
            setCurrentPart(1);
        }
        
    };
    const [fuelTransaction, setFuelTransaction] = useState([]);

    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);
        if(currentPart !== totalParts){
            return;
        }
        setData(prev => ({
            ...prev,
            fuelTransaction : fuelTransaction
        }));
        setIsDialogOpen(false);
        setShouldSubmit(true);
    };

    useEffect(() => {
        if (shouldSubmit) {
            setShouldSubmit(false);
            console.log('Submitting data:', data);
            post(route('home'), {
                
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

    const handleAddFuelTransaction =(FuelTransactionData) => {
        setFuelTransaction(prev => [...prev, FuelTransactionData]);
        console.log('Updated fuelTransaction:', fuelTransaction);
    }

    const getVehicleModel = (vehicle_uuid) => {
        const vehicle = vehicles?.find(v => v.id === vehicle_uuid);
        return vehicle ? vehicle.vehicle_model : 'Unknown Vehicle';
    }

    const getVehicleManufacturer = (vehicle_uuid) => {
        const vehicle = vehicles?.find(v => v.id === vehicle_uuid);
        return vehicle ? vehicle.vehicle_manufacturer : 'Unknown Vehicle';
    } 

    // const getFuelTransaction => {

    // }
    // const testing = router.get(route('test'))
    // console.log(testing)
    
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
                                <div className="">{formatDateTime(vehicle_usage.start_date)}{vehicle_usage.end_date !== vehicle_usage.start_date && ` - ${formatDateTime(vehicle_usage.end_date)}`}</div> 
                                <div className="">{vehicle_usage.destination}</div> 
                                <div className='flex'>
                                    {vehicle_usage.application_status === 'progress' && (
                                        <span class='flex items-center bg-blue-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                            <span class="h-1.5 w-1.5 bg-blue-600 rounded-full me-1"></span>
                                            In Progress
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>                           
                    </div>    
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Usage In Progress</DialogTitle>
                    </DialogHeader>
                    <InProgressForm />
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
                                <div className="">{formatDateTime(vehicle_usage.start_date)}{vehicle_usage.end_date !== vehicle_usage.start_date && ` - ${formatDateTime(vehicle_usage.end_date)}`}</div> 
                                <div className="">{vehicle_usage.destination}</div> 
                                <div className='flex'>
                                    {vehicle_usage.application_status === 'progress' && (
                                        <span class='flex items-center bg-blue-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                            <span class="h-1.5 w-1.5 bg-blue-600 rounded-full me-1"></span>
                                            In Progress
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>                           
                    </div>    
                </DrawerTrigger>
                <DrawerContent className="max-w-xl">
                    <DrawerHeader>
                        <DrawerTitle><ArrowRight />Usage In Progress</DrawerTitle>
                    </DrawerHeader>
                    <InProgressForm />
                </DrawerContent>
            </Drawer>
        );

    function InProgressForm()
    {
        console.log(fuelTransactions);
        return(
            <div className='p-4'>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">  
                        <div className='flex'>
                            {vehicle_usage.application_status === 'progress' && (
                                <span class='flex items-center bg-blue-200 border border-danger-subtle text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded'>
                                    <span class="h-1.5 w-1.5 bg-blue-600 rounded-full me-1"></span>
                                    In Progress
                                </span>
                            )}
                        </div> 
                        
                        <div> 
                            <div className='text-xl'>
                                {getVehiclePlateNumber (vehicle_usage.vehicle_uuid)}
                            </div>
                        
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Actual Start date time
                                        </>
                                    }
                                />
                                {formatDateTime(vehicle_usage.actual_start_datetime)}
                            </div>

                            <div  className="mt-2 p-2 md:p-2 text-gray-900 border-t-2 border-gray-700">
                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                Fuel Transaction
                                            </>
                                        }
                                    />
                                </div>

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

                            <div className="flex md:flex gap-2">
                                
                                <div className=''>
                                    <FuelTransaction vehicle_usage={vehicle_usage} vehicles={vehicles} vehicle_usages={vehicle_usages} onAddFuelTransaction={handleAddFuelTransaction}/>
                                </div>
                                    {/* <SecondaryButton className='w-1/2 shadow hover:bg-gray-300 hover:shadow-md'>
                                        + Fuel Trx
                                    </SecondaryButton> */}
                                <div className='w-1/2 '>
                                    <EndUse vehicle_usage={vehicle_usage} vehicles={vehicles} vehicle_usages={vehicle_usages}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
