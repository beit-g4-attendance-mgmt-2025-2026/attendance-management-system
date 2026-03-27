"use client";

import ClassForm from "@/components/ClassForm";
import { DialogCardBtn } from "@/components/DialogCardBtn";
import SearchInput from "@/components/inputs/SearchInput";
import { useSelectedLayoutSegment } from "next/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
  const segment = useSelectedLayoutSegment();
  const isDetailPage = Boolean(segment);

  return (
    <>
      {!isDetailPage && (
        <header className="flex justify-between items-center mb-6">
          <SearchInput
            placeholder="Search for a class by name"
            className="bg-gray-200 rounded-2xl dark:bg-[#172139]"
          />
          <div className="flex gap-3">
            <DialogCardBtn triggerName="Add Class" title="Add Class">
              <ClassForm isEdit={false} />
            </DialogCardBtn>
          </div>
        </header>
      )}
      <main>{children}</main>
    </>
  );
};

export default layout;
