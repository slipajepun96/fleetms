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

export default function EntityEditEntity({entity}) {
    // console.log(Object.keys(vehicle));
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [openInsuranceExpiry, setOpenInsuranceExpiry] = useState(false);
    const [openRoadTaxExpiry, setOpenRoadTaxExpiry] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({ 
        id: entity.id,
        estate_name: entity.estate_name || '-',
        address: entity.address || '-',
        abbroviation: entity.abbroviation || '-',
        entity_type: entity.entity_type || '-',
    });
    // console.log('id'+data.id)

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
                'id',
                'estate_name',
                'address',
                'abbroviation',
                'entity_type',
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);

        post(route('entity.edit'), {
            onSuccess: () => {
                reset(
                    'id',
                    'estate_name',
                    'address',
                    'abbroviation',
                    'entity_type',
                )
                setIsDialogOpen(false);
            }
        })
    };

    // const handleVehicleTypeChange = (vehicleType) => {
    //     setData('vehicle_type', vehicleType);
    // };

    const handleEntityTypeChange = (entityType) => {
        setData('entity_type', entityType);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    Edit 
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit Entity</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={submit}>
                        <div className="items-center space-y-2">
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Estate Name <span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="estate_name"
                                    name="estate_name"
                                    value={data.estate_name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('estate_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.estate_name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Address<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="address"
                                    name="address"
                                    value={data.address}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.address}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Abbreviation<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="abbroviation"
                                    name="abbroviation"
                                    value={data.abbroviation}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('abbroviation', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.abbroviation}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Entity Type<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <RadioGroup
                                    name="entity_type"
                                    value={data.entity_type}
                                    onChange={handleEntityTypeChange}
                                    options={[
                                        { value: 'HQ', label: 'HQ' },
                                        { value: 'LSK', label: 'LSK' },
                                    ]}
                                    columns={2}
                                    required
                                />
                                <InputError
                                    message={errors.entity_type}
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
