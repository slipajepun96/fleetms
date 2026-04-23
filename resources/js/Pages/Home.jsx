import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { CirclePlus, ArrowLeft, TextSearch, QrCode, MoreHorizontalIcon, MailCheckIcon, ArchiveIcon, ClockIcon,Trash2Icon, Eye, ListFilterIcon, TagIcon} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/popover';
import { Calendar } from '@/Components/ui/calendar';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import PrimaryButton from '@/Components/PrimaryButton';
import CreateNewEventForm from './Partials/CreateNewEventForm';
import DataTable from '@/Components/DataTable';
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ViewEventDetails from './Partials/ViewEventDetails';
import ViewQRLinkShare from './Partials/ViewQRLinkShare';
import ViewAttendanceList from './Partials/ViewAttendanceList';
import DeleteEvent from './Partials/DeleteEvent';


export default function Home({events}) {
    const [showForm, setShowForm] = useState(false);
    const [openEventDate, setOpenEventDate] = useState(false);
    const [shouldSubmit, setShouldSubmit] = useState(false);

      const { flash } = usePage().props;

    const dateFormat = (date) => {
        return format(date, 'dd MMM yyyy');
    }




    const displayEventForm = (type) => {
        // reset();
        setShowForm(type);
    };

    const handleFormSubmitSuccess = () => {
        setShowForm(false);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Home" />

            <div className="py-6 px-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-gradient-to-bl from-black  to-slate-500 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-white">
                            Make Your Attendance Easy with <b>attend</b>!
                        </div>
                    </div>

                    
                    <div className="mt-4 overflow-hidden ">
                        {!showForm ? (
                            <div className="sm:rounded-lg grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div className='bg-slate-900 text-white rounded-xl p-3 font-bold inline-flex items-center gap-2 hover:bg-slate-700'  onClick={() => displayEventForm(true)}>
                                    <CirclePlus /> Make new event
                                </div>
                            </div>
                        ) : (
                            <div className='flex flex-row items-center gap-4 mb-4'>
                                <PrimaryButton onClick={() => displayEventForm(false)}><ArrowLeft />Back</PrimaryButton><h1 className='font-bold text-2xl'>Create New Event</h1>
                            </div>
                            
                        ) }
                        {/* <div className='bg-slate-900 text-white rounded-xl p-3 font-bold inline-flex items-center gap-2 hover:bg-slate-700'>
                           <CirclePlus /> Make new form
                        </div> */}
                    </div>

                    {flash?.success && (
                        <div className='bg-green-200 p-2 my-2 rounded-lg'>
                            {flash.success}
                        </div>
                    )}



                </div>
            </div>
        </AuthenticatedLayout>
    );

    

}
