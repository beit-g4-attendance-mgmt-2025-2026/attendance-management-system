"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaUserEdit } from "react-icons/fa";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { getInitialsName } from "@/lib/GenerateUsernameInitial";

interface UserInfo {
  avator: string;
  name: string;
}

interface ProfileWithPopupProps {
  userInfo: UserInfo;
}

const ProfileWithPopup: React.FC<ProfileWithPopupProps> = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      useAuthStore.getState().clear();
      setIsOpen(false);
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Avatar */}
      <Avatar onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <AvatarImage src={userInfo.avator} />
        <AvatarFallback>{getInitialsName(userInfo.name)}</AvatarFallback>
      </Avatar>

      {/* Popup box */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute  right-0  mt-2 w-48 bg-background border rounded shadow-lg z-50"
        >
          <div className="p-4">
            <div className="flex justify-between">
              <Avatar className="cursor-pointer">
                <AvatarImage src={userInfo.avator} />
                <AvatarFallback>
                  {getInitialsName(userInfo.name)}
                </AvatarFallback>
              </Avatar>
              {/* <Link href={"/updateProfile"}>
								<FaUserEdit className="cursor-pointer mt-2 size-6" />
							</Link> */}
            </div>
            <p className="font-semibold">{userInfo.name}</p>

            <Button
              type="button"
              variant={"destructive"}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-4 w-full  transition-colors
                  cursor-pointer"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileWithPopup;
