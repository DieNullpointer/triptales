import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";
import { getNotficiations } from "@/helpers/authHelpers";
import VerticalAlign from "@/components/atoms/List";
import Spacing from "@/components/atoms/Spacing";
import List from "@/components/atoms/List";
import Notification from "@/components/static/Notification";

export default function Inbox() {
  const [unread, setUnread] = useState([]);
  const [read, setRead] = useState([]);

  const Empty: React.FC<{ type: "new" | "archived" }> = ({ type }) => (
    <>
      <Subheading center wide>
        Feels empty here
      </Subheading>
      <Flowtext gutter>
        You are either not logged in or you don't have any {type} notifications
      </Flowtext>
    </>
  );

  const init = async () => {
    const notifs = await getNotficiations();
    if (notifs) {
      setRead(notifs.map((n: any) => n.isRead));
      setRead(notifs.map((n: any) => !n.isRead));
    }
  };

  useEffect(() => {
    init();
  }, []);

  const data = [
    {
      label: "New",
      value: "new",
      desc: `Notifications and System Updates you haven't seen, will be shown here. They will be moved to "Archived" once you've seen them.`,
    },
    {
      label: "Archived",
      value: "archived",
      desc: `Those are archived Notifications and System updates. Archived Notifications and System updates will be deleted after 30 days.`,
    },
  ];

  return (
    <div>
      <Subheading
        wide
        gutter
        underline
        center
        uppercase
        bold
        className="!hidden md:!block"
      >
        Notifications
      </Subheading>
      <Tabs value="new">
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody
          animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
          }}
        >
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              <Flowtext className="!text-base" center>
                {desc}
              </Flowtext>
              <Spacing />
              {value === "new" ? (
                !unread ? (
                  <Empty type={value} />
                ) : (
                  <List>
                    {unread.map((n) => (
                      <Notification data={n} />
                    ))}
                  </List>
                )
              ) : value === "archived" ? (
                !read ? (
                  <Empty type={value} />
                ) : (
                  <List>
                    {read.map((n) => (
                      <Notification data={n} />
                    ))}
                  </List>
                )
              ) : (
                <></>
              )}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
}
