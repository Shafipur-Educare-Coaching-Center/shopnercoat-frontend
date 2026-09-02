'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/schemas/auth.schema';
import { loginAction } from '@/features/auth/actions/loginAction';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { MedicalLogo } from '@/components/common/MedicalLogo';
import { catchAsyncClient } from '@/lib/client/catchAsync';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = catchAsyncClient(async (data: LoginFormValues) => {
    setLoading(true);
    const { role } = await loginAction(data);
    if (role === 'ADMIN') router.push(ROUTES.ADMIN_DASHBOARD);
    else router.push(ROUTES.STUDENT_DASHBOARD);
  });

  return (
    <div className="flex flex-col gap-6 items-center">
      <MedicalLogo className="mb-2 scale-125" />
      <div className="text-center">
        <h1 className="text-2xl font-bold font-heading text-primary">Welcome Back</h1>
        <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(handleSubmit((data) => data)()); }} className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identifier">Mobile, Email or Roll Number</Label>
          <Input id="identifier" {...register('identifier')} />
          {errors.identifier && <p className="text-xs text-destructive">{errors.identifier.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
