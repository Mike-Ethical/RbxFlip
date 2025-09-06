import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">RbxFlip 🎲</h1>

      {!session ? (
        <>
          <p className="mb-4">Sign in to continue 🚀</p>
          <button
            onClick={() => signIn("roblox")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Sign in with Roblox
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">Welcome, {session.user.name}!</p>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="avatar"
              className="w-16 h-16 rounded-full mb-4"
            />
          )}
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Sign out
          </button>
        </>
      )}
    </div>
  );
}
