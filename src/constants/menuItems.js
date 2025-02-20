import homeIcon from "/src/assets/icons/Home.png";
import previewIcon from "/src/assets/icons/Preview Pane.png";
import settingsIcon from "/src/assets/icons/Settings.png";
import calendarIcon from "/src/assets/icons/Tear-Off Calendar.png";
import commercialIcon from "/src/assets/icons/Commercial.png";
import userManageIcon from "/src/assets/icons/profile.png"

export const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: homeIcon },
    { name: "Previews", path: "/admin/previews", icon: previewIcon },
    { name: "Ad Setting", path: "/admin/ad-setting", icon: settingsIcon },
    { name: "Availability", path: "/admin/availability", icon: calendarIcon },
    { name: "Announcement", path: "/admin/announcement", icon: commercialIcon },
    {name: "User Management", path:"/admin/crud/users", icon: userManageIcon}
];
