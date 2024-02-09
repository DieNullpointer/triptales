import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { Flowtext, Heading, Subheading } from "@/components/atoms/Text";

export default function Inbox() {
  const data = [
    {
      label: "New",
      value: "new",
      desc: `Notifications and System Updates you haven't seen, will be shown here.They will be moved to "Archived" once you've seen them.`,
    },
    {
      label: "Archived",
      value: "archived",
      desc: `Those are archived Notifications and System updates. Archived Notifications and System updates will be deleted after 30 days.`,
    },
  ];

  return (
    <div>
        <Subheading wide gutter underline center uppercase bold className="!hidden md:!block">Notifications</Subheading>
      <Tabs value="new">
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              <Flowtext center>{desc}</Flowtext>
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
      <div></div>
    </div>
  );
}
