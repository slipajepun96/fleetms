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
import FuelTransaction from './EditWorker';

export default function AddPassport({mainForeignWorkers, vehicle_usage, vehicle_usages, fwpassports}) {

    
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");
    const totalParts = 2;
    const [currentPart, setCurrentPart] = useState(1);
    const [openPassExpiryDate, setOpenPassExpiryDate] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({
        // fw_main_uuid: mainForeignWorkers.id || '-',
        pass_country: '',
        pass_number: '',
        pass_expiry_date: '',
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
            post(route('fworker.save'), {
                
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

    const dateFormat = (date) => {
        return format(date, 'dd MMM yyyy');
    }

    return (
        <Drawer open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DrawerTrigger asChild>
                <PrimaryButton className="">
                    Detail
                </PrimaryButton>
                {/* <div className="grid flex-1 gap-2 my-2">
                    <div className="p-4 h-32 text-gray-900 border border-gray-300 rounded-lg shadow hover:shadow-lg hover:font-extrabold">
                        <div className=''>
                            End ?                           
                        </div>
                    </div>
                </div>     */}
            </DrawerTrigger>    
            <DrawerContent className="">
                <DrawerHeader>
                    <DrawerTitle> Information Detail</DrawerTitle>
                </DrawerHeader>
                <div className='p-4'>
                    <div>
                        <InputLabel
                            value={
                                <>
                                    Name<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {mainForeignWorkers.fw_name}
                    </div> 
                    <div>
                        <InputLabel
                            value={
                                <>
                                    Date of Birth<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {dateFormat(mainForeignWorkers.fw_dob)}
                    </div> 
                    <div>
                        <InputLabel
                            value={
                                <>
                                    Gender<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {mainForeignWorkers.fw_gender}
                    </div> 
                    <div>
                        <InputLabel
                            value={
                                <>
                                    Country<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {mainForeignWorkers.fw_country}
                    </div> 

                    {/* passport */}
                    <div>
                        <InputLabel
                            value={
                                <>
                                    Passport Number<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {fwpassports.pass_number}
                    </div>
                    <div>
                        <InputLabel
                            value={
                                <>
                                    Passport Expiry Date<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {fwpassports.pass_expiry_date}
                    </div> 

                    <div>
                        <InputLabel
                            value={
                                <>
                                    Permit Number<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {fwpassports.permit_number}
                    </div> 
                    <div>
                        <InputLabel
                            value={
                                <>
                                    Permit Start Date<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {fwpassports.permit_start_date}
                    </div> 
                    <div>
                        <InputLabel
                            value={
                                <>
                                    Permit Expiry Date<span className="text-red-500">*</span>
                                </>
                            }
                        />
                        {fwpassports.permit_expiry_date}
                    </div>     
                </div>
            </DrawerContent>    
        </Drawer>
    );
}