"use client";
import { PackageIcon } from "lucide-react";
import Link from "next/link";
import { useUser, useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <nav className="relative bg-white">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">
          <Link
            href="/"
            className="relative text-4xl font-semibold text-slate-700"
          >
            <span className="text-green-600">Pak</span>Cards
            <span className="text-green-600 text-5xl leading-0">.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
            <Link href="/">Home</Link>

            {!user ? (
              <button
                onClick={openSignIn}
                className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={
                      <PackageIcon
                        size={16}
                        label={"My Orders"}
                        onClick={() => router.push("/orders")}
                      />
                    }
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          {/* Mobile User Button  */}
          <div className="sm:hidden">
            {user ? (
              <div>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={
                        <ShoppingCart
                          size={16}
                          label={"Cart"}
                          onClick={() => router.push("/cart")}
                        />
                      }
                    />
                  </UserButton.MenuItems>
                </UserButton>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={
                        <PackageIcon
                          size={16}
                          label={"My Orders"}
                          onClick={() => router.push("/orders")}
                        />
                      }
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
      <hr className="border-gray-300" />
    </nav>
  );
};

export default Navbar;
