import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Logout,
  Folder,
  Description,
} from "@mui/icons-material";
import { DataContext } from "../DataStore/DataContext";

const DRAWER_WIDTH = 280;
const MINI_WIDTH = 72;

export default function Sidebar() {
  const {
    isLoggedIn,
    logout,
    pages,
    getAccessiblePages,
    pageGroups,
    fetchPageGroups,
  } = useContext(DataContext);

  const [open, setOpen] = useState(true);
  const [openGroup, setOpenGroup] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchPageGroups();
  }, []);

  if (!isLoggedIn()) return null;

  const accessiblePageNames = getAccessiblePages();

  const filteredPages = pages
    .filter((p) => accessiblePageNames.includes(p.name))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const ungroupedPages = filteredPages.filter((p) => !p.group?._id);

  const pagesByGroupId = {};
  pageGroups.forEach((group) => {
    pagesByGroupId[group._id] = filteredPages.filter(
      (p) => p.group?._id === group._id
    );
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : MINI_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "width 0.3s",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          p: 1.5,
        }}
      >
        {open && <strong>Dashboard</strong>}
        <IconButton onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {/* Ungrouped pages */}
        {ungroupedPages.map((p) => {
          const active = location.pathname === `/${p.slug}`;
          return (
            <Tooltip key={p._id} title={!open ? p.name : ""} placement="right">
              <ListItemButton
                component={Link}
                to={`/${p.slug}`}
                selected={active}
                sx={{ justifyContent: open ? "initial" : "center" }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto" }}>
                  <Description />
                </ListItemIcon>
                {open && <ListItemText primary={p.name} />}
              </ListItemButton>
            </Tooltip>
          );
        })}

        {/* Grouped pages */}
        {pageGroups.map((group) => {
          const groupPages = pagesByGroupId[group._id] || [];
          if (!groupPages.length) return null;

          const isOpen = openGroup === group._id;

          return (
            <Box key={group._id}>
              <Tooltip title={!open ? group.name : ""} placement="right">
                <ListItemButton
                  onClick={() => setOpenGroup(isOpen ? null : group._id)}
                  sx={{ justifyContent: open ? "initial" : "center" }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto" }}>
                    <Folder />
                  </ListItemIcon>
                  {open && (
                    <>
                      <ListItemText primary={group.name} />
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>

              <Collapse in={isOpen && open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {groupPages.map((p) => {
                    const active = location.pathname === `/${p.slug}`;
                    return (
                      <ListItemButton
                        key={p._id}
                        component={Link}
                        to={`/${p.slug}`}
                        selected={active}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>
                          <Description fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={p.name} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </List>

      {/* Logout bottom */}
      <Box sx={{ mt: "auto" }}>
        <Divider />
        <Tooltip title={!open ? "Logout" : ""} placement="right">
          <ListItemButton
            onClick={logout}
            sx={{ justifyContent: open ? "initial" : "center" }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto" }}>
              <Logout />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
