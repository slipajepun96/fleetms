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

export default function VehicleEditVehicle({vehicle}) {
    // console.log(Object.keys(vehicle));
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [openInsuranceExpiry, setOpenInsuranceExpiry] = useState(false);
    const [openRoadTaxExpiry, setOpenRoadTaxExpiry] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({ 
        id: vehicle.id,
        plateNum: vehicle.plateNum || '-',
        vehicle_manufacturer: vehicle.vehicle_manufacturer || '-',
        vehicle_model: vehicle.vehicle_model || '-',
        insurance_expiry: vehicle.insurance_expiry || '-',
        roadtax_expiry: vehicle.roadtax_expiry || '-',
        vehicle_picture: '',
        vehicle_type: vehicle.vehicle_type || '-',
        designated_person: vehicle.designated_person || '-',
        owner_entity: vehicle.owner_entity || '-',
        current_odometer: vehicle.current_odometer || '-',
    });
    // console.log('id'+data.id)

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
              'id',
              'plateNum',
              'vehicle_manufacturer',
              'vehicle_model',
              'insurance_expiry',
              'roadtax_expiry',
              'vehicle_picture',
              'vehicle_type',
              'designated_person',
              'owner_entity',
              'current_odometer',
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);

        post(route('vehicle.edit'), {
            onSuccess: () => {
                reset(
                    'id',
                    'plateNum',
                    'vehicle_manufacturer',
                    'vehicle_model',
                    'insurance_expiry',
                    'roadtax_expiry',
                    'vehicle_picture',
                    'vehicle_type',
                    'designated_person',
                    'owner_entity',
                    'current_odometer',
                )
                setIsDialogOpen(false);
            }
        })
    };

    const handleVehicleTypeChange = (vehicleType) => {
        setData('vehicle_type', vehicleType);
    };

    const handleOwnerEntityChange = (ownerEntity) => {
        setData('owner_entity', ownerEntity);
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
                    <DialogTitle>Edit Vehicle</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={submit}>
                        <div className="items-center space-y-2">
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Plate Number <span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="plateNum"
                                    name="plateNum"
                                    value={data.plateNum}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('plateNum', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.plateNum}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Vehicle Manufacturer<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="vehicle_manufacturer"
                                    name="vehicle_manufacturer"
                                    value={data.vehicle_manufacturer}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('vehicle_manufacturer', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.vehicle_manufacturer}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Vehicle Model<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="vehicle_model"
                                    name="vehicle_model"
                                    value={data.vehicle_model}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('vehicle_model', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.vehicle_model}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Insurance Expiry Date<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <Popover open={openInsuranceExpiry} onOpenChange={setOpenInsuranceExpiry} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.insurance_expiry && "text-muted-foreground"
                                            )}
                                        >
                                            { data.insurance_expiry ? format(data.insurance_expiry, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.insurance_expiry ? new Date(data.insurance_expiry) : undefined}
                                        onSelect={selectedDate => {
                                                setData('insurance_expiry', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setOpenInsuranceExpiry(false);
                                            }}
                                        captionLayout={dropdown}
                                        fromYear={1900}
                                        toYear={2100}
                                        className="rounded-lg border shadow-sm"
                                    />
                                    </PopoverContent>
                                </Popover>
                                <InputError
                                    message={errors.insurance_expiry}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Road Tax Expiry Date<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <Popover open={openRoadTaxExpiry} onOpenChange={setOpenRoadTaxExpiry} modal={false}>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={cn(
                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                !data.roadtax_expiry && "text-muted-foreground"
                                            )}
                                        >
                                            { data.roadtax_expiry ? format(data.roadtax_expiry, "dd/MM/yyyy") : "Choose Date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                        <Calendar
                                        mode="single"
                                        selected={data.roadtax_expiry ? new Date(data.roadtax_expiry) : undefined}
                                        onSelect={selectedDate => {
                                                setData('roadtax_expiry', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                setOpenRoadTaxExpiry(false);
                                            }}
                                        captionLayout={dropdown}
                                        fromYear={1900}
                                        toYear={2100}
                                        className="rounded-lg border shadow-sm"
                                    />
                                    </PopoverContent>
                                </Popover>
                                <InputError
                                    message={errors.roadtax_expiry}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Vehicle Type<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <RadioGroup
                                    name="vehicle_type"
                                    value={data.vehicle_type}
                                    onChange={handleVehicleTypeChange}
                                    options={[
                                        { value: 'Company', label: 'Company' },
                                        { value: 'Designated', label: 'Designated' },
                                    ]}
                                    columns={2}
                                    required
                                />
                                <InputError
                                    message={errors.vehicle_type}
                                    className="mt-2"
                                />
                            </div>

                            {data.vehicle_type === 'Designated' && (
                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Designated Person<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="designated_person"
                                    name="designated_person"
                                    value={data.designated_person}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('designated_person', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.designated_person}
                                    className="mt-2"
                                />
                            </div>
                            )}

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Owner<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <RadioGroup
                                    name="owner_entity"
                                    value={data.owner_entity}
                                    onChange={handleOwnerEntityChange}
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
                                    message={errors.owner_entity}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    value={
                                        <>
                                            Current Odometer<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="current_odometer"
                                    name="current_odometer"
                                    value={data.current_odometer}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('current_odometer', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.current_odometer}
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
