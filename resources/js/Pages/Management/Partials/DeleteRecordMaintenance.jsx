import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';
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


export default function DeleteRecordMaintenance({ maintenance }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, post, processing, reset, errors, clearErrors,
    } = useForm({
        id: maintenance.id,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('maintenance.delete'), {
            id: maintenance.id,
            ondelete: () => {
                reset(
                    'id',
                );
                // Close the dialog
                // console.log('onSuccess', data);
                setIsDialogOpen(false);
            },
        });
    };

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
              'id',
            );
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    Delete
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Delete Maintenance</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                       
                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="ads_link"
                                    value={
                                        <>
                                            Do you want to delete this information?
                                        </>
                                    }
                                />

                            </div>
                        </div>
                        <PrimaryButton disabled={processing}>
                           Delete
                        </PrimaryButton>
                    </div>
                </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
