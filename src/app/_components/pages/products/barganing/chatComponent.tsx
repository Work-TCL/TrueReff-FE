import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Mic } from "lucide-react";

const messages = [
  {
    sender: "User",
    text: "I was thinking around $100. Would that be possible?",
    time: "11:02AM",
    owner: false,
  },
  {
    sender: "Brand Owner",
    text: "$100 is a bit low. I can do $110 with free shipping!",
    time: "11:04AM",
    owner: true,
  },
  {
    sender: "User",
    text: "Can we make it $105? I'll buy right now!",
    time: "11:05AM",
    owner: false,
  },
  {
    sender: "Brand Owner",
    text: "Alright! $105 it is. Let me update the price for you.",
    time: "11:06AM",
    owner: true,
  },
];

export default function ChatComponent() {
  const [input, setInput] = useState("");
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
          <p className="font-medium text-text text-lg">Brand Owner</p>
          <p className="text-[#13AD3A] text-sm">Online</p>
        </div>
      </div>
      <div className="h-px w-full bg-stroke mx-2"></div>{" "}
      <CardContent className="space-y-3 h-80 overflow-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
              msg.owner ? "justify-start" : "justify-end"
            }`}
          >
            <div className="flex items-end">
              {msg.owner && (
                <Avatar>
                  <AvatarImage
                    src="/assets/product/diamondRing.webp"
                    className="rounded-full border border-border size-8"
                  />
                </Avatar>
              )}
              <div
                className={`flex flex-col ${
                  msg.owner ? "items-start" : "items-end"
                } `}
              >
                <div
                  className={`p-3 rounded-lg ${
                    msg.owner ? "bg-pink-100" : "bg-gray-100"
                  }`}
                >
                  <p className="text-base">{msg.text}</p>
                </div>
                <p className="text-xs text-gray-500 text-right">{msg.time}</p>
              </div>
            </div>
            {!msg.owner && (
              <Avatar>
                <AvatarImage
                  src="/assets/product/diamondRing.webp"
                  className="rounded-full border border-border size-8 "
                />
              </Avatar>
            )}
          </div>
        ))}
      </CardContent>
      <div className="mt-3 flex gap-2 border-t pt-3">
        <Input
          placeholder="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Mic />
      </div>
      <Button className="mt-3 w-full bg-black text-white">
        Proceed to Payment
      </Button>
    </Card>
  );
}
