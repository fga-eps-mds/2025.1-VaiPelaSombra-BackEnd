import { Router } from 'express';

import { sendRecoveryEmail } from '../controllers/email.controller';

const emailRouter = Router({ mergeParams: true });

emailRouter.get( '/sendRecoveryEmail', sendRecoveryEmail);

export default emailRouter;