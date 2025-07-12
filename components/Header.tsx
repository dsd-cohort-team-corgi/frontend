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
} from "@heroui/react";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const mobileNavMenuItems = [
    { label: "Profile", href: "/profile" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "activity", href: "/activity" },
    { label: "logout", href: "/logout" },
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
        <NavbarItem>
          <Link
            color="foreground"
            href="https://www.heroui.com/docs/components/navbar#with-dropdown-menu"
          >
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link
            aria-current="page"
            href="https://www.heroui.com/docs/components/navbar#with-dropdown-menu"
          >
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            href="https://www.heroui.com/docs/components/navbar#with-dropdown-menu"
          >
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="https://www.heroui.com/docs/components/navbar#with-dropdown-menu">
            Login
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
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
                // eslint-disable-next-line no-nested-ternary
                index === 2
                  ? "primary"
                  : index === mobileNavMenuItems.length - 1
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
