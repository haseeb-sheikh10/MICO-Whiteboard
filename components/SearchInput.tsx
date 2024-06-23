import { Search } from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useDebounceValue } from "usehooks-ts";
import qs from "query-string";

const SearchInput = () => {
  const router = useRouter();
  const [debouncedValue, setValue] = useDebounceValue("", 500);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: "/dashboard",
        query: { search: debouncedValue },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  }, [debouncedValue, router]);

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search ..."
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchInput;
