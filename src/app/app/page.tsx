import type { Metadata } from "next";
import { SiteHeader } from "@/components/chrome";
import CommandCenter from "./CommandCenter";

export const metadata: Metadata = {
  title: "Command Center · Inventis Labs",
  description:
    "Live seismic network view: node health, station traces, arrival sequence and the automated response ladder.",
};

export default function AppPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <CommandCenter />
      </main>
    </>
  );
}