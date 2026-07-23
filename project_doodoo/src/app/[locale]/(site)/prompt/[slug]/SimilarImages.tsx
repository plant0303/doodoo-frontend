"use client";

import { useEffect, useState } from "react";
import { getSimilarImages } from "@/lib/api";
import { SimilarImageItem } from "@/types/prompt";


export default function SimilarImages({ imageId }: { imageId: string }) {
  const [items, setItems] = useState<SimilarImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await getSimilarImages(imageId);

      if (result) {
        setItems(result);
      }

      setLoading(false);
    }

    load();
  }, [imageId]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!items.length) return <p className="text-gray-500">No similar images found</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 mb-10">
      {items.map((img) => (
        <a
          key={img.id}
          href={`/photo/${img.id}`}
          className="block group"
        >
          <div className="aspect-[4/3] overflow-hidden rounded-xl border border-gray-200">
            <img
              src={img.images?.thumbnail_url}
              alt={img.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <p className="text-xs mt-2 text-gray-600 line-clamp-2">
            {img.title}
          </p>
        </a>
      ))}
    </div>
  );
}
