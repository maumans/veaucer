import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        login: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="prenom" value="Prénom" />

                    <TextInput
                        id="prenom"
                        name="prenom"
                        value={data.prenom}
                        className="mt-1 block w-full"
                        autoComplete="prenom"
                        isFocused={true}
                        onChange={(e) => setData('prenom', e.target.value)}
                        required
                    />

                    <InputError message={errors.prenom} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="nom" value="Nom" />

                    <TextInput
                        id="nom"
                        name="nom"
                        value={data.nom}
                        className="mt-1 block w-full"
                        autoComplete="nom"
                        onChange={(e) => setData('nom', e.target.value)}
                        required
                    />

                    <InputError message={errors.nom} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="login" value="Login" />

                    <TextInput
                        id="login"
                        type="text"
                        name="login"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="login"
                        onChange={(e) => setData('login', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Déja enregistré?
                    </Link>

                    <PrimaryButton className="ml-4" disabled={processing}>
                        Enregistrer
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
