import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                Link to Admin Panel <Link className="text-blue-600" href={"/admin/dashboard"}>Link</Link>
            </h1>
        </div>
    );
}
