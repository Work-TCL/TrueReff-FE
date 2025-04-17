import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useCallback, useEffect, useRef, useState } from "react";
import { CircleUserRound, LoaderCircle, SendHorizontal } from "lucide-react";
import socketService from "@/lib/services/socket-service";
import { formatTo12Hour } from "@/lib/utils/commonUtils";
import { getCollobrationConversation } from "@/lib/web-api/collobration";
import { ICollaboration } from "./view";
import Loading from "@/app/creator/loading";
import { useAuthStore } from "@/lib/store/auth-user";
import { useCreatorStore } from "@/lib/store/creator";
import { useVendorStore } from "@/lib/store/vendor";
import { useParams } from "next/navigation";
import { translate } from "@/lib/utils/translate";

export default function ChatComponent({
  collaborationData,
}: {
  collaborationData: ICollaboration;
}) {
  const params = useParams();
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const collaborationId: any = params?.collaborationId;
  const [message, setMessage] = useState("");
  const { account: user } = useAuthStore();
  const { creator } = useCreatorStore();
  const { vendor } = useVendorStore();
  const [messages, setMessages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    socketService.connect();

    if (creator.creatorId || vendor.vendorId) {
      let id: any = creator.creatorId || vendor.vendorId;
      id && socketService.registerUser(String(id));
    }

    collaborationId && socketService.joinCollaboration(collaborationId);
    socketService.joinedCollaborationRoom((data) => {});
    socketService.joinedCollaborationMessages((data) => {
      setMessages((prev) => [data.message, ...prev]);
    });

    return () => {
      socketService.disconnect();
    };
  }, [creator.creatorId, vendor.vendorId, collaborationId]);
  const fetchCollaborationConversions = async (
    page: number,
    isLoadMore: boolean = false
  ) => {
    if (!hasMore || isLoading) return;
    isLoadMore ? setLoading(true) : setIsLoading(true);

    try {
      const conversations: any = await getCollobrationConversation(
        collaborationId,
        20,
        page
      );

      if (conversations?.data?.length > 0) {
        setMessages((prev) => [...prev, ...conversations.data]);
        setHasMore(
          messages.length + conversations.data.length < conversations.total
        );
        setIsLoading(false);
        setLoading(false);
      } else {
        setHasMore(false);
        setIsLoading(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };
  const sendMessage = () => {
    if (message.trim()) {
      socketService.sendMessage(
        collaborationData?._id,
        message,
        user?.role === "creator" ? creator.creatorId : undefined,
        user?.role === "vendor" ? vendor.vendorId : undefined
      );
      setMessage("");
    }
  };
  const getUserName = () => {
    return user?.role !== "creator"
      ? collaborationData.creatorId?.user_name
      : collaborationData.vendorId?.business_name;
  };
  const getProfile = () => {
    return user?.role !== "creator"
      ? collaborationData.creatorId?.profile_image
      : collaborationData.vendorId?.profile_image;
  };
  useEffect(() => {
    fetchCollaborationConversions(currentPage, true);
  }, [currentPage]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadingRef, hasMore, isLoading]);

  return (
    <Card className="bg-white md:flex-1 rounded-lg p-4 overflow-hidden flex flex-col md:h-full h-[80vh] md:sticky md:top-0">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-stroke">
        <Avatar>
          {collaborationData.creatorId?.profile_image ||
          collaborationData.vendorId?.profile_image ? (
            <AvatarImage
              src={getProfile()}
              className="rounded-full border border-border"
            />
          ) : (
            <CircleUserRound className="w-8 h-8" color="#EB815B" />
          )}
        </Avatar>
        <div>
          <p className="font-medium text-text md:text-lg text-base">
            {getUserName()}
          </p>
          <p className="text-[#13AD3A] md:text-sm text-xs">Online</p>
        </div>
      </div>
      <div className="h-px w-full bg-stroke mx-2"></div>{" "}
      <CardContent className="flex flex-col-reverse overflow-y-auto gap-3 h-full">
        {/* {isLoading && <Loading />} */}
        {!isLoading && message?.length < 0 && (
          <p className="opacity-50 text-center">
            {translate("Start_your_chat_now")}
          </p>
        )}
        {!isLoading &&
          messages.map((msg: any, idx) => {
            const owner =
              msg?.creatorId?._id === creator.creatorId ||
              msg?.vendorId?._id === vendor.vendorId;
            const text = msg.messageJson?.message;
            const messageSentTime = msg?.createdAt
              ? formatTo12Hour(msg?.createdAt)
              : "";
            return (
              <div
                key={idx}
                className={`flex items-end gap-2 ${
                  !owner ? "justify-start" : "justify-end"
                }`}
              >
                <div className="flex items-end overflow-hidden">
                  {!owner && (
                    <Avatar>
                      <AvatarImage
                        src={
                          user?.role === "creator"
                            ? collaborationData.vendorId?.profile_image
                            : collaborationData.creatorId?.profile_image
                        }
                        className="rounded-full border border-border md:size-8 size-6 "
                      />
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col overflow-hidden  ${
                      !owner ? "items-start" : "items-end"
                    } `}
                  >
                    <div
                      className={`p-3 rounded-lg w-full ${
                        owner ? "bg-pink-100" : "bg-gray-100"
                      }`}
                    >
                      <p className="md:text-base text-sm break-words whitespace-pre-wrap">
                        {text}
                      </p>
                    </div>
                    <p className="md:text-xs text-[10px] text-gray-500 text-right">
                      {messageSentTime}
                    </p>
                  </div>
                </div>
                {owner && (
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.role === "creator"
                          ? collaborationData.creatorId?.profile_image
                          : collaborationData.vendorId?.profile_image
                      }
                      className="rounded-full border border-border md:size-8 size-6"
                    />
                  </Avatar>
                )}
              </div>
            );
          })}
        {hasMore && (
          <div
            className="flex justify-center py-2 text-gray-400"
            ref={loadingRef}
          >
            <LoaderCircle className="animate-spin" color="#ff4979" size={40} />
          </div>
        )}
      </CardContent>
      <div className="flex gap-2 items-center border-t pt-3">
        <Input
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevents new line addition
              sendMessage();
            }
          }}
        />
        <SendHorizontal
          className="cursor-pointer text-text font-normal"
          onClick={() => sendMessage()}
        />
      </div>
    </Card>
  );
}
