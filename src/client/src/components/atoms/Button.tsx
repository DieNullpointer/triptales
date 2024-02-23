import { Button as TButton } from "@material-tailwind/react";

export interface Props {
  children: any;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "button";
  transparent?: boolean;
  disabled?: boolean;
}

const Button: React.FC<Props> = ({
  type = "button",
  children,
  className = "",
  onClick,
  transparent = false,
  disabled = false
}) => {
  return (
    <TButton
      type={type}
      onClick={onClick}
      ripple
      disabled={disabled}
      className={
        `${!transparent ? 'bg-primaryHover' : 'bg-gray-200/60 !text-gray-700 hover:bg-gray-400/60 hover:!text-white shadow-none hover:shadow-none'} text-sm tracking-wider font-roboto ${className} flex items-center justify-center`
      }
    >
      {children}
    </TButton>
  );
};

export default Button;
