"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const UserIsSignedIn = false;

  const handleLogOut = () => {
    // logout Logic
  };

  const staticMenuItems = [
    {
      label: "House Cleaning",
      href: "/housecleaning",
      description: "Regular, deep and move-in/out cleaning",
    },
    {
      label: "Lawn & Garden",
      href: "/lawnandgarden",
      description: "Mowing, landscaping, yard maintenance",
    },
    {
      label: "HandyMan & Repairs",
      href: "/handymanandrepairs",
      description: "Plumbing, electrical, installations, general fixes",
    },
    {
      label: "Exterior Cleaning",
      href: "/exteriorcleaning",
      description: "Driveways, siding, decks, patios",
    },
    {
      label: "Specialized Cleaning",
      href: "/specializedcleaning",
      description: "Carpet, upholstery, post-construction",
    },
    {
      label: "Assembly & Installation",
      href: "/assemblyandinstallation",
      description: "Furniture assembly, TV mounting, applicances",
    },
  ];

  const loggedInMenuItems = [
    { label: "Profile", href: "/profile" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "login", onclick: handleLogOut },
  ];

  const guestMenuItems = [
    { label: "login", onclick: "/login" },
    { label: "sign Up", href: "/sign up" },
  ];

  const mobileNavMenuItems = [
    ...(UserIsSignedIn ? loggedInMenuItems : guestMenuItems),
    ...staticMenuItems,
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        wrapper: "w-full max-w-none px-4", // gets rid of the default max-w-[1024px] set on the header by heroui
      }}
    >
      <NavbarContent justify="start">
        {/* Toggle for mobile menu */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />

        {/* #### Logo Section ###### */}

        <NavbarBrand>
          <img
            src="/logo.png"
            alt="A corgi which is used as a logo"
            width={40}
          />
          <p className="font-bold text-inherit">Maid You Look</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <Dropdown>
          <NavbarItem isActive>
            <DropdownTrigger>
              <Button
                disableRipple
                className="bg-transparent p-0 data-[hover=true]:bg-transparent"
                radius="sm"
                variant="light"
              >
                Services
              </Button>
            </DropdownTrigger>
          </NavbarItem>

          <DropdownMenu
            aria-label="Services"
            itemClasses={{
              base: "gap-4",
            }}
          >
            {staticMenuItems.map((service) => (
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
      </NavbarContent>
      <NavbarContent justify="end">
        {/* Buttons For guest users */}
        <NavbarItem className="hidden lg:flex">
          <Link href="/login">Log In</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/signup" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* ################  Mobile Nav Bar Menu ################# */}

      <NavbarMenu>
        {mobileNavMenuItems.map((item, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className="w-full"
              color={
                // the last item will be be red
                index === mobileNavMenuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
