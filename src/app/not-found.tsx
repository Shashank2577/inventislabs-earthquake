import Link from "next/link";
import { SiteHeader } from "@/components/chrome";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1440px] px-5 py-28 md:px-8 md:py-40">
        <p className="eyebrow">404 · no signal</p>
        <h1 className="display mt-8 max-w-4xl">
          Nothing is being
          <br />
          detected <em>here.</em>
        </h1>
        <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-ink-2">
          That page does not exist. If you were looking for the live network
          view, it is one click away — or start from the top of the story.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/playground" className="inline-flex btn btn-primary">
            Open Playground
          </Link>
          <Link href="/story" className="inline-flex btn btn-ghost">
            Read the story
          </Link>
        </div>
      </main>
    </>
  );
}