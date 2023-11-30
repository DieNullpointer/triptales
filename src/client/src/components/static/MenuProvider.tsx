import Router, { useRouter } from "next/router";
import {
  Card,
  Typography,
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
  ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import * as Auth from "@/helpers/authHelpers";
import React, { use, useEffect, useState } from "react";

const MenuProvider: React.FC<{}> = () => {
  const itemsClass =
    "text-white hover:bg-primary/20 active:focus:bg-primary/20 focus:bg-primary/20 hover:text-white focus:text-white active:text-white ";
  const router = useRouter();

  const [auth, setAuth] = useState("");

  const checkLogin = async () => {
    await setAuth(await Auth.getAuthorized());
  };

  useEffect(() => {
    checkLogin();
  });

  return (
    <List>
      <ListItem className={itemsClass} onClick={() => router.push("/")}>
        <ListItemPrefix>
          <HomeIcon className="h-5 w-5 text-white" />
        </ListItemPrefix>
        Homepage
      </ListItem>
      {auth ? (
        <>
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
          <ListItem className={itemsClass} onClick={() => router.push("/user/" + auth)}>
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
          <ListItem
            className={itemsClass}
            onClick={async () => {
              if (await Auth.logout()) router.push("/landingpage");
            }}
          >
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5 text-white" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </>
      ) : (
        <ListItem
          className={itemsClass}
          onClick={() => {
            router.push("/landingpage");
          }}
        >
          <ListItemPrefix>
            <ArrowUpCircleIcon className="h-5 w-5 text-white" />
          </ListItemPrefix>
          Log In
        </ListItem>
      )}
    </List>
  );
};

export default MenuProvider;
