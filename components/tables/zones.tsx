import {apiFetcher} from "@/helpers";
import {setCurrentZone} from "@/store/features/zone";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import clsx from "clsx";
import {useQuery} from "react-query";
function Zone({zone}: any) {
  const dispatch = useAppDispatch();
  const selectedZone = useAppSelector((state) => state.zone.tab);
  return (
    <button
      key={zone.name}
      onClick={() => dispatch(setCurrentZone(zone.id))}
      className={clsx(
        zone.id === selectedZone
          ? "text-white bg-[#4A5C2F] hover:bg-[#4A5C2F]"
          : "text-black hover:text-gray-700 hover:bg-[#91b35d] border border-black",
        "group w-48 relative shadow-lg  py-4 px-4 text-sm font-medium text-center  rounded-md"
      )}
    >
      <span>{zone.name}</span>
    </button>
  );
}
export default function Zones() {
  const dispatch = useAppDispatch();
  const {
    isLoading,
    error,
    data: zones,
  } = useQuery({
    queryKey: "zones",
    queryFn: () => apiFetcher("/api/zones"),
    onSuccess: (data) => {
      dispatch(setCurrentZone(data[0]?.id));
    },
  });

  if (error) {
    return <div>Error</div>;
  }
  return (
    <div>
      <div className="hidden sm:block">
        {isLoading && (
          <nav
            className="animate-pulse isolate w-full h-14 border flex divide-x-[20px] divide-gray-200  rounded-lg shadow"
            aria-label="Tabs"
          >
            {new Array(5).fill(0).map((zone: any, zoneIdx: any) => (
              <button
                key={zoneIdx}
                className={clsx(
                  "group animate-pulse relative min-w-0 flex-1 overflow-hidden  py-4 px-4 text-sm font-medium text-center  focus:z-10"
                )}
              ></button>
            ))}
          </nav>
        )}
        {zones && (
          <nav className="isolate  h-20 py-2 px-2 bg-[#EAF0F0] overflow-x-auto whitespace-nowrap space-x-10 divide-gray-200  rounded-lg shadow">
            {zones?.map((zone: any) => (
              <Zone key={zone.id} zone={zone} />
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
