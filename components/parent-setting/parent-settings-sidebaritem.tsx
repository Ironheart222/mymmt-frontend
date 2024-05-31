import React from "react";
import { useRouter } from "next/router";
import { Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { ParentSideBarType } from "../../store/Interface";

interface DataType {
	menu: ParentSideBarType,
}

export const ParentSettingsSidebarItem = (data: DataType) => {
	let { menu } = data;
	const router = useRouter();
	const active = menu.href ? (router.pathname === menu.href) : false;

	const handleRedirection = () => {
		router.push(menu.href);
	}

	return (
		<Menu>
			<MenuItem
				className={active ? "active-menu" : ""}
				icon={menu.icon}
				onClick={handleRedirection}
			>
			<span>
				{menu.name}<br/>{menu?.subname || ""}
			</span>
		</MenuItem>
		</Menu >
	)
}