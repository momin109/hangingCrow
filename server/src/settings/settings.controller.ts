import { Controller, Put, Body, Get } from "@nestjs/common";

@Controller("settings")
export class SettingsController {
  @Put("website")
  updateWebsite(@Body() body) {
    return { message: "Website settings updated", data: body };
  }

  @Put("default")
  updateDefault(@Body() body) {
    return { message: "Default settings updated", data: body };
  }

  @Put("p2p")
  updateP2P(@Body() body) {
    return { message: "P2P settings updated", data: body };
  }

  @Put("whitelabel-limit")
  updateLimit(@Body() body) {
    return { message: "Whitelabel limit updated", data: body };
  }

  @Get("all")
  getAll() {
    return { message: "All settings data" };
  }
}
