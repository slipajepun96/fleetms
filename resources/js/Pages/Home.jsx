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

    const columns = [
        // { Header: 'Nama', accessor: 'allottee_name' },
        // { Header: 'No. Fail / Geran', accessor: 'lot_file_num' },
        {
            Header: 'Event Name',
            accessor: ['event_name'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-base'>{row.event_name}</div>
                    <div className='text-xs'>{dateFormat(new Date(row.event_date))}</div>
                </div>
                
            ),
        },
        {
            Header: 'Status',
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
        {
            Header: '',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2 gap-1">
                    {/* <AllotteeEdit allottee={row} /> */}
                        {/* <PrimaryButton
                            className="px-2 py-1 text-white"
                        >
                            <TextSearch />
                        </PrimaryButton>
                        <PrimaryButton>
                            <QrCode />
                        </PrimaryButton> */}
                        {/* <ViewEventDetails/> */}

    <ButtonGroup>
        {/* <Button variant="outline">Snooze</Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <ViewEventDetails event_details={row} />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <ViewAttendanceList event_id={row.id} />
              </DropdownMenuItem>
              <DropdownMenuItem>
                View Attendance Record
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <ViewQRLinkShare event_details={row} />
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListFilterIcon />
                Add to List
              </DropdownMenuItem> */}
              {/* <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <TagIcon />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                  >
                    <DropdownMenuRadioItem value="personal">
                      Personal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="work">
                      Work
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="other">
                      Other
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <DeleteEvent event_details={row} />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
                </div>
            ),
        },
    ];


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


                    {showForm ? (
                        <div className='mt-4'>
                            <CreateNewEventForm onSubmitSuccess={handleFormSubmitSuccess}/>
                        </div>
                    ) : (
                        <DataTable columns={columns} data={events} className='mt-4'/>
                    )} 
                </div>
            </div>
        </AuthenticatedLayout>
    );

    

}
