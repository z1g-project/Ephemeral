import { ReactElement } from "react";

export type NavButton = {
    title: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children: ReactElement;
    asChild?: boolean;
};
