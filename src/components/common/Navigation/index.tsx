import { NavLink, matchPath, useLocation } from "react-router-dom";

const PATHS = {
    SWAP: "/swap",
    LIMIT_ORDERS: "limit-order",
    POOLS: "/pools",
    POOL: "/pool",
    ANALYTICS: "/analytics",
};

const menuItems = [
    {
        title: "Swap",
        link: "/swap",
        active: [PATHS.SWAP, PATHS.LIMIT_ORDERS],
    },
    {
        title: "Pools",
        link: "/pools",
        active: [PATHS.POOLS, PATHS.POOL],
    },
    {
        title: "Analytics",
        link: "/analytics",
        active: [PATHS.ANALYTICS],
    },
];

const Navigation = () => {
    const { pathname } = useLocation();

    const setNavlinkClasses = (paths: string[]) =>
        paths.some((path) => matchPath(path, pathname))
            ? "border-b border-muted-primary"
            : "border-b border-transparent hover:border-card-hover";

    return (
        <nav>
            <ul className="flex justify-center gap-2 rounded-full whitespace-nowrap">
                {menuItems.map((item) => (
                    <NavLink
                        key={`nav-item-${item.link}`}
                        to={item.link}
                        className={`${setNavlinkClasses(item.active)} py-2 px-4 font-semibold select-none duration-200`}
                    >
                        {item.title}
                    </NavLink>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
