"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convexClient = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ClerkProvider publishableKey={clerkKey} appearance={{
      variables: {
        colorPrimary: "#ff7d29"
      }
    }} >
      <ConvexProviderWithClerk useAuth={useAuth} client={convexClient}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
