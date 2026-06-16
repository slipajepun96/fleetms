import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, router } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
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


export default function UserDisableUser({ user }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [openInsuranceExpiry, setOpenInsuranceExpiry] = useState(false);
    const [openRoadTaxExpiry, setOpenRoadTaxExpiry] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({ 
        id: user.id || '',
        current_is_active: user.is_active || '',
    });

    useEffect(()=>{
        setData({
            id: user.id,
            current_is_active: user.is_active,
        });
    },[user, setData])
    console.log(data);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
            reset(
                'id',
                'current_is_active',
            );
        }                
        console.log('onSuccess', data);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('user.disable'), {
            onSuccess: () => {
                router.reload({only:['user']})
                setIsDialogOpen(false);
            }
        })

    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    {user.is_active === 1 ? ('Active'):('Non-active')}
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Disable User</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={submit}>
                        {user.is_active === 1 ? (
                            <div>
                                <div className="items-center space-y-2">
                                    Do you want to disable {user.name}?
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Disable</PrimaryButton>
                                </div>
                            </div>
                        ):(
                            <div>
                                <div className="items-center space-y-2">
                                    Do you want to enable {user.name}?
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Enable</PrimaryButton>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
