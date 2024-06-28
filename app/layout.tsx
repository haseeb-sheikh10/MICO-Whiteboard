import { ConvexClientProvider } from "@/providers/convex-client-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import { Suspense } from "react";
import Loader from "@/components/Loader";

const font = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Mico Whitboard",
  description: "Mico Whitboard is a collaborative whiteboard for remote teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Suspense fallback={<Loader />}>
          <ConvexClientProvider>
            {children}
            <ModalProvider />
            <Toaster
              theme="light"
              richColors
              expand={true}
              position="bottom-right"
            />
          </ConvexClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
