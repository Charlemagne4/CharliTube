'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import MyForm from './MyForm';
import { signUpFormSchema as formSchema } from './Schema';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export function SignUp() {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '', // Ensure 'n
      email: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios('/api/register', {
        method: 'POST',
        data: values,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(values);

      if (res.status === 200) {
        router.push('/'); // ✅ redirect after login
      }
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }

    // const error: string = await signUp(values);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Sign Up</h1>
      <div className="w-2/3 rounded p-20">
        <Form {...form}>
          <div className="mb-4 flex gap-20">
            <Button onClick={() => signIn('github', { callbackUrl: '/' })}>
              Sign in with GitHub
            </Button>
            <Button onClick={() => signIn('discord', { callbackUrl: '/' })}>
              Sign in with Discord
            </Button>
          </div>

          <MyForm form={form} onSubmit={onSubmit} />

          {/* <h6 className="bg-red-600 p-2 text-white">{error}</h6> */}
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
