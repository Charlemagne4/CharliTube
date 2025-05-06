'use client';

import { trpc } from '@/trpc/client';

function PageClient() {
  const [data] = trpc.hello.useSuspenseQuery({ text: 'Moh' });

  return <div>I am Back, Stronger and more thursty for that Attention Span {data.greeting}</div>;
}
export default PageClient;
