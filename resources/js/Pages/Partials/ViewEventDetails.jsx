
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
import { MailCheckIcon, Eye } from 'lucide-react'

export default function ViewEventDetails({ event_details, onClick }) {
    const user = usePage().props.auth.user;
    const [openEventDate, setOpenEventDate] = useState(false);
    const [openEventDetails, setOpenEventDetails] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleClick = (e) => {
        e.stopPropagation();
        setOpenEventDetails(true);
        if (onClick) onClick();
    };

    if(isDesktop)
    {
        return (
            <>
                <button className="w-full text-sm hover:bg-gray-50 py-1.5 pr-2 pl-2 gap-2 flex " onClick={handleClick}>
                    View Details
                </button>
                <Dialog open={openEventDetails} onOpenChange={setOpenEventDetails}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Event Details</DialogTitle>
                            <DialogDescription>

                                {/* {event_details.event_name} */}
                            </DialogDescription>
                        </DialogHeader>
                        <EventDetails />
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <>
            <div className="w-full text-sm hover:bg-gray-50 py-1.5 pr-2 pl-2 gap-2 flex " onClick={handleClick}>
                View Details
            </div>
            <Drawer open={openEventDetails} onOpenChange={setOpenEventDetails}>
                <DrawerContent className="mb-4">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Event Details</DrawerTitle>
                    </DrawerHeader>
                    <div className='px-4'>
                        <EventDetails />
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

    function EventDetails()
    {
        return(
            <div className=''>
                <div className=" font-bold">{event_details.event_name}</div>
                <div className=""> Date : {event_details.event_date}</div>
                <div className=""> Location : {event_details.event_venue}</div>
                <div className=""> Entity available to select : {event_details.event_participant_entity_organisation}</div>
                <div>Status : {event_details.is_active === 1 ? <span className="inline-block px-1.5 py-0.5 border border-green-600 bg-green-200 text-green-700 font-semibold rounded-full text-sm"> Active </span> : <span className="inline-block px-1.5 py-0.5 border border-red-600 bg-red-200/50 text-red-600 font-semibold rounded-full text-sm"> Inactive </span>}</div>
            </div>
        )
        
    }
}
