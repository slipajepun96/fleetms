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

export default function FuelTransaction({vehicles, vehicle_usage, vehicle_usages, onAddFuelTransaction}) {

    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [currentPart, setCurrentPart] = useState(1);
    const today = new Date();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({
        // id: vehicle.id,
        // start_odometer: vehicle_usage.start_odometer||'0',
        // end_odometer: vehicle_usage.start_odometer|| '0',
        vehicle_usage_uuid: vehicle_usage.id || '-',
        fuel_type:'',
        fuel_total_price: '',
        fuel_liter: '',
        transaction_date: today,
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
        post(route('vehicle.saveFuelTransaction'), {
                
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
                    <SecondaryButton className="">
                        + Fuel Transaction
                    </SecondaryButton>
                </DialogTrigger>    
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Fuel Transaction</DialogTitle>
                    </DialogHeader>
                    <FuelTransactionForm vehicle_usages={vehicle_usages} vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} />
                </DialogContent>    
            </Dialog>
        );
    }

    return (
        <Drawer open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DrawerTrigger asChild>
                <SecondaryButton className="w-full">
                    + Fuel Transaction
                </SecondaryButton>
            </DrawerTrigger>    
            <DrawerContent className="max-w-xl">
                <DrawerHeader>
                    <DrawerTitle>Fuel Transaction</DrawerTitle>
                </DrawerHeader>
                <FuelTransactionForm vehicle_usages={vehicle_usages} vehicles={vehicles} data={data} setData={setData} errors={errors} submit={submit} />
            </DrawerContent>    
        </Drawer>
    );

}
    function FuelTransactionForm({ vehicles, vehicle_usages, vehicle_usage,  data, setData, errors, submit, currentPart, totalParts, setCurrentPart})
    {
        const [dropdown, setDropdown] = useState("dropdown");
        const [openTransactionDate, setopenTransactionDate] = useState(false);
        const today = new Date();
        const handleFuelTypeChange = (fuelType) => {
        setData('fuel_type', fuelType);
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
                                            Type of Fuel<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <RadioGroup
                                    name="fuel_type"
                                    value={data.fuel_type}
                                    onChange={handleFuelTypeChange}
                                    options={[
                                        { value: 'Petrol', label: 'Petrol' },
                                        { value: 'Diesel', label: 'Diesel' },
                                    ]}
                                    columns={2}
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Total price of fuel<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="fuel_total_price"
                                    name="fuel_total_price"
                                    value={data.fuel_total_price}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('fuel_total_price', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.fuel_total_price}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Fuel Liter<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="fuel_liter"
                                    name="fuel_liter"
                                    value={data.fuel_liter}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('fuel_liter', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.fuel_liter}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Transaction Date<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <Popover open={openTransactionDate} onOpenChange={setopenTransactionDate} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.transaction_date && "text-muted-foreground"
                                            )}
                                        >
                                            { data.transaction_date ? format(data.transaction_date, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.transaction_date ? new Date(data.transaction_date) : today}
                                        onSelect={selectedDate => {
                                                setData('transaction_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setopenTransactionDate(false);
                                            }}
                                        required
                                        captionLayout={dropdown}
                                        fromYear={1900}
                                        toYear={2100}
                                        className="rounded-lg border shadow-sm"
                                    />
                                    </PopoverContent>
                                </Popover>
                                <InputError
                                    message={errors.transaction_date}
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