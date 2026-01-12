import Image from "next/image";
export default function Header() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-2 mb-2  border-b h-32">
      <div>
        <Image src="/TU_logo.jpg" alt="logo" width={48} height={48} />
      </div>
      <h5 className="text-sm">Technological University(Meiktila)</h5>
    </div>
  );
}
