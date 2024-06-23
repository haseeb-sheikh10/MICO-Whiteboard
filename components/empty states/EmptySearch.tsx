import Image from "next/image";

const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <Image
        src="/illustrations/empty_search.svg"
        width={250}
        height={250}
        alt="Empty Search illustration"
      />
      <h2 className="text-2xl font-semibold mt-6">No results found!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try searching for something else
      </p>
    </div>
  );
};

export default EmptySearch;
