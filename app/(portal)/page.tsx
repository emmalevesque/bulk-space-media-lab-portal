import { redirect } from "next/navigation";
export default function HomepageRoute() {
  redirect("/studio");
  return (
    <div className="animate-gradient-x animate-gradient flex min-h-screen min-w-full flex-col items-center justify-center  text-[lavender]">
      <h1 className="mb-2 text-3xl">Hello World</h1>
      <p>You are being redirected...</p>
    </div>
  );
}
