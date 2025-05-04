'use client';

import Modal from '@/components/Modal';
import SignIn from '@/modules/auth/ui/components/MyForm/SignIn';

function LoginPage() {
  return (
    <Modal>
      <SignIn />
    </Modal>
  );
}

export default LoginPage;
