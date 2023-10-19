import * as Text from "@/components/atoms/Text";


export default function ()
{
    return (
        <div className="flex flex-row justify-center items-center text-center h-full" >
            <div>
            <Text.Heading>
                404
            </Text.Heading>
            <Text.Subheading>
                Page Not Found
            </Text.Subheading>
            <Text.Flowtext>
                Oops...The link you clicked may be broken or the page may have been removed. We're sorry. 
            </Text.Flowtext>
            </div>
            
        </div>
    );
}