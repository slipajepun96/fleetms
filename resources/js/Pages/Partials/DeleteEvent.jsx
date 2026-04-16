
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
import SecondaryButton from '@/Components/SecondaryButton';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MailCheckIcon, Eye } from 'lucide-react'

export default function DeleteEvent({ event_details, onClick }) {
    const user = usePage().props.auth.user;
    const [openEventDate, setOpenEventDate] = useState(false);
    const [openEventDelete, setOpenEventDelete] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const { data, setData, post, processing, errors, reset } = useForm({
        event_id: event_details.id,
    });

    const handleClick = (e) => {
        e.stopPropagation();
        setOpenEventDelete(true);
        if (onClick) onClick();
    };

    const handleDelete = (e) => {
        e.preventDefault();

        // console.log("delete event id: ", data.event_id);

        post(route('event.deleteEvent'), {
            onSuccess: () => {
                setOpenEventDelete(false);
            },
        })
    };



    if(isDesktop)
    {
        return (
            <>
                <button className="w-full text-sm hover:bg-gray-50 py-1.5 pr-2 pl-2 gap-2 flex " onClick={handleClick}>
                    Delete Event
                </button>
                <Dialog open={openEventDelete} onOpenChange={setOpenEventDelete}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete</DialogTitle>
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
                Delete Event
            </div>
            <Drawer open={openEventDelete} onOpenChange={setOpenEventDelete}>
                <DrawerContent className="mb-4">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Delete</DrawerTitle>
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

                <div className=" font-bold">Are you sure want to delete this event?</div>
                <div className=""> {event_details.event_name}</div>
                <div className='mt-2 '>
                    <Button className="mr-2" onClick={handleDelete}>Delete</Button>
                    <Button variant="outline" onClick={() => setOpenEventDelete(false)}>Cancel</Button>
                </div>


            </div>
        )
        
    }
}
