import { Button } from "@material-tailwind/react";

export interface Props {
  children: any;
  className?: string;
}

const CustomButton: React.FC<Props> = ({ children, className = ''}) => {
  return (
    <Button ripple className={"bg-primaryHover text-sm tracking-wider " + className}>
      {children}
    </Button>
  );
};

export default CustomButton;