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

export default function EndUse({vehicles, vehicle_usage, vehicle_usages}) {

    
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
        vehicle_usage_uuid: vehicle_usage.id || '-',
        start_odometer: vehicle_usage.start_odometer||'0',
        end_odometer: vehicle_usage.start_odometer|| '0',
        actual_start_datetime:'',
        notes_on_return: '',
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
            reset();
        }
        
    };
    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);
        // if(currentPart !== totalParts){
        //     console.log('not yet');
        //     return;
        // }
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
            post(route('vehicle.endUse'), {
                
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

    const date = new Date().toLocaleString('en-My');

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
                    <PrimaryButton className="">
                        End Usage 
                    </PrimaryButton>
                    {/* <div className="grid flex-1 gap-2 my-2">
                        <div className="p-4 h-32 text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                            <div className=''>
                                End ?                           
                            </div>
                        </div>
                    </div>     */}
                </DialogTrigger>    
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Start Vehicle Usage</DialogTitle>
                    </DialogHeader>
                    <EndUseForm vehicle_usages={vehicle_usages} vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} />
                </DialogContent>    
            </Dialog>
        );
    }

    return (
        <Drawer open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DrawerTrigger asChild>
                <PrimaryButton className="w-full">
                    End Usage
                </PrimaryButton>
                {/* <div className="grid flex-1 gap-2 my-2">
                    <div className="p-4 h-32 text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                        <div className=''>
                            End ?                           
                        </div>
                    </div>
                </div>     */}
            </DrawerTrigger>    
            <DrawerContent className="max-w-xl">
                <DrawerHeader>
                    <DrawerTitle>Start Vehicle Usage</DrawerTitle>
                </DrawerHeader>
                <EndUseForm vehicle_usages={vehicle_usages} vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} />
            </DrawerContent>    
        </Drawer>
    );

}
    function EndUseForm({ vehicles, vehicle_usages, vehicle_usage,  data, setData, errors, submit, currentPart, totalParts, setCurrentPart})
    {
        
        console.log(vehicles);
        const [openStartDate, setOpenStartDate] = useState(false);
        const [openEndDate, setOpenEndDate] = useState(false);
        const [dropdown, setDropdown] = useState("dropdown");
        
        const getDistanceTraveled = () =>{
            return data.end_odometer-data.start_odometer;
        }

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

        // const []
    
        return (
            <div className='p-4'>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                        <div>
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            End Odometer<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="end_odometer"
                                    name="end_odometer"
                                    value={data.end_odometer}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('end_odometer', e.target.value)
                                    }
                                    required
                                />
                                {getDistanceTraveled()} KM traveled
                            </div>
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Remark(s)
                                        </>
                                    }
                                />
                                <TextArea
                                    id="notes_on_return"
                                    name="notes_on_return"
                                    value={data.notes_on_return}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    placeholder="If any"
                                    onChange={(e) =>
                                        setData('notes_on_return', e.target.value)
                                    }
                                    required
                                />
                                
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-4">
                            <PrimaryButton
                                onClick={submit}
                                // disabled={currentPart === totalParts}
                                className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                            >
                                End Usage
                            </PrimaryButton>
                    </div>
                </form>
            </div>
        );
    }