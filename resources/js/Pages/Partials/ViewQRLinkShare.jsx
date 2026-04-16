
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


export default function ViewQRLinkShare({ event_details, onClick }) {
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
                    View QR & Link
                </button>
                <Dialog open={openEventDetails} onOpenChange={setOpenEventDetails}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Attendance Form's QR & Link</DialogTitle>
                            {/* <DialogDescription>
                            </DialogDescription> */}
                        </DialogHeader>
                        <QRLink />
                    </DialogContent>
                </Dialog>
            </>
        );
    }

    return (
        <>
            <div className="w-full text-sm hover:bg-gray-50 py-1.5 pr-2 pl-2 gap-2 flex " onClick={handleClick}>
                View QR & Link
            </div>
            <Drawer open={openEventDetails} onOpenChange={setOpenEventDetails}>
                <DrawerContent className="mb-4">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Attendance Form's QR & Link</DrawerTitle>
                    </DrawerHeader>
                    <div className='px-4'>
                        <QRLink />
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

    function QRLink()
    {
        const [copied, setCopied] = useState(false);
        const linkValue = `https://attend.slipa.dev/e/${event_details.id}`;

        const handleCopy = async () => {
            try {
                await navigator.clipboard.writeText(linkValue);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        };

        return(
            <div className=''>
                {/* <div className=" font-bold"> Link : https://attend.slipa.dev/e/{event_details.id}</div> */}
                <div>
                    <div className='mb-3 flex flex-col items-center '>
                        <InputLabel
                            htmlFor="link"
                            value="QR Code"
                        />
                        
                        <QRCode value={linkValue} />
                    </div>
                    <InputLabel
                        htmlFor="link"
                        value="Link"
                    />
                    <div className="relative">
                        <TextInput
                            id="link"
                            name="link"
                            value={linkValue}
                            className="block w-full pr-10"
                            readOnly
                        />
                        <button
                            onClick={handleCopy}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title={copied ? "Copied!" : "Copy to clipboard"}
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                            ) : (
                                <Copy className="h-4 w-4 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

            </div>
        )
        
    }
}
