
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover';
import { Calendar } from '@/Components/ui/calendar';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect, useRef } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useMediaQuery } from '@custom-react-hooks/use-media-query';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger, } from "@/components/ui/drawer"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MailCheckIcon, Eye, Copy, Check } from 'lucide-react'
import QRCode from "react-qr-code";
import DataTable from '@/Components/DataTable';


export default function ViewAttendanceList({ event_attendances }) {
    const user = usePage().props.auth.user;
    const [openEventDate, setOpenEventDate] = useState(false);
    const [openEventDetails, setOpenEventDetails] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleClick = (e) => {
        e.stopPropagation();
        setOpenEventDetails(true);
        if (onClick) onClick();
    };

      const columns = [
        // { Header: 'Nama', accessor: 'allottee_name' },
        // { Header: 'No. Fail / Geran', accessor: 'lot_file_num' },
        {
            Header: 'Name',
            accessor: ['event_name'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-base'>{row.event_name}</div>
                    <div className='text-xs'>{dateFormat(new Date(row.event_date))}</div>
                </div>
                
            ),
        },
        {
            Header: '',
            accessor: ['vendor_type',],
            Cell: ({ row }) => (
                <div className="text-xs">
                    {row.is_active === 1 && (
                        <span className="inline-block px-1.5 py-0.5 border border-green-600 bg-green-200 text-green-700 font-semibold rounded-full"> Active </span>
                    )}
                    {row.is_active === 0 && (
                        <span className="inline-block px-1.5 py-0.5 border border-red-600 bg-red-200/50 text-red-600 font-semibold rounded-full"> Inactive </span>
                    )}
                </div>
            ),
        },
        // { Header: 'No. Telefon', accessor: 'vendor_phone' },
    ];

    if(isDesktop)
    {
        return (
            <>
                <button className="w-full text-sm hover:bg-gray-50 py-1.5 pr-2 pl-2 gap-2 flex " onClick={handleClick}>
                    View Attendance
                </button>
                <Dialog open={openEventDetails} onOpenChange={setOpenEventDetails}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Attendance</DialogTitle>
                            {/* <DialogDescription>
                            </DialogDescription> */}
                        </DialogHeader>
                        <AttendanceList />
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <>
            <div className="w-full text-sm hover:bg-gray-50 py-1.5 pr-2 pl-2 gap-2 flex " onClick={handleClick}>
                View Attendance
            </div>
            <Drawer open={openEventDetails} onOpenChange={setOpenEventDetails}>
                <DrawerContent className="mb-4">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Attendance</DrawerTitle>
                    </DrawerHeader>
                    <div className='px-4'>
                        <AttendanceList />
                    </div>
                    
                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );

    function AttendanceList()
    {
        return(
            <div className=''>
                {/* <div className=" font-bold"> Link : https://attend.slipa.dev/e/{event_details.id}</div> */}
                <div>
                    <DataTable columns={columns} data={event_attendances} className='mt-4'/>
                </div>

            </div>
        )
        
    }
}
