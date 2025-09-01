import type { Actions } from './$types';
import { sendReset } from "$lib/emails/reset";

export const actions: Actions = {
  default: async ({ params, request, url, ...rest }) => {
    const formData = await request.formData() as any;

    const data = Object.fromEntries(formData.entries());

    sendReset(data.email, url.origin);

    return { ...data };
  }
};
