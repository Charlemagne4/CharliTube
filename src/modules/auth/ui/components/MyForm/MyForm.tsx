
import { Button } from '@/components/ui/button';
import MyFormField from './MyFormField';
import { UseFormReturn } from 'react-hook-form';

interface MyFormProps<T extends { email: string; password: string; name?: string }> {
  form: UseFormReturn<T, unknown, T>;
  onSubmit: (values: T) => void;
}
function MyForm<T extends { email: string; password: string; name?: string }>({
  form,
  onSubmit
}: MyFormProps<T>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {'name' in form.getValues() && <MyFormField form={form} name="name" placeholder="Name" />}
      <MyFormField form={form} name="email" placeholder="Email" />
      <MyFormField form={form} name="password" placeholder="Password" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
export default MyForm;
