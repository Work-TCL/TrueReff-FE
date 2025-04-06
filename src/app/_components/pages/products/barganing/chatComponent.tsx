import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Mic } from "lucide-react";
import socketService from "@/lib/services/socket-service";
import { formatTo12Hour } from "@/lib/utils/commonUtils";
import { getCollobrationConversation } from "@/lib/web-api/collobration";
import { ICollaboration, IProduct } from "../viewProduct/viewDetailProduct";
import { useSession } from "next-auth/react";

const collobrationId = "67ed7899bfe1e50aa282b8f4";
const vendorId = "67e21fb7726fbf0924e90ef0";
const creatorId = "67ed5c9589161c38666f705a";

export default function ChatComponent({productData,collaborationData}:{productData:IProduct,collaborationData:ICollaboration}) {
  const [message, setMessage] = useState("");
  const {data:session} = useSession();
  const user = session?.user;
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("messages",messages)

  useEffect(() => {
    socketService.connect();

    socketService.registerUser(user?.type === "creator"? session?.creator?._id : session?.vendor?._id);

    socketService.joinCollaboration(collaborationData?._id);
    socketService.joinedCollaborationRoom((data) => {});
    socketService.joinedCollaborationMessages((data) => {
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      socketService.disconnect();
    };
  }, [session?.creator?._id,session?.vendor?._id]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        if (!collaborationData?._id) throw "";
        const conversations: any[] = await getCollobrationConversation(
          collaborationData?._id
        );
        setMessages(Array.isArray(conversations) ? conversations : []);
      } catch (error) {
        console.log("while getting conversations");
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {};
  }, [collaborationData?._id]);

  const sendMessage = () => {
    if (message.trim()) {
      socketService.sendMessage(collaborationData?._id, message, collaborationData?.creatorId, collaborationData?.vendorId);
      setMessage("");
    }
  };
  const getUserName = () => {
    return user?.type === "creator" ? session?.creator?.full_name : session?.vendor?.business_name;
  }
  return (
    <Card className="bg-white rounded-lg p-4">
      <div className="flex items-center gap-3 pb-4 border-b-2 border-stroke">
        <Avatar>
          <AvatarImage
            src="/assets/product/diamondRing.webp"
            className="rounded-full border border-border"
          />
        </Avatar>
        <div>
          <p className="font-medium text-text text-lg">{getUserName()}</p>
          <p className="text-[#13AD3A] text-sm">Online</p>
        </div>
      </div>
      <div className="h-px w-full bg-stroke mx-2"></div>{" "}
      <CardContent className="space-y-3 h-80 overflow-auto">
        {isLoading && <p>Loading...</p>}
        {!isLoading &&
          messages.map((msg: any, idx) => {
            const owner = msg?.creatorId?._id === session?.creator?._id || msg?.vendorId?._id === session?.vendor?._id;
            const text = msg.messageJson?.message;
            const messageSentTime = msg?.createdAt
              ? formatTo12Hour(msg?.createdAt)
              : "";
            return (
              <div
                key={idx}
                className={`flex items-end gap-2 ${
                  owner ? "justify-start" : "justify-end"
                }`}
              >
                <div className="flex items-end">
                  {owner && (
                    <Avatar>
                      <AvatarImage
                        src="/assets/product/diamondRing.webp"
                        className="rounded-full border border-border size-8"
                      />
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col ${
                      owner ? "items-start" : "items-end"
                    } `}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        owner ? "bg-pink-100" : "bg-gray-100"
                      }`}
                    >
                      <p className="text-base">{text}</p>
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      {messageSentTime}
                    </p>
                  </div>
                </div>
                {!owner && (
                  <Avatar>
                    <AvatarImage
                      src="/assets/product/diamondRing.webp"
                      className="rounded-full border border-border size-8 "
                    />
                  </Avatar>
                )}
              </div>
            );
          })}
      </CardContent>
      <div className="mt-3 flex gap-2 border-t pt-3">
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
        <Mic />
      </div>
      <Button className="mt-3 w-full bg-black text-white">
        Proceed to Payment
      </Button>
    </Card>
  );
}
