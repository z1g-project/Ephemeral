import { ReactElement } from "react";

type NavButton = {
	title: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	children: ReactElement;
	asChild?: boolean;
};
export type { NavButton };
