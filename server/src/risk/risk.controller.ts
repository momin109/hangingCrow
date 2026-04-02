import { Controller, Get } from "@nestjs/common";

@Controller("risk")
export class RiskController {
  @Get("cheat-bets")
  cheatBets() {
    return { message: "Suspicious bets" };
  }

  @Get("surveillance")
  surveillance() {
    return { message: "User activity tracking" };
  }
}
