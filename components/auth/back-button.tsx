"use client"

import Link from "next/link"

interface BackButtonProps {
    label: string,
    href: string
};

export const BackButton = ({
    label,
    href
}:BackButtonProps) => {
    return(
        <Link href={href}>
            {label}
        </Link>
    )
}