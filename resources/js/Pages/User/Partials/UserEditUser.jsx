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

export default function UserEditUser({user}) {
    // console.log(Object.keys(vehicle));
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [openInsuranceExpiry, setOpenInsuranceExpiry] = useState(false);
    const [openRoadTaxExpiry, setOpenRoadTaxExpiry] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({ 
        id: user.id,
        name: user.name || '-',
        actual_name: user.actual_name || '-',
        email: user.email || '-',
        entity: user.entity || '-',
        designation: user.designation || '-',
    });
    // console.log('id'+data.id)

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
                'id',
                'name',
                'actual_name',
                'email',
                'entity',
                'designation',
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);

        post(route('user.edit'), {
            onSuccess: () => {
                reset(
                    'id',
                    'name',
                    'actual_name',
                    'email',
                    'entity',
                    'designation',
                )
                setIsDialogOpen(false);
            }
        })
    };

    const handleEntityChange = (entity) => {
        setData('entity', entity);
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
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={submit}>
                        <div className="items-center space-y-2">
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Name <span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    readOnly
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Actual Name<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="actual_name"
                                    name="actual_name"
                                    value={data.actual_name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('actual_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.actual_name}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Email<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    readOnly
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Entity<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <RadioGroup
                                    name="entity"
                                    value={data.entity}
                                    onChange={handleEntityChange}
                                    options={[
                                        { value: 'PSV', label: 'PSV' },
                                        { value: 'HQ', label: 'HQ' },
                                        { value: 'LSK', label: 'LSK' },
                                        { value: 'LPH', label: 'LPH' },
                                        { value: 'LSJ', label: 'LSJ' },
                                    ]}
                                    columns={5}
                                    required
                                />
                                <InputError
                                    message={errors.entity}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Designation<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="designation"
                                    name="designation"
                                    value={data.designation}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('designation', e.target.value)
                                    }
                                    
                                />
                                <InputError
                                    message={errors.designation}
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
