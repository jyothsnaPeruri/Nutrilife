package com.nutrilife.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDto {
    private String senderName;
    private String senderEmail;
    private String content;
    private String room;
    private String type;
    private LocalDateTime sentAt;
}