'use client'

import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import RedirectToHome from "./_utils/RedirectToHome";
import { RedirectToSignIn } from "@clerk/clerk-react";
import Loader from "@/components/Loader";

export default function Home() {
  return (
    <>
    <AuthLoading>
      <Loader/>
    </AuthLoading>
    <Authenticated>
      <RedirectToHome />
    </Authenticated>
    <Unauthenticated>
      <RedirectToSignIn/>
    </Unauthenticated>
    </>
  );
}
