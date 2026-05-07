import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, router } from '@inertiajs/react';
import FileInput from '@/Components/FileInput';
import { useRef, useState, useEffect} from 'react';
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

export default function UserAuthorisedUser({user}) {
    // console.log(Object.keys(vehicle));
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const [openInsuranceExpiry, setOpenInsuranceExpiry] = useState(false);
    const [openRoadTaxExpiry, setOpenRoadTaxExpiry] = useState(false);
    const [dropdown, setDropdown] = useState("dropdown");

    const { data, setData, errors, post,  put, reset, processing, recentlySuccessful,
    } = useForm({ 
        id: user.id || '',
        current_is_authorised: user.is_authorised || '',
    });

    useEffect(()=>{
        setData({
            id: user.id,
            current_is_authorised: user.is_authorised,
        });
    },[user, setData])
    console.log(data);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);
        if (!isOpen) {
            reset(
                'id',
                'current_is_authorised',
            );
        }                
        console.log('onSuccess', data);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('user.authorise'), {
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
                    {user.is_authorised === 0 ? ('Authorise'):('Revoke Authorisation')}
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Authorised User</DialogTitle>
                </DialogHeader>
                <div>
                    <form onSubmit={submit}>
                        {user.is_authorised === 0 ? (
                            <div>
                                <div className="items-center space-y-2">
                                    Do you want to authorised {user.name}?
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Authorise</PrimaryButton>
                                </div>
                            </div>
                        ):(
                            <div>
                                <div className="items-center space-y-2">
                                    Do you want to revoke authorise {user.name}?
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>Revoke Authorisation</PrimaryButton>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
