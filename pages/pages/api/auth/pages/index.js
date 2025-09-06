import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎲 RbxFlip</h1>

      {!session ? (
        <>
          <p>Sign in to continue 🚀</p>
          <button
            onClick={() => signIn("roblox")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Sign in with Roblox
          </button>
        </>
      ) : (
        <>
          <p>Welcome, {session.user.name}!</p>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="avatar"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                margin: "10px auto",
              }}
            />
          )}
          <button
            onClick={() => signOut()}
            style={{
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Sign out
          </button>
        </>
      )}
    </div>
  );
}
