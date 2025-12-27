import { Fragment, useContext, useEffect, useState } from "react";
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
  Popover,
  MenuItem,
  Typography,
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
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [popoverGroupId, setPopoverGroupId] = useState(null);

  const location = useLocation();

  useEffect(() => {
    fetchPageGroups();
  }, [fetchPageGroups]);

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
    <Fragment>
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
        <Box sx={{ p: 2, textAlign: open ? "left" : "center" }}>
          {open && <strong>Dashboard</strong>}
        </Box>
        <Divider />

        <List sx={{ padding: "0px 8px" }}>
          {/* Ungrouped */}
          {ungroupedPages.map((p) => {
            const active = location.pathname.startsWith(`/${p.slug}`);
            return open ? (
              <ListItemButton
                key={p._id}
                component={Link}
                to={`/${p.slug}`}
                selected={active}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Description />
                </ListItemIcon>
                <ListItemText primary={p.name} />
              </ListItemButton>
            ) : (
              <Tooltip key={p._id} title={p.name} placement="right">
                <ListItemButton
                  component={Link}
                  to={`/${p.slug}`}
                  selected={active}
                  sx={{ flexDirection: "column", py: 1.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    {<Description />}
                  </ListItemIcon>
                  <Typography sx={{ fontSize: 10 }}>{p.name}</Typography>
                </ListItemButton>
              </Tooltip>
            );
          })}

          {/* Grouped */}
          {pageGroups.map((group) => {
            const groupPages = pagesByGroupId[group._id] || [];
            if (!groupPages.length) return null;
            const isOpen = openGroup === group._id;

            return (
              <Box key={group._id}>
                {open ? (
                  <>
                    <ListItemButton
                      onClick={() => setOpenGroup(isOpen ? null : group._id)}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Folder />
                      </ListItemIcon>
                      <ListItemText primary={group.name} />
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {groupPages.map((p) => (
                          <ListItemButton
                            key={p._id}
                            component={Link}
                            to={`/${p.slug}`}
                            sx={{ pl: 4 }}
                            selected={location.pathname.startsWith(
                              `/${p.slug}`
                            )}
                          >
                            <ListItemIcon>
                              <Description fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={p.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <Tooltip title={group.name} placement="right" key={group._id}>
                    <ListItemButton
                      onClick={(e) => {
                        setPopoverAnchorEl(e.currentTarget);
                        setPopoverGroupId(group._id);
                      }}
                      sx={{ flexDirection: "column", py: 1.5 }}
                    >
                      <ListItemIcon sx={{ minWidth: 0 }}>
                        <Folder />
                      </ListItemIcon>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography sx={{ fontSize: 10 }}>
                          {group.name}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {<ExpandMore sx={{ fontSize: 14 }} />}
                        </Box>
                      </Box>
                    </ListItemButton>
                  </Tooltip>
                )}
              </Box>
            );
          })}
        </List>

        {/* Logout */}
        <Box sx={{ mt: "auto" }}>
          <Divider />
          {open ? (
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          ) : (
            <Tooltip title="Logout" placement="right">
              <ListItemButton
                onClick={logout}
                sx={{ flexDirection: "column", py: 1.5 }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <Logout />
                </ListItemIcon>
                <Typography sx={{ fontSize: 10 }}>Logout</Typography>
              </ListItemButton>
            </Tooltip>
          )}
        </Box>
      </Drawer>

      {/* Toggle button */}
      <Box
        sx={{
          position: "fixed",
          top: 48,
          left: open ? DRAWER_WIDTH - 20 : MINI_WIDTH - 20,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: "left 0.3s",
        }}
      >
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            backgroundColor: "#fff",
            border: "1px solid red",
            boxShadow: 2,
          }}
        >
          <MenuIcon
            sx={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </IconButton>
      </Box>

      {/* Popover for collapsed groups */}
      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={() => {
          setPopoverAnchorEl(null);
          setPopoverGroupId(null);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ sx: { ml: "12px", minWidth: 200 } }}
      >
        {(pagesByGroupId[popoverGroupId] || []).map((p) => (
          <MenuItem
            key={p._id}
            component={Link}
            to={`/${p.slug}`}
            onClick={() => {
              setPopoverAnchorEl(null);
              setPopoverGroupId(null);
            }}
          >
            {p.name}
          </MenuItem>
        ))}
      </Popover>
    </Fragment>
  );
}
