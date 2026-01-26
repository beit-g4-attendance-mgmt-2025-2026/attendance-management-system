import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { FaUserEdit } from "react-icons/fa";

interface UserInfo {
  avator: string;
  name: string;
  email: string;
}

interface ProfileWithPopupProps {
  userInfo: UserInfo;
}

const ProfileWithPopup: React.FC<ProfileWithPopupProps> = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative inline-block">
      {/* Avatar */}
      <Avatar onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <AvatarImage src={userInfo.avator} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      {/* Popup box */}
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute  right-0  mt-2 w-48 bg-background border rounded shadow-lg z-50">
          <div className="p-4">
            <div className="flex justify-between">
              <Avatar className="cursor-pointer">
                <AvatarImage src={userInfo.avator} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Link href={"/updateProfile"}>
                <FaUserEdit className="cursor-pointer mt-2 size-6" />
              </Link>
            </div>
            <p className="font-semibold">{userInfo.name}</p>
            <p className="text-sm text-gray-600">{userInfo.email}</p>
            <Button
              type="button"
              className="mt-4 w-full py-2 px-4 border rounded  transition-colors 
                  cursor-pointer">
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileWithPopup;
