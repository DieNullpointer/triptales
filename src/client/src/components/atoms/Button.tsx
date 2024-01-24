import { Button as TButton } from "@material-tailwind/react";

export interface Props {
  children: any;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "button";
  transparent?: boolean;
}

const Button: React.FC<Props> = ({
  type = "button",
  children,
  className = "",
  onClick,
  transparent = false
}) => {
  return (
    <TButton
      type={type}
      onClick={onClick}
      ripple
      className={
        `${!transparent ? 'bg-primaryHover' : 'bg-gray-200/60 !text-gray-700 hover:bg-gray-400/60 hover:!text-white shadow-none hover:shadow-none'} text-sm tracking-wider font-roboto ${className}`
      }
    >
      {children}
    </TButton>
  );
};

export default Button;
