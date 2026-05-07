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
import { useMediaQuery } from '@custom-react-hooks/use-media-query';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger, } from "@/components/ui/drawer"

export default function StartUse({vehicles, vehicle, vehicle_usages, requests_approved}) {

    
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");
    const totalParts = 2;
    const [currentPart, setCurrentPart] = useState(1);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({
        // id: vehicle.id,
        vehicle_uuid: '',
        current_odometer: '',
        
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
            console.log('not yet');
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

    

    const handleNext = () => {
        if (currentPart < totalParts) {
            setCurrentPart(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const handlePrev = () => {
        if (currentPart > 1) {
            setCurrentPart(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    
    if(isDesktop)
    {
        return (
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                    <div className="grid flex-1 gap-2 my-2">
                        <div className="p-4 h-32 text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                            <div className=''>
                                Start Use                           
                            </div>
                        </div>
                    </div>    
                </DialogTrigger>    
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Start Vehicle Usage</DialogTitle>
                    </DialogHeader>
                    <RequestVehicleForm vehicle_usages={vehicle_usages} vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} currentPart={currentPart} totalParts={totalParts} setCurrentPart={setCurrentPart} requests_approved={requests_approved} />
                </DialogContent>    
            </Dialog>
        );
    }

    return (
        <Drawer open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DrawerTrigger asChild>
                <div className="grid flex-1 gap-2 my-2">
                    <div className="p-4 h-32 text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                        <div className=''>
                            Start Use                           
                        </div>
                    </div>
                </div>    
            </DrawerTrigger>    
            <DrawerContent className="max-w-xl">
                <DrawerHeader>
                    <DrawerTitle>Start Vehicle Usage</DrawerTitle>
                </DrawerHeader>
                <RequestVehicleForm vehicle_usages={vehicle_usages} vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} currentPart={currentPart} totalParts={totalParts} setCurrentPart={setCurrentPart} />
            </DrawerContent>    
        </Drawer>
    );

}
    function RequestVehicleForm({ vehicles, vehicle_usages, vehicle_usage,  data, setData, errors, submit, currentPart, totalParts, setCurrentPart, requests_approved})
    {
        console.log(requests_approved);
        console.log(vehicles);
        const [openStartDate, setOpenStartDate] = useState(false);
        const [openEndDate, setOpenEndDate] = useState(false);
        const [dropdown, setDropdown] = useState("dropdown");
        const setVehicle = (vehicleId) => (e) => {
            setData('vehicle_uuid', vehicleId);
            
            console.log(data)
            // setData('current_odometer', current_odometer);
            setCurrentPart(prev => prev + 1);
        };
        const getVehiclePlateNumber = (vehicle_uuid) => {
        const vehicle = vehicles?.find(v => v.id === vehicle_uuid);
        console.log(vehicle_uuid);
        return vehicle ? vehicle.plateNum : 'Unknown Vehicle';
        }

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
    
        return (
            <div className='p-4'>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                        {currentPart === 1 && (
                        <div>
                            <div className="grid flex-1 gap-2 md:grid-flex-2 my-2">
                                {requests_approved.map((request_approved) => (
                                <div key={request_approved.id} onClick={setVehicle(request_approved.vehicle_uuid)}>
                                    <div className="text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                                        <div className="grid md:grid-cols-2">
                                            <div className='m-4 p-4 flex-row md:flex-col justify-items-center border border-gray-300 rounded-lg'>
                                                <div className='text-xl font-bold'>
                                                    {formatDay(request_approved.start_date)}
                                                </div>
                                                <div>
                                                    {formatMonth(request_approved.start_date)}
                                                </div>
                                            </div>         
                                            <div className="p-4 text-xl text-gray-900 text-left ">
                                                <div className='mt-2 uppercase font-bold'>
                                                    {getVehiclePlateNumber (request_approved.vehicle_uuid)}                                          
                                                </div>
                                                <div className="mt-2">
                                                    {request_approved.destination}
                                                </div> 
                                            </div>
                                        </div>  
                                    </div>                                                        
                                </div>
                                ))}
                            </div>
                        </div>
                        )}

                        {currentPart === 2 && (
                        <div>
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Current Odometer<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="current_odometer"
                                    name="current_odometer"
                                    value={data.current_odometer}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('current_odometer', e.target.value)
                                    }
                                    required
                                />
                            </div>
                            
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Start date time<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="actual_start_datetime"
                                    name="actual_start_datetime"
                                    value={data.actual_start_datetime}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('actual_start_datetime', e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        )}
                    </div>

                    <div className="mt-2 flex items-center gap-4">
                        {(currentPart === totalParts) && (
                            <PrimaryButton
                                onClick={submit}
                                // disabled={currentPart === totalParts}
                                className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                            >
                                Start
                            </PrimaryButton>
                        )}
                        {/* {(currentPart !== totalParts) && (
                            <PrimaryButton
                                onClick={handleNext}
                                disabled={currentPart === totalParts}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                            >
                                Next
                            </PrimaryButton>
                        )} */}
                        {/* <PrimaryButton disabled={processing}>Save</PrimaryButton> */}
                    </div>
                </form>
            </div>
        );
    }