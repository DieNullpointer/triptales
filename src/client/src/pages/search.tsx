import Container from "@/components/atoms/Container";
import CustomInput from "@/components/atoms/Input";
import { Flowtext } from "@/components/atoms/Text";
import SmallProfile from "@/components/molecules/SmallProfile";
import Loading from "@/components/static/Loading";
import { getAuthorized, getAuthorizedAll } from "@/helpers/authHelpers";
import { searchUsers } from "@/middleware/middleware";
import { User } from "@/types/types";
import React, { useState, useEffect } from "react";

const Search: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState<User[]>();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setResults(await searchUsers(debouncedSearch));
  };

  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(delay);
    };
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch();
    }
  }, [debouncedSearch]);

  return (
    <Container center className="p-5">
      <CustomInput
        type="text"
        onChange={(val) => setSearch(val)}
        value={search}
        placeholder="Search for Users"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
      {!loading ? (
        !results?.length || !debouncedSearch ? (
          <Flowtext center className="mt-4">No Results</Flowtext>
        ) : (
          <div className="space-y-3 mt-4">
            {results && results?.map((user, idx) => (
              <SmallProfile user={user} key={idx} />
            ))}
          </div>
        )
      ) : (
        <Loading />
      )}
    </Container>
  );
};

export default Search;
