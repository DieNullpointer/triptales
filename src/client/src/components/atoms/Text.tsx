import { cleanClasses } from "@/helpers/stringHelpers";

export interface Props {
  children: string | React.ReactNode;
  wide?: boolean;
  uppercase?: boolean;
  bold?: boolean;
  className?: string;
  gutter?: boolean;
  underline?: boolean;
  center?: boolean;
  sectionMarker?: boolean;
  italic?: boolean;
  tightHeight?: boolean;
}

export interface PropsIcon {
  children: string | React.ReactNode;
  wide?: boolean;
  uppercase?: boolean;
  bold?: boolean;
  className?: string;
  gutter?: boolean;
  underline?: boolean;
  center?: boolean;
  sectionMarker?: boolean;
  italic?: boolean;
  tightHeight?: boolean;
  icon: React.ReactNode;
}

const classNames = (props: Props) =>
  cleanClasses(
    `${props.wide ? "tracking-widest" : ""} ${
      props.uppercase ? "uppercase" : ""
    } ${props.gutter ? "!mb-6" : ""} ${
      props.underline ? "border-b pb-1  border-black" : ""
    } ${props.bold ? "font-bold" : ""} ${props.center ? "text-center" : ""} ${
      props.sectionMarker ? "p-2 bg-slate-100 rounded-lg" : ""
    } ${props.italic ? "italic" : ""} w-full ${props.className}`
  );

export const Heading: React.FC<Props> = (props) => (
  <h1 className={`!text-xl md:!text-4xl font-semibold ${classNames(props)}`}>
    {props.children}
  </h1>
);

export const Subheading: React.FC<Props> = (props) => (
  <h2 className={`!inline-block !text-2xl md:!text-3xl ${classNames(props)}`}>
    {props.children}
  </h2>
);

export const Flowtext: React.FC<Props> = (props) => (
  <p
    className={`${
      props.tightHeight ? "!leading-tight" : ""
    } text-base md:text-lg ${classNames(props)}`}
  >
    {props.children}
  </p>
);

export const IconText: React.FC<PropsIcon> = (props) => (
  <div className="flex flex-row space-x-2 items-center">
    {props.icon}
    <Flowtext {...props}></Flowtext>
  </div>
);
