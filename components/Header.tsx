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

// NavBarMenuToggle == toggles mobile nav bar
// NavBarMenu == mobile nav bar

import listOfServices from "@/data/services";
import GeneralButton from "./GeneralButton";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const userIsSignedIn = false;

  const handleLogOut = () => {
    console.log("logged out :)");
    // logout Logic
  };

  type LoggedInMenuType =
    | { label: string; href: string; onClick?: never }
    | { label: string; onClick: () => void; href?: never };

  // This is a union type. for objects you have to put the | at the start too, not just inbetween the two objects
  // we either want an href or onClick property, never both

  const loggedInMenuItems: LoggedInMenuType[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/profile" },
    { label: "Log Out", onClick: handleLogOut },
  ];

  const guestMenuItems = [
    { label: "Sign Up", href: "/signup" },
    { label: "Login", href: "/login" },
  ];

  const mobileNavMenuItems = [
    ...(userIsSignedIn ? loggedInMenuItems : guestMenuItems),
    ...listOfServices,
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        wrapper: "w-full max-w-none px-4", // gets rid of the default max-w-[1024px] set on the header by heroui
      }}
    >
      {/* #### Left Section (logo and mobile menu toggle button) ###### */}

      <NavbarContent justify="start">
        {/* Toggle for mobile menu, it hides on screens that are larger than extra small */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img
            src="/logo.png"
            alt="A corgi which is used as a logo"
            width={40}
            height={50}
          />
          <p className="text-medium font-bold">Maid You Look</p>
        </NavbarBrand>
      </NavbarContent>

      {/* #### Middle Section ###### */}
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <Dropdown>
          <NavbarItem isActive>
            <DropdownTrigger>
              {/* Used a regular button here since its just a non-stylized button. The stylized HeroUi button is overkill and would require workarounds like putting the services text in a span to make its sizing look the same as the other nav buttons */}
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
          </NavbarItem>

          <DropdownMenu
            aria-label="Services"
            itemClasses={{
              base: "gap-4",
            }}
          >
            {listOfServices.map((service) => (
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

      {/* #### Right Section ###### */}
      <NavbarContent justify="end">
        {!userIsSignedIn && (
          <>
            <NavbarItem className="hidden md:flex">
              {/* only shows up on medium and larger screens, when there is more room */}
              <Link
                className="w-full"
                color="foreground"
                href={guestMenuItems[0].href}
                size="md"
              >
                {guestMenuItems[0].label}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <GeneralButton
                as={Link}
                href={guestMenuItems[1].href}
                label={guestMenuItems[1].label}
              />
            </NavbarItem>
          </>
        )}

        {userIsSignedIn && (
          <>
            <NavbarItem className="hidden md:flex">
              <Link
                className="w-full"
                color="foreground"
                href={loggedInMenuItems[0].href}
                size="md"
              >
                {loggedInMenuItems[0].label}
              </Link>
            </NavbarItem>

            <NavbarItem className="hidden md:flex">
              <Link
                className="w-full"
                color="foreground"
                href={loggedInMenuItems[1].href}
                size="md"
              >
                {loggedInMenuItems[1].label}
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Button
                color="primary"
                onPress={loggedInMenuItems[2].onClick}
                // onPress is HeroUi's version of onClick
                variant="flat"
              >
                {loggedInMenuItems[2].label}
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* ################  Mobile Nav Bar Menu ################# */}

      <NavbarMenu>
        {mobileNavMenuItems.map((item, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <NavbarMenuItem key={`${item.label}-${index}`}>
            {item.href ? (
              <Link
                className="w-full"
                color="foreground"
                href={item.href}
                size="md"
              >
                {item.label}
              </Link>
            ) : (
              "onClick" in item && (
                // this typeguard check is needed because the item.href check returning false does not narrow the type down to being the second union member (item.onClick)

                // the type of the item is actually the full union still, so typescript sees that it could be the first union type which doesn't have the onClick property
                <button onClick={item.onClick} type="button">
                  <span className="text-medium"> {item.label} </span>
                </button>
              )
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
