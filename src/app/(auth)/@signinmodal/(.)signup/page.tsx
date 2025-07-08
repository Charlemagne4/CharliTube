'use client';

import Modal from '@/components/Modal';
import SignUp from '@/modules/auth/ui/components/MyForm/SignUp';

function LoginPage() {
  return (
    <Modal>
      <SignUp />
    </Modal>
  );
}

export default LoginPage;
