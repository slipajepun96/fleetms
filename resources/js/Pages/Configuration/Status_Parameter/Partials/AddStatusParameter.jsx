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
import React from 'react';
import { ChromePicker } from 'react-color';


export default function AddStatusParameter() {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [openInsuranceExpiry, setOpenInsuranceExpiry] = useState(false);
    const [openRoadTaxExpiry, setOpenRoadTaxExpiry] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({
        status_value: '',
        color: '',
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
              'status_value',
              'color',
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);

        post(route('status.save'), {
            onSuccess: () => {
                reset(
                    'status_value',
                    'color',
                )
                setIsDialogOpen(false);
            }
        })
    };

    const [selectedColor, setSelectedColor] = useState('#ffffff');
    // const handleVehicleTypeChange = (vehicleType) => {
    //     setData('vehicle_type', vehicleType);
    // };

    // const handleOwnerEntityChange = (ownerEntity) => {
    //     setData('owner_entity', ownerEntity);
    // };


    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    + status
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add Status</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={submit}>
                        <div className="items-center space-y-2">
                            <ChromePicker 
                                color={selectedColor}
                                onChangeComplete={(color) => {
                                    setSelectedColor(color.hex);
                                    setData('color', color.hex); // Add to your form data
                                }}
                                />
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Status Value<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="status_value"
                                    name="status_value"
                                    value={data.status_value}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    autoComplete={false}
                                    onChange={(e) =>
                                        setData('status_value', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.status_value}
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
