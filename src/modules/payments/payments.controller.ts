import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/click/prepare')
  prepare(@Body() body: any) {
    return {
      click_trans_id: '14566027',
      merchant_trans_id: '20441',
      error: -1,
      error_note: 'SIGN CHECK FAILED!',
    };
  }
}
