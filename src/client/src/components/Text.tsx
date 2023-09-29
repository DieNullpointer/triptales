import { cleanClasses } from "@/helpers/helpers";

export interface Props {
  children: string | React.ReactNode;
  wide?: boolean;
  uppercase?: boolean;
  bold?: boolean;
  className?: string;
  gutter?: boolean;
  underline?: boolean;
}

const classNames = (props: Props) =>
  cleanClasses(`${props.wide ? "tracking-far" : ""} ${props.uppercase ? "uppercase" : ""} ${
    props.gutter ? "!mb-6" : ""
  } ${props.underline ? "border-b border-black" : ""} ${
    props.bold ? "font-bold" : ""
  } ${props.className}`);

export const Heading: React.FC<Props> = (props) => (
  <h1 className={`!text-3xl font-semibold ${classNames(props)}`}>
    {props.children}
  </h1>
);

export const Subheading: React.FC<Props> = (props) => (
  <h1 className={`!text-2xl ${classNames(props)}`}>{props.children}</h1>
);

export const Flowtext: React.FC<Props> = (props) => (
  <h1 className={`!text-base overflow-auto ${classNames(props)}`}>{props.children}</h1>
);
