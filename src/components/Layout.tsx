import { FC, JSX, useState } from "react";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  CollectionsBookmark,
  FolderCopy,
  LibraryBooks,
  Menu as MenuIcon,
} from "@mui/icons-material";

const drawerWidth = 280;

interface ILayoutProps {
  children: JSX.Element;
  onMenuClick(name: string): void;
}

const Layout: FC<ILayoutProps> = ({ children, onMenuClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography>Frequent Data Store</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton onClick={() => onMenuClick("add_category")}>
            <ListItemIcon>
              <FolderCopy />
            </ListItemIcon>
            <ListItemText primary={"Add Category"} />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => onMenuClick("add_group")}>
            <ListItemIcon>
              <CollectionsBookmark />
            </ListItemIcon>
            <ListItemText primary={"Add Group"} />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => onMenuClick("add_snippet")}>
            <ListItemIcon>
              <LibraryBooks />
            </ListItemIcon>
            <ListItemText primary={"Add Snippet"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          open
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
