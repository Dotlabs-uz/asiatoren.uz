// hooks/use-media-section.ts
"use client";

import { useEffect, useState } from "react";
import { getMediaSectionBySectionId } from "@/lib/firebase/media-sections";
import { MediaSection } from "@/types/index";

export function useMediaSection(sectionId: string) {
    const [media, setMedia] = useState<MediaSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                setLoading(true);
                const data = await getMediaSectionBySectionId(sectionId);
                setMedia(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, [sectionId]);

    return { media, loading, error };
}
