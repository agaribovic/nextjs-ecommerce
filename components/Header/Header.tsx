"use client";

import { useCallback, useState } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Link from "next/link";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { cakeAdd, cakeOrder } from "@/redux/slices/modalSlice";
import { setSortedCakes } from "@/redux/slices/cakeDataSlice";
import { useLogoutAdminMutation, adminApi } from "@/redux/api/adminApi";
import { setLoggedOut } from "@/redux/slices/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Sort from "../Sort/Sort";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const home = pathname === "/";

  const [openMenu, setOpenMenu] = useState(false);
  const [logoutAdmin] = useLogoutAdminMutation();

  const { cakeData, isLoggedIn } = useSelector(
    (state: RootState) => ({
      cakeData: state.cakeData.cakeData,
      isLoggedIn: state.auth.isLoggedIn,
    }),
    shallowEqual
  );

  const handleSort = useCallback(
    (sorted: typeof cakeData) => dispatch(setSortedCakes(sorted)),
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    await logoutAdmin().unwrap();
    dispatch(adminApi.util.resetApiState());
    dispatch(setLoggedOut());
    toast.success("Dođi opet, Merisa :)");
  }, [logoutAdmin, dispatch]);

  const linkHref = home ? "/about" : "/";
  const linkText = home ? (
    "O meni"
  ) : (
    <span className="text-4xl cursor-pointer">🏠</span>
  );

  const gradientTextClass =
    "text-gray-800 bg-gradient-to-r from-[#dbeafe] to-[#fbcfe8] bg-clip-text text-transparent hover:drop-shadow-[0_0_10px_rgba(219,234,254,0.8)] hover:scale-105 transition-all duration-300";

  const orderButtonClass =
    "px-6 py-2 rounded-xl font-semibold text-gray-800 bg-gradient-to-b from-[#dbeafe] to-[#fbcfe8] shadow-[0_0_10px_#dbeafe,0_0_20px_#fbcfe8] hover:shadow-[0_0_15px_#dbeafe,0_0_30px_#fbcfe8] hover:scale-105 transition-transform transition-shadow duration-300 text-xl cursor-pointer";

  return (
    <>
      <header className="flex items-center bg-gray-800 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 h-20">
        <div className="flex items-center gap-30">
          {home && <Sort cakes={cakeData} onSort={handleSort} />}

          <Link
            href={linkHref}
            className={`text-3xl font-bold ${gradientTextClass} ${
              home ? "hidden xl:flex" : ""
            }`}
          >
            {linkText}
          </Link>
        </div>

        {home && (
          <div className="hidden xl:flex flex-2 justify-center w-[240px]">
            <button
              onClick={() => dispatch(cakeOrder())}
              className={`${orderButtonClass} ${!isLoggedIn ? "mr-62" : ""}`}
            >
              NARUČI TORTU
            </button>
          </div>
        )}

        <div className="hidden xl:flex items-center gap-30 justify-end">
          {isLoggedIn && home && (
            <button
              onClick={handleLogout}
              className={`text-3xl font-bold ${gradientTextClass} cursor-pointer`}
            >
              Odjavi se
            </button>
          )}

          <button
            onClick={() => dispatch(cakeAdd())}
            className="text-4xl p-6 cursor-pointer"
          >
            {home && "🎂"}
          </button>
        </div>

        {home && (
          <button
            onClick={() => setOpenMenu(true)}
            className="xl:hidden text-4xl p-3 text-white ml-auto cursor-pointer"
          >
            ☰
          </button>
        )}
      </header>

      <div
        onClick={() => setOpenMenu(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          openMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 w-64 h-full bg-gray-900 text-white shadow-xl z-50 transform transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-lg font-semibold">Meni</h2>
          <button
            onClick={() => setOpenMenu(false)}
            className="text-3xl cursor-pointer"
          >
            ×
          </button>
        </div>

        <ul className="p-4 space-y-6 text-xl">
          <li className="hover:text-pink-300">
            <Link href={linkHref} onClick={() => setOpenMenu(false)}>
              {linkText}
            </Link>
          </li>

          {home && (
            <>
              <li>
                <button
                  onClick={() => {
                    dispatch(cakeOrder());
                    setOpenMenu(false);
                  }}
                  className="w-full text-left hover:text-pink-300 cursor-pointer"
                >
                  Naruči tortu 🎂
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    dispatch(cakeAdd());
                    setOpenMenu(false);
                  }}
                  className="hover:text-pink-300 cursor-pointer"
                >
                  {isLoggedIn ? "Dodaj tortu 🎂" : "Prijavi se"}
                </button>
              </li>
            </>
          )}

          {isLoggedIn && home && (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setOpenMenu(false);
                }}
                className="hover:text-pink-300"
              >
                Odjavi se
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Header;
