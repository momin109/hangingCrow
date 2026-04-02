import { Controller, Post, Body } from "@nestjs/common";

@Controller("messages")
export class MessagesController {
  @Post("user")
  userMessage(@Body() body) {
    return { message: "User message sent" };
  }

  @Post("hyper")
  hyperMessage(@Body() body) {
    return { message: "Hyper message sent" };
  }

  @Post("important")
  importantMessage(@Body() body) {
    return { message: "Important message sent" };
  }

  @Post("image")
  imageMessage(@Body() body) {
    return { message: "Image banner uploaded" };
  }
}
