import Image from "next/image";

export const Logo = () => {
    return (
        <Image
            height={64}
            width={64}
            alt="logo"
            src="/logo.png"
            className="h-16 w-16 object-contain shrink-0"
            unoptimized
        />
    )
}