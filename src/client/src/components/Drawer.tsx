import React, { useState } from "react";
import { Flowtext } from "./atoms/Text";
import {
  Drawer as TDrawer,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

export interface Props {
  open: boolean;
  onClose: () => void;
}

const Drawer: React.FC<Props> = ({ open = false, onClose }) => {
  const itemsClass =
    "text-white hover:bg-primary/20 active:focus:bg-primary/20 focus:bg-primary/20 hover:text-white focus:text-white active:text-white";

  return (
    <React.Fragment>
      <TDrawer open={open} onClose={onClose} className="bg-primaryHover/60 text-white">
        <div className="mb-2 p-4 w-full">
          <Flowtext uppercase wide center bold>
            Navigation
          </Flowtext>
        </div>
        <List>
          <ListItem className={itemsClass}>
            <ListItemPrefix>
              <HomeIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Homepage
          </ListItem>
          <ListItem className={itemsClass}>
            <ListItemPrefix>
              <InboxIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Inbox
            <ListItemSuffix>
              <Chip
                value="14"
                size="sm"
                variant="ghost"
                className="rounded-full bg-primary/40 text-white "
              />
            </ListItemSuffix>
          </ListItem>
          <ListItem className={itemsClass}>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Profile
          </ListItem>
          <ListItem className={itemsClass}>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem className={itemsClass}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </TDrawer>
    </React.Fragment>
  );
};

export default Drawer;
