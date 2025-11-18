"use client";

import { ReactNode } from "react";
import ReactQueryProvider from "@/providers/QueryProvider";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}