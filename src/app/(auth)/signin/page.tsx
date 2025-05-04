import SignIn from "@/modules/auth/ui/components/MyForm/SignIn";

async function page({ searchParams }: { searchParams: Promise<{ oauthError?: string }> }) {
  const { oauthError } = await searchParams;
  return (
    <div>
      {oauthError && <div className="bg-red-500 p-4 text-white">{oauthError}</div>}
      <SignIn />
    </div>
  );
}
export default page;
