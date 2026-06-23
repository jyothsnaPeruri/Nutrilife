package com.nutrilife.controller;

import com.nutrilife.dto.ChatMessageDto;
import com.nutrilife.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    // WebSocket — send message to room
    @MessageMapping("/chat.send/{room}")
    public void sendMessage(@DestinationVariable String room,
            @Payload ChatMessageDto message) {
        message.setRoom(room);
        ChatMessageDto saved = chatService.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/chat/" + room, saved);
    }

    // WebSocket — user joins room
    @MessageMapping("/chat.join/{room}")
    public void joinRoom(@DestinationVariable String room,
            @Payload ChatMessageDto message) {
        message.setType("JOIN");
        message.setContent(message.getSenderName() + " joined the room");
        messagingTemplate.convertAndSend("/topic/chat/" + room, message);
    }

    // REST — get recent messages
    @GetMapping("/api/chat/{room}/messages")
    public List<ChatMessageDto> getMessages(@PathVariable String room) {
        return chatService.getRecentMessages(room);
    }
}