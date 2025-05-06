import { HydrateClient, trpc } from '@/trpc/server';
import PageClient from './client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

async function Home() {
  void trpc.hello.prefetch({ text: 'Moh' });

  return (
    <HydrateClient>
      <Suspense fallback={<p>Fallback...</p>}>
        <ErrorBoundary fallback={<p>The dark Magic did not work properly</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
export default Home;
