import SubscriptionsSection from '../sections/SubscriptionsSection';

function SubscriptionsView() {
  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground text-xs">Videos form your favorite creators</p>
      </div>
      <SubscriptionsSection />
    </div>
  );
}
export default SubscriptionsView;
