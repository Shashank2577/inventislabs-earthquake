import type { Metadata } from "next";
import { SiteHeader } from "@/components/chrome";
import Playground from "./Playground";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Place an epicentre anywhere on the map, pick a city, and run the warning-time clock against your own scenario.",
};

export default function PlaygroundPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Playground />
      </main>
    </>
  );
}