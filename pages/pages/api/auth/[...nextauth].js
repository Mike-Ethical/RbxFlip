import NextAuth from "next-auth";

export default NextAuth({
  providers: [
    {
      id: "roblox",
      name: "Roblox",
      type: "oauth",
      wellKnown: "https://apis.roblox.com/oauth/.well-known/openid-configuration",
      clientId: process.env.ROBLOX_CLIENT_ID,
      clientSecret: process.env.ROBLOX_CLIENT_SECRET,
      authorization: { params: { scope: "openid profile" } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || profile.preferred_username,
          image: profile.picture,
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
});
