import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import FileInput from '@/Components/FileInput';
import { useEffect, useRef, useState } from 'react';
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

export default function RecordMaintenance({ vehicleUuid }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [openMaintenanceDate, setopenMaintenanceDate] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({
        vehicle_uuid: vehicleUuid || '',
        maintenance_date: '',
        workshop_name: '',
        summary: '',
        attachment_address: '',
    });

    useEffect(() => {
        if (vehicleUuid) {
            setData('vehicle_uuid', vehicleUuid);
        }
    }, [vehicleUuid]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
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

        post(route('maintenance.save'), {
            onSuccess: () => {
                reset(
                    'maintenance_date',
                    'workshop_name',
                    'summary',
                    'attachment_address',
                )
                setIsDialogOpen(false);
            }
        })
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    + New Record
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add Maintenance Record</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={submit}>
                        <input type="hidden" name="vehicle_uuid" value={data.vehicle_uuid} />
                        <div className="items-center space-y-2">
                           <div>
                                <InputLabel
                                    value={
                                        <>
                                            Date<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <Popover open={openMaintenanceDate} onOpenChange={setopenMaintenanceDate} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.maintenance_date && "text-muted-foreground"
                                            )}
                                        >
                                            { data.maintenance_date ? format(data.maintenance_date, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.maintenance_date ? new Date(data.maintenance_date) : undefined}
                                        onSelect={selectedDate => {
                                                setData('maintenance_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setopenMaintenanceDate(false);
                                            }}
                                        captionLayout={dropdown}
                                        fromYear={1900}
                                        toYear={2100}
                                        className="rounded-lg border shadow-sm"
                                    />
                                    </PopoverContent>
                                </Popover>
                                <InputError
                                    message={errors.maintenance_date}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Workshop<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="workshop_name"
                                    name="workshop_name"
                                    value={data.workshop_name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('workshop_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.workshop_name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Summary<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextArea
                                    id="summary"
                                    name="summary"
                                    value={data.summary}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    autoComplete={false}
                                    onChange={(e) =>
                                        setData('summary', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.summary}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Invoice<span className="text-red-500">*</span>
                                        </>
                                    }
                                    />
                                <FileInput
                                    id="attachment_address"
                                    name="attachment_address"
                                    accept=".pdf"
                                    maxSize={2}
                                    showPreview={true}
                                    onChange={(e) =>
                                        setData('attachment_address', e.target.files[0])
                                }
                                />
                                <InputError
                                    message={errors.attachment_address}
                                    className="mt-2"
                                    />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4">
                            <PrimaryButton disabled={processing}>Save</PrimaryButton>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
