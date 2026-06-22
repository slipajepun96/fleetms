import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import FileInput from '@/Components/FileInput';
import { useRef, useState } from 'react';
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
import { 
    Drawer, 
    DrawerContent, 
    DrawerHeader, 
    DrawerTitle, 
    DrawerDescription, 
    DrawerFooter, 
    DrawerClose, 
    DrawerTrigger, 
} from "@/components/ui/drawer"

export default function ViewRecordMaintenance({maintenance, title , attachment_address}) {
    // console.log(Object.keys(vehicle));
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    
    const [openMaintenanceDate, setopenMaintenanceDate] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({ 
        id: maintenance.id,
        vehicle_uuid: maintenance.vehicle_uuid || '-',
        maintenance_date: maintenance.maintenance_date || '-',
        workshop_name: maintenance.workshop_name || '-',
        summary: maintenance.summary || '-',
        attachment_address: maintenance.attachment_address || '-',
    });
    // console.log('id'+data.id)

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
                'id',
                'vehicle_uuid',
                'maintenance_date',
                'workshop_name',
                'summary',
                'attachment_address',
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);

        post(route('maintenance.edit'), {
            onSuccess: () => {
                reset(
                    'id',
                    'vehicle_uuid',
                    'maintenance_date',
                    'workshop_name',
                    'summary',
                    'attachment_address',
                )
                setIsDialogOpen(false);
            }
        })
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

    const isImage = maintenance.attachment_address &&
    /\.(jpg|jpeg|png)$/i.test(maintenance.attachment_address);

    console.log(maintenance);

    return (
        <Drawer open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DrawerTrigger asChild>
                <PrimaryButton variant="outline">
                    View 
                </PrimaryButton>
            </DrawerTrigger>
            <DrawerContent className="overflow-hidden">
                    <DrawerHeader className="flex flex-col items-center">
                        <DrawerTitle>View Maintenance</DrawerTitle>
                    </DrawerHeader>
                <div className="w-full max-w-4xl mx-auto">    
                    <div className="p-10 pb-10">
                        <form onSubmit={submit}>
                            {/* <div className="flex flex-col justify-items-center"> */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className=''>
                                    <InputLabel
                                        value={
                                            <>
                                                Date
                                            </>
                                        }
                                    />
                                    {formatDateTime(maintenance.maintenance_date)}
                                </div>

                                <div className=''>
                                    <InputLabel
                                        value={
                                            <>
                                                Workshop
                                            </>
                                        }
                                    />
                                    {maintenance.workshop_name}
                                </div>
                            </div>

                            <div className=''>
                                <InputLabel
                                    value={
                                        <>
                                            Summary
                                        </>
                                    }
                                />
                                {maintenance.summary}
                            </div>
                        
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Invoice
                                        </>
                                    }
                                />
                                <div className="mt-4 w-full h-[400px] overflow-hidden border border-slate-200 rounded">
                                    {maintenance.attachment_address ? (
                                        // isImage ? (
                                        //     <img
                                        //         src={route('maintenance.attachment', maintenance.id)}
                                        //         alt="Maintenance attachment"
                                        //         className="w-full h-full object-contain rounded"
                                        //     />
                                        // ):(
                                        <iframe
                                            src={route('maintenance.attachment', maintenance.id)}
                                            title="Maintenance attachment"
                                            className="w-full h-full rounded"
                                            loading="lazy"
                                        />
                                        // )
                                    ) : (
                                        <p className="text-sm text-slate-500">No attachment available.</p>
                                    )}
                                </div>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
