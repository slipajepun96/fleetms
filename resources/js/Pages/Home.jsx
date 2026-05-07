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
import RequestVehicle from './Partials/RequestVehicle';
import ViewRequestVehicle from './Partials/ViewRequestVehicle';
import RequestApproval from './Partials/RequestApproval';
import StartUse from './Partials/StartUse';

export default function Home({events, vehicles, vehicle, vehicle_usages, approver_status, users, vehicle_requests_pending, requests_approved}) {
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

    const getVehiclePlateNumber = (vehicle_uuid) => {
        const vehicle = vehicles.find(v => v.id === vehicle_uuid);
        return vehicle ? vehicle.plateNum : 'Unknown Vehicle';
    }

    console.log(vehicle_usages);

    return (
        <AuthenticatedLayout>
            <Head title="Home" />

            <div className="py-6 px-2">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* <div className="overflow-hidden bg-gradient-to-bl from-black  to-slate-500 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-white">
                            Make Your Attendance Easy with <b>attend</b>!
                        </div>
                    </div> */}
                    <div className="grid flex-1 gap-2 md:grid-cols-6 my-2">
                        <div>
                            <RequestVehicle vehicles={vehicles}/>
                        </div>
                        <div>
                            <StartUse vehicle_usages={vehicle_usages} vehicles={vehicles} requests_approved={requests_approved} vehicle={vehicle} />
                        </div>
                    </div>

                    {approver_status === 1 && (
                        <div className="p-2 md:p-2 text-gray-900 border-t-2 border-gray-700">
                            <div className='font-bold'>
                                Request for Approval
                            </div>
                            <div>
                                <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                                {vehicle_requests_pending.map((vehicle_request_pending) => (
                                    <RequestApproval vehicle_usage={vehicle_request_pending} vehicles={vehicles} users={users}/>
                                ))}{vehicle_requests_pending.length === 0 && (
                                    <div>Nothing to approve</div>
                                )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="p-2 md:p-2 text-gray-900 border-t-2 border-gray-700">
                        <div className="font-bold">
                            My Request
                        </div>
                        <div className="grid flex-1 gap-2 md:grid-cols-3 my-2">
                            {vehicle_usages.map((vehicle_usage) => (
                                <ViewRequestVehicle vehicle_usage={vehicle_usage} vehicles={vehicles}/>
                            ))}
                        </div>
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
