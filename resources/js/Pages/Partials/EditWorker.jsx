import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
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

export default function EditWorker({vehicles, vehicle_usage, vehicle_usages, onAddFuelTransaction}) {

    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [currentPart, setCurrentPart] = useState(1);
    const today = new Date();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({
        // fw_passport_uuid: fw_passport.id || '-',
        permit_number: '',
        permit_start_date: '',
        permit_expiry_date: '',
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
            if (onAddFuelTransaction) {
            onAddFuelTransaction({
                id: Date.now(),
                ...data
            });
        }
    };


    const d = new Date(

    )

    console.log(d.getDate());
    

    // useEffect(() => {
    //     if (shouldSubmit) {
    //         setShouldSubmit(false);
    //         console.log('Submitting data:', data);
            
    //     }
    // }, [shouldSubmit]);

    if(isDesktop)
    {
        return (
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                    <PrimaryButton className="">
                        Edit
                    </PrimaryButton>
                </DialogTrigger>    
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add Permit</DialogTitle>
                    </DialogHeader>
                    <EditWorkerForm vehicle_usages={vehicle_usages} vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} />
                </DialogContent>    
            </Dialog>
        );
    }

    return (
        <Drawer open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DrawerTrigger asChild>
                <SecondaryButton className="w-full">
                    + Add Permit
                </SecondaryButton>
            </DrawerTrigger>    
            <DrawerContent className="max-w-xl">
                <DrawerHeader>
                    <DrawerTitle>Add Permit</DrawerTitle>
                </DrawerHeader>
                <EditWorkerForm vehicle_usages={vehicle_usages} vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} />
            </DrawerContent>    
        </Drawer>
    );

}
    function EditWorkerForm({ vehicles, vehicle_usages, vehicle_usage,  data, setData, errors, submit, currentPart, totalParts, setCurrentPart})
    {
        const [dropdown, setDropdown] = useState("dropdown");
        const [openDOB, setOpenDOB] = useState(false);
        const [openPassExpiryDate, setOpenPassExpiryDate] = useState(false);
        const today = new Date();
        const [openStartDate, setOpenStartDate] = useState(false);
        const [openPermitExpiryDate, setOpenPermitExpiryDate] = useState(false);
        const handleFuelTypeChange = (fuelType) => {
            setData('fuel_type', fuelType);
        };
        const handleGenderChange = (gender) => {
            setData('fw_gender', gender);
        };
    
        return (
            <div className='p-4'>
                <form onSubmit={submit}>
                    <div className="items-center space-y-2">
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
                    </div>

                    <div className="mt-2 flex items-center gap-4">
                        <PrimaryButton
                            onClick={submit}
                            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                        >
                            Save
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        );
    }