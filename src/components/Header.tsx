"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { useGetCharacters } from "@/api/Character/useCharacter";
import { useGetEpisodes } from "@/api/Episode/useEpisode";
import { useGetLocations } from "@/api/Location/useLocation";


export default function Header() {
    const router = useRouter();

    const [resource, setResource] = useState<"character" | "episode" | "location">(
        "character"
    );
    const [search, setSearch] = useState("");

    // Debounce input để tránh spam query
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const debounceSearch = useMemo(
        () =>
            debounce((val: string) => {
                setDebouncedSearch(val);
            }, 500),
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debounceSearch(e.target.value);
    };

    // gọi API theo resource
    const { data: charData } = useGetCharacters(
        resource === "character" && debouncedSearch
            ? { name: debouncedSearch, page: 1 }
            : ({} as any)
    );
    const { data: epData } = useGetEpisodes(
        resource === "episode" && debouncedSearch
            ? { name: debouncedSearch, page: 1 }
            : ({} as any)
    );
    const { data: locData } = useGetLocations(
        resource === "location" && debouncedSearch
            ? { name: debouncedSearch, page: 1 }
            : ({} as any)
    );

    const results =
        resource === "character"
            ? charData?.results || []
            : resource === "episode"
                ? epData?.results || []
                : locData?.results || [];

    const handleSelectResult = (id: number | string) => {
        router.push(`/${resource}/${id}`);
        setSearch("");
        setDebouncedSearch("");
    };

    return (
        <div className="bg-white brand-shadow mb-5 px-8 py-5 border-2 rounded w-full max-w-3xl">
            <div className="flex gap-2">
                <Input
                    className="w-[250px]"
                    type="text"
                    placeholder={`Search ${resource}...`}
                    value={search}
                    onChange={handleSearchChange}
                />

                <Select
                    defaultValue="character"
                    onValueChange={(val: "character" | "episode" | "location") =>
                        setResource(val)
                    }
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white w-[200px]">
                        <SelectGroup>
                            <SelectItem className="cursor-pointer" value="character">Character</SelectItem>
                            <SelectItem className="cursor-pointer" value="episode">Episode</SelectItem>
                            <SelectItem className="cursor-pointer" value="location">Location</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Dropdown results */}
            {debouncedSearch && results.length > 0 && (
                <Card className="top-14 z-50 absolute bg-white w-full max-w-xl max-h-[300px] overflow-y-auto">
                    <CardContent className="flex flex-col gap-1 p-2">
                        {results.map((item: any) => (
                            <button
                                key={item.id}
                                className="hover:bg-accent px-2 py-1 rounded text-left"
                                onClick={() => handleSelectResult(item.id)}
                            >
                                {resource === "character" && (
                                    <span>{item.name} — {item.status}</span>
                                )}
                                {resource === "episode" && (
                                    <span>{item.episode}: {item.name}</span>
                                )}
                                {resource === "location" && (
                                    <span>{item.name} ({item.dimension})</span>
                                )}
                            </button>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
