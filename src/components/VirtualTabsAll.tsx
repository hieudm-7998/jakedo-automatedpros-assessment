"use client"

import React, { useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetCharacters } from "@/api/Character/useCharacter"
import { useGetEpisodes } from "@/api/Episode/useEpisode"
import { useGetLocations } from "@/api/Location/useLocation"
import { useVirtualizer } from "@tanstack/react-virtual"

export default function VirtualTabsAll() {
    const [activeTab, setActiveTab] = useState<"characters" | "episodes" | "locations">("characters")

    const { data: charactersData } = useGetCharacters(
        { page: 1 },
        {
            enabled: activeTab === "characters",
            staleTime: 1000 * 60 * 5
        }
    )
    const { data: episodesData } = useGetEpisodes(
        { page: 1 },
        {
            enabled: activeTab === "episodes",
            staleTime: 1000 * 60 * 5
        }
    )
    const { data: locationsData } = useGetLocations(
        { page: 1 },
        {
            enabled: activeTab === "locations",
            staleTime: 1000 * 60 * 5
        }
    )

    const characters = charactersData?.results || []
    const episodes = episodesData?.results || []
    const locations = locationsData?.results || []

    const createVirtualList = (items: any[]) => {
        const parentRef = useRef<HTMLDivElement>(null)
        const virtualizer = useVirtualizer({
            count: items.length,
            getScrollElement: () => parentRef.current,
            estimateSize: () => 40,
            overscan: 5,
        })
        return { parentRef, virtualizer }
    }

    const charVirtual = createVirtualList(characters)
    const epVirtual = createVirtualList(episodes)
    const locVirtual = createVirtualList(locations)

    const renderVirtualList = (items: any[], virtual: ReturnType<typeof createVirtualList>, type: string) => (
        <div ref={virtual.parentRef} style={{ height: 400, overflow: "auto" }}>
            <div style={{ height: virtual.virtualizer.getTotalSize(), position: "relative" }}>
                {virtual.virtualizer.getVirtualItems().map((vItem) => {
                    const item = items[vItem.index]
                    return (
                        <div
                            key={item.id}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${vItem.start}px)`,
                                padding: "8px 12px",
                                borderBottom: "1px solid #e5e7eb",
                                cursor: "pointer",
                            }}
                            onClick={() => alert(`Go to ${type} detail: ${item.id}`)}
                        >
                            {item.name || item.episode || item.dimension}
                        </div>
                    )
                })}
            </div>
        </div>
    )

    return (
        <Tabs
            defaultValue="characters"
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as any)}
            className="w-full"
        >
            <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="episodes">Episodes</TabsTrigger>
                <TabsTrigger value="locations">Locations</TabsTrigger>
            </TabsList>

            <TabsContent value="characters">{renderVirtualList(characters, charVirtual, "character")}</TabsContent>
            <TabsContent value="episodes">{renderVirtualList(episodes, epVirtual, "episode")}</TabsContent>
            <TabsContent value="locations">{renderVirtualList(locations, locVirtual, "location")}</TabsContent>
        </Tabs>
    )
}
