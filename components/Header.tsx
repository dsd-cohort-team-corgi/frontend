"use client";

import Link from "next/link";
// Link is a wrapper component that allows for client side navigation, which improves next.js performance
// Why? Since it will not reload the page & it prefetches the page in the background
// When to use? To be used when moving internally, do not use for external links
// it doesn't render anything by default, instead it wraps the content
// ex <Link href="/about"> <a> Click here to go to the about page </a> </Link>

import React from "react";
import Image from "next/image";
import { TicketPercent } from "lucide-react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link as HeroUiLink,
  // HeroUi's Link under the hood is an <a> tag with styling and accessiblity built in
  // we tell HeroUiLink to render as a Next/Link "as={Link}" in order to get the performance boost of Next/Link while keeping the styling & accessiblity benefits of a HeroUi's Link Component
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Button,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Spinner,
  Avatar,
} from "@heroui/react";
// NavBarMenuToggle == toggles mobile nav bar
// NavBarMenu == mobile nav bar
import supabaseClient from "@/lib/supabase";
import { useAuthContext } from "@/components/context-wrappers/AuthContext";
import listOfServices from "@/data/services";
import GoogleSignInButton from "./GoogleSignInButton";
import { useApiQuery } from "@/lib/api-client";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { authContextObject } = useAuthContext();
  const {
    isOpen: isCouponsDrawerOpen,
    onOpen: onOpenCouponsDrawer,
    onOpenChange: onCouponsDrawerOpenChange,
  } = useDisclosure();

  type CouponList = {
    coupon_code: string;
    coupon_name: string;
    discount_value: number;
  };

  const {
    data: coupons,
    error: couponsError,
    isLoading: couponsLoading,
  } = useApiQuery<CouponList[]>(["coupons", "all"], "/coupons", {
    refetchInterval: 0,
    refetchIntervalInBackGround: false,
    skip: false,
  });

  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);
  const handleCopyCouponCode = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIdx(idx);
      window.setTimeout(() => {
        setCopiedIdx((current) => (current === idx ? null : current));
      }, 1500);
    } catch (_) {
      // no-op for now
    }
  };

  const handleLogOut = async () => {
    await supabaseClient.auth.signOut();
    // the auth context automatically keeps track of auth changes, so we don't need to manually reset the auth context
  };

  const mobileNavMenuItems = [...Object.values(listOfServices)];

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        classNames={{
          wrapper: "w-full max-w-6xl mx-auto p-4", // fixed width on desktop, centered, with padding and top padding
          base: 'z-[9999]'
        }}
      >
        {/* #### Left Section (logo and mobile menu toggle button) ###### */}

        <NavbarContent justify="start">
          {/* Toggle for mobile menu, it hides on screens that are larger than extra small */}
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <Link href="/">
            <NavbarBrand>
              <img
                src="/logo.png"
                alt="A corgi which is used as a logo"
                width={40}
                height={50}
                className="mr-2"
              />
              <p className="text-medium font-bold">Wipe Right</p>
            </NavbarBrand>
          </Link>
        </NavbarContent>

        {/* #### Right Section ###### */}
        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:flex">
            <Dropdown>
              <DropdownTrigger>
                <button
                  className="p-0 font-medium"
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={isMenuOpen}
                  aria-controls="services-dropdown"
                >
                  Services
                </button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Services"
                itemClasses={{
                  base: "gap-4",
                }}
              >
                {Object.values(listOfServices).map((service) => (
                  <DropdownItem
                    key={service.label}
                    description={service.description}
                    href={service.href}
                  >
                    {service.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>

          {!authContextObject.supabaseUserId && (
            <NavbarItem>
              <GoogleSignInButton />
            </NavbarItem>
          )}

          {authContextObject.supabaseUserId && (
            <>
              <NavbarItem>
                <Button
                  isIconOnly
                  aria-label="Coupons"
                  variant="light"
                  onPress={onOpenCouponsDrawer}
                >
                  <TicketPercent size={22} />
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded="false"
                    >
                      <Avatar
                        as="span"
                        size="sm"
                        isBordered
                        className="cursor-pointer"
                        name={authContextObject.displayName || "Profile"}
                        src={authContextObject.avatarUrl || undefined}
                      />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile actions">
                    <DropdownItem
                      key="signout"
                      color="danger"
                      onPress={handleLogOut}
                    >
                      Sign out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        {/* ################  Mobile Nav Bar Menu ################# */}

        <NavbarMenu>
          {mobileNavMenuItems.map((item, index) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <HeroUiLink
                as={Link}
                className="w-full"
                color="foreground"
                href={item.href}
                size="md"
              >
                {item.label}
              </HeroUiLink>
            </NavbarMenuItem>
          ))}
          {!authContextObject.supabaseUserId && (
            <NavbarMenuItem>
              <GoogleSignInButton />
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>

      <Drawer
        isOpen={isCouponsDrawerOpen}
        onOpenChange={onCouponsDrawerOpenChange}
        placement="left"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Coupons
              </DrawerHeader>
              <DrawerBody>
                {couponsLoading && (
                  <div className="flex justify-center py-6">
                    <Spinner />
                  </div>
                )}
                {!couponsLoading && !couponsError && coupons && (
                  <div className="flex flex-col gap-3">
                    {coupons.map((c, idx) => {
                      const imageOrder = [
                        "/yellow-coupon.png",
                        "/pink-coupon.png",
                        "/blue-coupon.png",
                        "/red-coupon.png",
                      ];
                      const src = imageOrder[idx];
                      return (
                        <div
                          key={c.coupon_code}
                          className="relative mx-auto w-full max-w-sm md:max-w-md"
                        >
                          <Image
                            src={src}
                            alt="Coupon"
                            width={920}
                            height={454}
                            className="h-auto w-full rounded-xl"
                            priority={idx === 0}
                          />

                          <div className="absolute left-[30%] top-1/2 z-10 -translate-y-1/2">
                            <div className="flex flex-col gap-1 text-black">
                              <div className="text-lg font-bold md:text-xl">
                                {c.coupon_name}
                              </div>
                              <div className="text-base italic md:text-lg mb-6">
                                {c.discount_value}% off
                              </div>
                              <Button
                                size="sm"
                                className="bg-black text-white hover:bg-black/80"
                                onPress={() =>
                                  handleCopyCouponCode(c.coupon_code, idx)
                                }
                              >
                                {copiedIdx === idx ? "Copied" : "Redeem"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </DrawerBody>
              <DrawerFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
