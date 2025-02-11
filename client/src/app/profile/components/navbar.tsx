/* eslint-disable @next/next/no-img-element */
import * as React from "react";

interface NavbarProps {
  image: string;
}

export const Navbar: React.FC<NavbarProps> = ({ image }) => {
  return (
    <div className="fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-5 py-1 bg-base-100 text-black shadow-md">
        <div className="text-[22px] font-bold">Profil Kamu</div>
        <div className="">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-9 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={
                    image ||
                    "https://teknogram.id/gallery/foto-profil-wa/keren/pp-wa-kosong-keren-5.jpg"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Transactions</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
