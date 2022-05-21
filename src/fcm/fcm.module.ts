import { Global, Module, DynamicModule, Logger } from '@nestjs/common';

import { ValueProvider } from '@nestjs/common/interfaces/modules/provider.interface';
import * as firebaseAdmin from 'firebase-admin';
import { FcmService } from './fcm.service';
import { FcmOptions } from './fcmOptions.interface';
import { FCM_ADMIN, FCM_OPTIONS } from './fcmAdminProvider';

@Module({})
export class FcmModule {
  static forRoot(options: FcmOptions): DynamicModule {
    // const optionsProvider: ValueProvider = {
    //   provide: FCM_OPTIONS,
    //   useValue: options,
    // };

    const credentialFactory = {
      provide: FCM_ADMIN,
      useFactory: () => {
        //error can be occur in this section
        return firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(options.credentialPath),
        });
      },
    };
    const logger = options.logger ? options.logger : new Logger('FcmService');

    return {
      module: FcmModule,
      providers: [
        { provide: Logger, useValue: logger },
        FcmService,
        credentialFactory,
      ],
      exports: [FcmService],
    };
  }
}
