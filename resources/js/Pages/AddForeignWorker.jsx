import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
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
import AddPassport from './Partials/AddPassport';
import AddPermit from './Partials/EditWorker';

export default function AddForeignWorker({main}) {
    
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");
    // const totalParts = 2;
    const [currentPart, setCurrentPart] = useState(1);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({
        fw_name: '',
        fw_dob: '',
        fw_country: '',
        fw_gender: '',

        pass_country: '',
        pass_number: '',
        pass_expiry_date: '',
        pass_attachment: '',
        
        permit_number: '',
        permit_start_date: '',
        permit_expiry_date: '',
        permit_attachment: '',
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
        
        // setData(prev => ({
        //     ...prev,
        // }));
        setIsDialogOpen(false);
        setShouldSubmit(true);
    };

    useEffect(() => {
        // console.log('test');
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

    const [openDOB, setOpenDOB] = useState(false);
    const [openPassExpiryDate, setOpenPassExpiryDate] = useState(false);
    const [openPermitExpiryDate, setOpenPermitExpiryDate] = useState(false);
    const setVehicle = (vehicleId) => (e) => {
    setData('vehicle_uuid', vehicleId);
    console.log(data)
    setCurrentPart(prev => prev + 1);
    };

    const handleGenderChange = (gender) => {
    setData('fw_gender', gender);
    };

    return (
        <AuthenticatedLayout>
            <div className='m-6 p-10'>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                        {/* {currentPart === 1 && ( */}
                        <div className='font-bold text-xl'>
                            Add Foreign Worker
                        </div> 
                        <div>
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Name<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="fw_name"
                                    name="fw_name"
                                    value={data.fw_name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('fw_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.fw_name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Date of Birth<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <Popover open={openDOB} onOpenChange={setOpenDOB} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.fw_dob && "text-muted-foreground"
                                            )}
                                        >
                                            { data.fw_dob ? format(data.fw_dob, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.fw_dob ? new Date(data.fw_dob) : undefined}
                                        onSelect={selectedDate => {
                                                setData('fw_dob', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setOpenDOB(false);
                                            }}
                                        captionLayout={dropdown}
                                        fromYear={1900}
                                        toYear={2100}
                                        className="rounded-lg border shadow-sm"
                                    />
                                    </PopoverContent>
                                </Popover>
                                <InputError
                                    message={errors.fw_dob}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Country<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="fw_country"
                                    name="fw_country"
                                    value={data.fw_country}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('fw_country', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.fw_country}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Gender<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <RadioGroup
                                    name="fw_gender"
                                    value={data.fw_gender}
                                    onChange={handleGenderChange}
                                    options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                    ]}
                                    columns={2}
                                    required
                                />
                                <InputError
                                    message={errors.fw_gender}
                                    className="mt-2"
                                />
                            </div>
                            
                            <div className='mt-2 font-bold'>
                                Passport Information
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Country<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="pass_country"
                                    name="pass_country"
                                    value={data.pass_country}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('pass_country', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.pass_country}
                                    className="mt-2"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-2">
                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                Passport Number<span className="text-red-500">*</span>
                                            </>
                                        }
                                    />
                                    <TextInput
                                        id="pass_number"
                                        name="pass_number"
                                        value={data.pass_number}
                                        className="mt-1 block w-full"                                   
                                        onChange={(e) =>
                                            setData('pass_number', e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.pass_number}
                                        className="mt-2"
                                    />
                                </div>
                            
                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                Expiry Date<span className="text-red-500">*</span>
                                            </>
                                        }
                                    />
                                    <Popover open={openPassExpiryDate} onOpenChange={setOpenPassExpiryDate} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.pass_expiry_date && "text-muted-foreground"
                                            )}
                                        >
                                            { data.pass_expiry_date ? format(data.pass_expiry_date, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.pass_expiry_date ? new Date(data.pass_expiry_date) : undefined}
                                        onSelect={selectedDate => {
                                                setData('pass_expiry_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setOpenPassExpiryDate(false);
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

                            <div>
                                <InputLabel
                                    value={
                                    <>
                                    Attach Passport <span className="text-red-500">*</span>
                                    </>
                                    }
                                />
                                <FileInput
                                    id="pass_attachment"
                                    name="pass_attachment"
                                    accept=".pdf"
                                    maxSize={2}
                                    showPreview={true}
                                    onChange={(e) =>
                                        setData('pass_attachment', e.target.files[0])
                                }
                                />
                                <InputError
                                    message={errors.pass_attachment}
                                    className="mt-2"
                                />
                            </div>

                            <div className='mt-2 font-bold'>
                                Permit Information
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Permit Number<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="permit_number"
                                    name="permit_number"
                                    value={data.permit_number}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('permit_number', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.permit_number}
                                    className="mt-2"
                                />
                            </div> 
                            
                            <div className="grid md:grid-cols-2 gap-2">
                                <div>
                                    <InputLabel
                                        value={
                                            <>
                                                Start Date<span className="text-red-500">*</span>
                                            </>
                                        }
                                    />
                                    <Popover open={openStartDate} onOpenChange={setOpenStartDate} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.permit_start_date && "text-muted-foreground"
                                            )}
                                        >
                                            { data.permit_start_date ? format(data.permit_start_date, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.permit_start_date ? new Date(data.permit_start_date) : undefined}
                                        onSelect={selectedDate => {
                                                setData('permit_start_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
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
                                                Expiry Date<span className="text-red-500">*</span>
                                            </>
                                        }
                                    />
                                    <Popover open={openPermitExpiryDate} onOpenChange={setOpenPermitExpiryDate} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.permit_expiry_date && "text-muted-foreground"
                                            )}
                                        >
                                            { data.permit_expiry_date ? format(data.permit_expiry_date, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.permit_expiry_date ? new Date(data.permit_expiry_date) : undefined}
                                        onSelect={selectedDate => {
                                                setData('permit_expiry_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setOpenPermitExpiryDate(false);
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
                            <div>
                                <InputLabel
                                    value={
                                    <>
                                    Attach Permit <span className="text-red-500">*</span>
                                    </>
                                    }
                                />
                                <FileInput
                                    id="permit_attachment"
                                    name="permit_attachment"
                                    accept=".pdf"
                                    maxSize={2}
                                    showPreview={true}
                                    onChange={(e) =>
                                        setData('permit_attachment', e.target.files[0])
                                }
                                />
                                <InputError
                                    message={errors.permit_attachment}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        {/* )} */}
                    </div>

                    <div className="flex md:flex gap-2 mt-2">                          
                        <PrimaryButton
                                onClick={submit}
                                // disabled={currentPart === totalParts}
                                className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                            >
                                Submit
                        </PrimaryButton>
                    </div>

                    {/* <div className="mt-2 flex items-center gap-4">
                            {(currentPart === totalParts) && ( 
                            
                        )}
                        {(currentPart !== totalParts) && (
                            <PrimaryButton
                                onClick={handleNext}
                                disabled={currentPart === totalParts}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                            >
                                Next
                            </PrimaryButton>
                        )}
                        <PrimaryButton disabled={processing}>Save</PrimaryButton> 
                        <SecondaryButton className='w-1/2 shadow hover:bg-gray-300 hover:shadow-md'>
                                + Fuel Trx
                            </SecondaryButton>
                        <div className='w-1/2 '>
                            <AddPassport />
                        </div>
                        <div className='w-1/2 '>
                            <AddPermit/>
                        </div>
                    </div> */}
                </form>
            </div>
        </AuthenticatedLayout>
    );
}