"use client";

import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";
import { useState } from "react";

type ImageCardProps = {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  className?: string;
};

export default function ImageCard({
  src,
  alt,
  title,
  subtitle,
  ctaText,
  ctaHref,
  className,
}: ImageCardProps) {
  const cardClass =
    "group rounded-sm overflow-hidden bg-white border border-line shadow-[0_1px_2px_rgba(11,18,32,0.06),0_12px_24px_-16px_rgba(11,18,32,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(11,18,32,0.08),0_20px_36px_-18px_rgba(11,18,32,0.4)]";

  return (
    <article className={cardClass + " " + (className ?? "")}>
      <div className="relative overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="block w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(11,18,32,0.6)] transition-opacity duration-300 group-hover:opacity-0" />
      </div>

      <div className="relative pt-4 px-4">
        <h3 className="font-display text-lg font-semibold text-ink transition group-hover:text-amber">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate">{subtitle}</p>
        <a
          href={ctaHref}
          aria-label={`${ctaText} about ${title}`}
          className="mt-3 inline-flex items-center gap-2 rounded-sm pt-1.5 text-sm font-semibold text-ink transition group-hover:text-amber"
        >
          {ctaText}
          <ArrowRightIcon className="h-4 w-4 text-amber" />
        </a>
      </div>
    </article>
  );
}