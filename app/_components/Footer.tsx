import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DribbbleIcon,
  GithubIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const footerSections = [
  {
    title: "Platform",
    links: [
      {
        title: "AI Website Builder",
        href: "#",
      },
      {
        title: "Pricing",
        href: "/pricing",
      },
      {
        title: "Templates",
        href: "#",
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        title: "Contact Us",
        href: "/contact",
      },
      {
        title: "Shipping Policy",
        href: "/shipping",
      },
      {
        title: "Help Center",
        href: "#",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        title: "Privacy Policy",
        href: "/privacy",
      },
      {
        title: "Terms & Conditions",
        href: "/terms",
      },
      {
        title: "Refund Policy",
        href: "/refund",
      },
    ],
  },
];

const Footer = () => {
  return (
    <div className="flex flex-col">
      <div className="grow" />
      <footer className="bg-white dark:bg-neutral-950 text-muted-foreground border-t border-black/10 dark:border-white/10">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          <div className="py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full xl:col-span-2">
              {/* Logo */}
              <Image
                src={"/logo_black_white.svg"}
                alt="logo"
                width={140}
                height={140}
                className="hidden dark:block"
              />
              <Image
                src={"/logo.svg"}
                alt="logo"
                width={140}
                height={140}
                className="block dark:hidden"
              />

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Turn your ideas into production-ready code. The intelligent
                design partner that helps you build faster, ship smarter, and
                scale effortlessly.
              </p>
            </div>

            {footerSections.map(({ title, links }) => (
              <div key={title} className="text-muted-foreground">
                <h6 className="font-semibold mb-6 text-foreground">{title}</h6>
                <ul className="space-y-4">
                  {links.map(({ title, href }) => (
                    <li key={title}>
                      <Link
                        href={href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Subscribe Newsletter */}
            <div className="col-span-2">
              <h6 className="font-semibold mb-2 text-foreground">
                Join the revolution
              </h6>
              <p className="text-sm text-muted-foreground mb-6">
                Get the latest updates on AI features and design trends.
              </p>
              <form className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="grow placeholder:text-muted-foreground focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-white"
                />
                <Button>Subscribe</Button>
              </form>
            </div>
          </div>

          <Separator />

          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0 text-muted-foreground">
            {/* Copyright */}
            <span className="text-sm">
              &copy; {new Date().getFullYear()}{" "}
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Codecraft Inc
              </Link>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-5">
              <Link
                href="#"
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                target="_blank"
                className="hover:text-foreground transition-colors"
              >
                <DribbbleIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
