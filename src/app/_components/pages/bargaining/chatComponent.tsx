import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { CircleUserRound, EllipsisVertical, LoaderCircle, SendHorizontal, X } from "lucide-react";
import socketService from "@/lib/services/socket-service";
import { formatTo12Hour } from "@/lib/utils/commonUtils";
import { getCollobrationConversation } from "@/lib/web-api/collobration";
import { ICollaboration } from "./view";
import { useAuthStore } from "@/lib/store/auth-user";
import { useCreatorStore } from "@/lib/store/creator";
import { useVendorStore } from "@/lib/store/vendor";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import ConfirmDialog from "../settings/components/confirmDialog";

interface IMessage {
  _id: string,
  collaborationId: string,
  creatorId?: string,
  vendorId?: string,
  messageJson: {
    message: string
  },
  isRead: boolean,
  isDeleted: boolean,
  isEdited: boolean,
  createdAt: string,
  updatedAt: string
}
export default function ChatComponent({
  collaborationData,
}: {
  collaborationData: ICollaboration;
}) {
  const translate = useTranslations();
  const params = useParams();
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const collaborationId: any = params?.collaborationId;
  const [message, setMessage] = useState<string>("");
  const { account: user } = useAuthStore();
  const { creator } = useCreatorStore();
  const { vendor } = useVendorStore();
  const userId = creator.creatorId || vendor.vendorId;
  const [messages, setMessages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [messageId, setMessageId] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<IMessage | null>(null);


  useEffect(() => {
    // 1. Connect to socket
    // socketService.connect();

    // 2. Register user by ID
    const id = creator.creatorId || vendor.vendorId;
    if (id) {
      socketService.registerUser(String(id));
    }

    // 3. Join collaboration room
    if (collaborationId) {
      socketService.joinCollaboration(collaborationId);

      // 4. Handle receiving new messages
      socketService.joinedCollaborationMessages((data: any) => {
        setMessages((prev) => [data, ...prev]);

        // If the message was not sent by this user, mark it as read
        if (collaborationId === data.collaborationId && ( user.role === "creator" ? data.creatorId !== userId  : data.vendorId !== userId)) {
          socketService.readMessage({ messageId: data._id, roomId: collaborationId, userId });
        }
      });

      socketService.onMessageDeleted((data: any) => {
        setMessages((prev) => prev.map((msg: any) => (msg._id === data._id) ? { ...msg, isDeleted: true } : msg));
      });

      socketService.onMessageEdited((data: any) => {
        setMessages((prev) => prev.map((msg: any) => (msg._id === data._id) ? { ...msg, messageJson: data.messageJson, isEdited: true } : msg));
      });

      socketService.onReadMessages((data: any) => {
        setMessages((prev) => prev.map((msg: any) => (msg._id === data._id) ? { ...msg, isRead: true } : msg));
      });

      // 5. On initial load — mark all unread messages as read
      socketService.markAllMessagesAsRead({
        collaborationId,
        type: creator.creatorId ? 'creator' : 'vendor'
      });
    }
  }, [creator.creatorId, vendor.vendorId, collaborationId]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
  //       setMessageId("");
  //     }
  //   };
  //   if (messageId) document.addEventListener("mousedown", handleClickOutside);
  //   else document.removeEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [messageId]);
  const fetchCollaborationConversions = async (
    page: number,
    isLoadMore: boolean = false
  ) => {
    if (isLoading) return;
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
      const msg = {
        messageId: "",
        roomId: collaborationId,
        senderId: userId,
        message,
        timestamp: Date.now(),
        sender: user?.role,
      };
      socketService.sendMessage(msg);
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
        if (entry.isIntersecting && !isLoading && !isLoading) {
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

  const handleEditMessage = () => {
    if (message.trim() && editMessage) {
      const msg = {
        messageId: editMessage._id,
        message,
        roomId: collaborationId,
      };
      socketService.editMessage(msg);
      setEditMessage(null);
      setMessage("");
    }
  };

  const handleConfirmDelete = () => {
    socketService.deleteMessage({ messageId: messageId, roomId: collaborationId });
    setShowConfirm(false);
    setMessageId("");
  }

  return (
    <Card className="bg-white md:flex-1 rounded-lg p-4 overflow-hidden shadow-md flex flex-col h-full md:sticky md:top-0">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-stroke">
        <Avatar>
          {collaborationData.creatorId?.profile_image ||
            collaborationData.vendorId?.profile_image ? (
            <AvatarImage
              src={getProfile()}
              className="rounded-full object-cover border border-border"
            />
          ) : (
            <CircleUserRound className="w-8 h-8" color="#EB815B" />
          )}
        </Avatar>
        <div>
          <p className="font-medium text-text md:text-lg text-base">
            {getUserName()}
          </p>
          {/* <p className="text-[#13AD3A] md:text-sm text-xs">{translate("Online")}</p> */}
        </div>
      </div>
      {/* <div className="h-px w-full bg-stroke mx-2"></div>{" "} */}
      <CardContent className="flex flex-col-reverse p-0 pb-2 overflow-y-auto gap-3 h-full">
        {/* {isLoading && <Loading />} */}
        {!isLoading && message?.length < 0 && (
          <p className="opacity-50 text-center">
            {translate("Start_your_chat_now")}
          </p>
        )}
        {!isLoading &&
          messages.map((msg: any, idx) => {
            const owner =
              msg?.creatorId === creator.creatorId ||
              msg?.vendorId === vendor.vendorId;
            const text = msg.messageJson?.message;
            const messageSentTime = msg?.createdAt
              ? formatTo12Hour(msg?.createdAt)
              : "";
            return (
              <div key={idx} className={`flex ${owner ? "justify-end" : "justify-start"} gap-2.5`}>
                <div className={`flex items-start gap-1 ${owner ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar key={idx} className="md:size-8 size-6">
                    <AvatarImage
                      src={
                        owner ? user?.role === "creator" ? creator?.profile_image : vendor?.profile_image : user?.role === "creator"
                          ? collaborationData.vendorId?.profile_image
                          : collaborationData.creatorId?.profile_image
                      }
                      className="rounded-full border border-border md:size-8 size-6 "
                    />
                  </Avatar>
                  <div className={`flex flex-col leading-1.5 p-2 max-w-[70%] min-w-[40%] rounded-lg ${owner ? "bg-pink-100" : "bg-gray-100"} rounded-e-base rounded-es-base`}>
                    {msg?.isDeleted ? <span className="text-gray-500">{translate("Message_deleted")}</span> : <><div className="flex justify-end space-x-1.5 rtl:space-x-reverse">
                      <span className="text-xs text-gray-600">{msg?.isEdited && <span className="text-gray-400">{translate("Edited")}{" "}</span>}{messageSentTime}</span>
                    </div>
                      <p className="text-sm py-1 text-body">{text}</p>
                      {owner && <span className="text-[10px] text-gray-400">{msg.isRead ? "Seen" : "Delivered"}</span>}</>}
                  </div>
                  <div className="relative" ref={dropDownRef}>
                    {owner && !msg?.isDeleted && 
                      <EllipsisVertical className="cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setMessageId(messageId ? "" : msg?._id)}} />
                    }
                    <div id="dropdownDots" className={`z-10 bg-neutral-primary-medium border border-default-medium rounded-md shadow-lg w-30 absolute ${messageId === msg?._id ? "block" : "hidden"} right-5 -top-1 bg-white`}>
                      <ul className="p-1 text-sm text-body font-medium" aria-labelledby="dropdownMenuIconButton">
                        <li onClick={() => {
                          setEditMessage(msg);
                          setMessage(msg?.messageJson?.message);
                          setMessageId("");
                        }} className="block w-full p-2 hover:bg-gray-200 rounded-md hover:cursor-pointer">
                          Edit
                        </li>
                        <li onClick={() => {
                          setShowConfirm(true);
                          setMessageId("");
                        }} className="block w-full p-2 hover:bg-gray-200 rounded-md hover:cursor-pointer">
                          Delete
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
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
      <div className="flex flex-col gap-2 border-t pt-3">
        {editMessage?.messageJson?.message && <div className="flex justify-between items-center bg-green-100 p-1 px-2 rounded-md text-green-800">
          <div className="">
            <span className="text-sm"><span className="text-green-800 font-semibold">{translate("Edit_Message")}:</span> "{editMessage?.messageJson?.message.length > 64 ? editMessage?.messageJson?.message.slice(0, 64) + "..." : editMessage?.messageJson?.message}"</span>
          </div>
          <div>
            <X className="cursor-pointer" onClick={() => {
              setEditMessage(null);
              setMessage("");
            }} />
          </div>
        </div>}
        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Message"
            value={message}
            className="bg-white focus:outline-none"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevents new line addition
                editMessage?.messageJson?.message ? handleEditMessage() : sendMessage();
              }
            }}
          />
          <SendHorizontal
            className="cursor-pointer text-text font-normal stroke-primary"
            onClick={() => editMessage?.messageJson?.message ? handleEditMessage() : sendMessage()}
          />
        </div>
      </div>
      {showConfirm && (
        <ConfirmDialog
          open={showConfirm}
          description={translate("Confirm_Delete_Message")}
          warning={translate("Confirm_Delete_Warning")}
          onClose={() => {
            setShowConfirm(false);
            setMessageId("");
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </Card>
  );
}
