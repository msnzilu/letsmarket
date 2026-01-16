"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatBot() {
    const params = useParams();
    const analysisId = params?.analysisId as string | undefined;
    const principleSlug = params?.slug as string | undefined;
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your Let's Market assistant. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    analysisId,
                    principleSlug,
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to get response");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, data.message]);
        } catch (error: any) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: error.message || "Sorry, I encountered an error. Please try again later.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Let's Market Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                                        <span className="text-[10px] opacity-80">Always active</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-white/10 p-1 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                            {messages.map((message, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: message.role === "user" ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={index}
                                    className={cn(
                                        "flex gap-2 max-w-[85%]",
                                        message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border",
                                            message.role === "user"
                                                ? "bg-slate-100 border-slate-200"
                                                : "bg-blue-50 border-blue-100 text-blue-600"
                                        )}
                                    >
                                        {message.role === "user" ? <User size={14} /> : <Bot size={14} />}
                                    </div>
                                    <div
                                        className={cn(
                                            "p-3 rounded-2xl text-sm leading-relaxed",
                                            message.role === "user"
                                                ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-200/50"
                                                : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
                                        )}
                                    >
                                        {message.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 mr-auto max-w-[85%]">
                                    <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Bot size={14} />
                                    </div>
                                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                        <Loader2 size={16} className="animate-spin text-blue-600" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-100 bg-white">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="bg-slate-50 border-slate-200 focus:ring-blue-500"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="bg-blue-600 hover:bg-blue-700 shrink-0"
                                    disabled={isLoading || !input.trim()}
                                >
                                    <Send size={18} />
                                </Button>
                            </form>
                            <p className="text-[10px] text-slate-400 text-center mt-2">
                                Powered by Let's Market AI
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                    isOpen
                        ? "bg-slate-800 text-white rotate-90"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                )}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
}
