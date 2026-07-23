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

export default function RequestVehicle({vehicles}) {
    
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
        console.log('test');
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
                        <div className="p-4 h-32 text-gray-900 border border-gray-300 bg-gradient-to-bl from-yellow-200 to-yellow-400 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                            <div className=''>
                                Request Vehicle                            
                            </div>
                        </div>
                    </div>    
                </DialogTrigger>    
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Request Vehicle</DialogTitle>
                    </DialogHeader>
                    <RequestVehicleForm vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} currentPart={currentPart} totalParts={totalParts} setCurrentPart={setCurrentPart} />
                </DialogContent>    
            </Dialog>
        );
    }

    return (
        <Drawer open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DrawerTrigger asChild>
                <div className="grid flex-1 gap-2 my-2">
                    <div className="p-4 h-32 text-gray-900 border border-gray-300 bg-gradient-to-bl from-yellow-200 to-yellow-400 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                        <div className=''>
                            Request Vehicle                            
                        </div>
                    </div>
                </div>    
            </DrawerTrigger>    
            <DrawerContent className="max-w-xl">
                <DrawerHeader>
                    <DrawerTitle>Request Vehicle</DrawerTitle>
                </DrawerHeader>
                <RequestVehicleForm vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} currentPart={currentPart} totalParts={totalParts} setCurrentPart={setCurrentPart} />
            </DrawerContent>    
        </Drawer>
    );

}
    function RequestVehicleForm({ vehicles, data, setData, errors, submit, currentPart, totalParts, setCurrentPart})
    {
        const [openStartDate, setOpenStartDate] = useState(false);
        const [openEndDate, setOpenEndDate] = useState(false);
        const [dropdown, setDropdown] = useState("dropdown");
        const setVehicle = (vehicleId) => (e) => {
        setData('vehicle_uuid', vehicleId);
        console.log(data)
        setCurrentPart(prev => prev + 1);
        };
    
        return (
            <div className='p-4'>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                        {currentPart === 1 && (
                        <div>
                            <InputLabel
                                value={
                                    <>
                                        Select vehicle <span className="text-red-500">*</span>
                                    </>
                                }
                            />
                            <div className="grid flex-1 gap-2 md:grid-cols-2 my-2">
                                {vehicles.map((vehicle) => (
                                <div key={vehicle.id} onClick={setVehicle(vehicle.id)}>         
                                    <div className="p-4 text-gray-900 border border-gray-300 rounded-lg shadow">
                                        <div className='uppercase font-bold'>
                                        {vehicle.plateNum}                                          
                                        </div>
                                        <div className="">{vehicle.vehicle_model}</div> 
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
                                            Selected car<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                {vehicles.map((vehicle) => (
                                    vehicle.id === data.vehicle_uuid && (
                                    <div key={vehicle.id}>         
                                        <div className="p-2 text-gray-900 border border-gray-300 rounded-lg shadow">
                                            <div className='text-sm font-bold'>
                                            {vehicle.plateNum}                                          
                                            </div>
                                            <div className="">{vehicle.vehicle_model}</div> 
                                        </div>                                                          
                                    </div>
                                )))}
                                <InputError
                                    message={errors.vehicle_uuid}
                                    className="mt-2"
                                />
                            </div>
                            
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Destination<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="destination"
                                    name="destination"
                                    value={data.destination}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('destination', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.destination}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Purpose<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextArea
                                    id="purpose"
                                    name="purpose"
                                    value={data.purpose}
                                    className="mt-1 block w-full"                                   
                                    onChange={(e) =>
                                        setData('purpose', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.purpose}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-2">
                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                Start date<span className="text-red-500">*</span>
                                            </>
                                        }
                                    />
                                    <Popover open={openStartDate} onOpenChange={setOpenStartDate} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.start_date && "text-muted-foreground"
                                            )}
                                        >
                                            { data.start_date ? format(data.start_date, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.start_date ? new Date(data.start_date) : undefined}
                                        onSelect={selectedDate => {
                                                setData('start_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setOpenStartDate(false);
                                            }}
                                        captionLayout={dropdown}
                                        fromYear={1900}
                                        toYear={2100}
                                        className="rounded-lg border shadow-sm"
                                    />
                                    </PopoverContent>
                                </Popover>
                                </div>

                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                End date<span className="text-red-500">*</span>
                                            </>
                                        }
                                    />
                                    <Popover open={openEndDate} onOpenChange={setOpenEndDate} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.end_date && "text-muted-foreground"
                                            )}
                                        >
                                            { data.end_date ? format(data.end_date, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.end_date ? new Date(data.end_date) : undefined}
                                        onSelect={selectedDate => {
                                                setData('end_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setOpenEndDate(false);
                                            }}
                                        captionLayout={dropdown}
                                        fromYear={1900}
                                        toYear={2100}
                                        className="rounded-lg border shadow-sm"
                                    />
                                    </PopoverContent>
                                </Popover>
                                </div>
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
                                Submit
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