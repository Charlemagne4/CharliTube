import SignUp from '@/modules/auth/ui/components/MyForm/SignUp';
import { Suspense } from 'react';

function page() {
  return (
    <div>
      <Suspense>
        <SignUp />
      </Suspense>
    </div>
  );
}
export default page;
