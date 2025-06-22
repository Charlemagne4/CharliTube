import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '../../../../../prisma/prisma';
import { authOptions } from '@/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) return redirect('/signin');

  const existingUser = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!existingUser) return redirect('/signin');

  return redirect(`/users/${existingUser.id}`);
}
