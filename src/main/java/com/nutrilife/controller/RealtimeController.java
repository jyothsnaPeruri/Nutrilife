package com.nutrilife.controller;

import com.nutrilife.dto.NutritionUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/realtime")
@RequiredArgsConstructor
public class RealtimeController {

    private final SimpMessagingTemplate messagingTemplate;

    // Called internally to push live nutrition updates
    @PostMapping("/nutrition-update")
    public void broadcastNutritionUpdate(
            @RequestBody NutritionUpdateDto update) {
        messagingTemplate.convertAndSend(
                "/topic/nutrition/" + update.getUserEmail(), update);
    }
}