import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
});

async function getAllVideos() {
  const res = await api.video["get"].$get();
  if (!res.ok) {
    throw new Error("server error");
  }
  const data = await res.json();
  return data;
}

function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ["get-all-videos"],
    queryFn: getAllVideos,
  });

  return (
    <div className="p-2">
      {isLoading ? (
        <div>loading...</div>
      ) : data?.videos && data.videos.length > 0 ? (
        data.videos.map((video) => (
          <div key={video.id}>{video.name}</div> // Assuming each video has a unique id
        ))
      ) : (
        <div>no videos</div>
      )}
    </div>
  );
}
