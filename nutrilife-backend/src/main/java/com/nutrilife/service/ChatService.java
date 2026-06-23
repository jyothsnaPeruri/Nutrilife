package com.nutrilife.service;

import com.nutrilife.dto.ChatMessageDto;
import com.nutrilife.model.ChatMessage;
import com.nutrilife.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    public ChatMessageDto saveMessage(ChatMessageDto dto) {
        ChatMessage msg = ChatMessage.builder()
                .senderName(dto.getSenderName())
                .senderEmail(dto.getSenderEmail())
                .content(dto.getContent())
                .room(dto.getRoom() != null ? dto.getRoom() : "general")
                .type(dto.getType() != null ? dto.getType() : "CHAT")
                .sentAt(LocalDateTime.now())
                .build();
        ChatMessage saved = chatMessageRepository.save(msg);
        dto.setSentAt(saved.getSentAt());
        return dto;
    }

    public List<ChatMessageDto> getRecentMessages(String room) {
        return chatMessageRepository
                .findTop50ByRoomOrderBySentAtAsc(room)
                .stream()
                .map(m -> ChatMessageDto.builder()
                        .senderName(m.getSenderName())
                        .senderEmail(m.getSenderEmail())
                        .content(m.getContent())
                        .room(m.getRoom())
                        .type(m.getType())
                        .sentAt(m.getSentAt())
                        .build())
                .collect(Collectors.toList());
    }
}