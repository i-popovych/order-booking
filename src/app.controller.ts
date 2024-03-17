import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('redirection')
@Controller()
export class AppController {
  @Get()
  redirect(@Res() res) {
    return res.redirect('/api/docs');
  }
}
