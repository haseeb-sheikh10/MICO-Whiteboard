"use client";

import Hint from "@/components/Hint";
import { cn } from "@/lib/utils";
import { useOrganization, useOrganizationList } from "@clerk/clerk-react";
import Image from "next/image";
import React, { useCallback } from "react";

const ListItem = ({
   id,
   name,
   image,
}: {
   id: string;
   name: string;
   image: string;
}) => {
   const { organization } = useOrganization();
   const { setActive } = useOrganizationList();

   const isActive = organization?.id === id;

   const handleClick = useCallback(() => {
      if (!setActive) return;

      setActive({
         organization: id,
      });
   }, [id, setActive]);

   return (

      <li className="aspect-square relatve">
         <Hint label={name} side="right">
            <Image
               src={image}
               alt={name}
               className={cn(
                  "rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",
                  isActive && "opacity-100 hover:opacity-75",
               )}
               width={50}
               height={50}
               onClick={handleClick}
            />
         </Hint>
      </li>
   );
};

const OrgList = () => {
   const { userMemberships } = useOrganizationList({
      userMemberships: {
         infinite: true,
      },
   });

   if (!userMemberships?.data?.length) return null;

   return (
      <ul className="space-y-3 pb-3">
         {userMemberships.data.map((mem) => (
            <ListItem
               key={mem.organization.id}
               id={mem.organization.id}
               name={mem.organization.name}
               image={mem.organization.imageUrl}
            />
         ))}
      </ul>
   );
};

export default OrgList;
