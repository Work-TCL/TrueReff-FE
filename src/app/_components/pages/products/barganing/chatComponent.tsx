import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

const messages = [
  { sender: "Brand Owner", text: "Hi! Thanks for your interest. The current price is $120, but I can offer a special discount. What's your budget?", time: "11:01AM", owner: true },
  { sender: "User", text: "I was thinking around $100. Would that be possible?", time: "11:02AM", owner: false },
  { sender: "Brand Owner", text: "$100 is a bit low. I can do $110 with free shipping!", time: "11:04AM", owner: true },
  { sender: "User", text: "Can we make it $105? I'll buy right now!", time: "11:05AM", owner: false },
  { sender: "Brand Owner", text: "Alright! $105 it is. Let me update the price for you.", time: "11:06AM", owner: true },
];

export default function ChatComponent() {
  const [input, setInput] = useState("");
  return (
    <Card className="bg-white rounded-lg p-4">
      <div className="flex items-center gap-3 pb-3">
        <Avatar>
          <AvatarImage src="/avatar-owner.png" />
          <AvatarFallback>BO</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">Brand Owner</p>
          <p className="text-green-500 text-sm">Online</p>
        </div>
      </div>
      <CardContent className="space-y-3 mt-4 h-80 overflow-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${msg.owner ? "justify-start" : "justify-end"}`}
          >
            {msg.owner && (
              <Avatar>
                <AvatarImage src="/avatar-owner.png" />
                <AvatarFallback>BO</AvatarFallback>
              </Avatar>
            )}
            <div className={`p-3 rounded-lg ${msg.owner ? "bg-pink-100" : "bg-gray-100"}`}>
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-500 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="mt-3 flex gap-2 border-t pt-3">
        <Input
          placeholder="Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button className="bg-black text-white">Send</Button>
      </div>
      <Button className="mt-3 w-full bg-black text-white">Proceed to Payment</Button>
    </Card>
  );
}
