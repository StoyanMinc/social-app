import { httpRouter } from "convex/server";
import { Webhook } from 'svix';
import { api } from './_generated/api';
import { httpAction } from "./_generated/server";

const http = httpRouter();

// 1. we need to make sure that the webhook is commng from Clerk
// 2. we have to listen for event named "user.created"
// 3. we will save user to the DB (convex)

http.route({
    path: '/clerk-webhook',
    method: 'POST',
    handler: httpAction(async (ctx, req) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Missing webhook secret!");
        }

        //check headers
        const svix_id = req.headers.get('svix-id');
        const svix_signature = req.headers.get('svix-signature');
        const svix_timestamp = req.headers.get('svix-timestamp');

        if (!svix_id || !svix_signature || !svix_timestamp) {
            console.log(svix_id, svix_signature, svix_timestamp);
            return new Response('Mising svix headers', {
                status: 400
            });
        }

        // const payload = await req.text();
        // const body = JSON.stringify(payload);
        const body = await req.text();

        const wh = new Webhook(webhookSecret);
        let evt: any;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature
            }) as any
        } catch (error) {
            console.log('Error verify webhook', error);
            return new Response('Error verify webook', { status: 400 })
        }

        const eventType = evt.type;
        if (eventType === 'user.created') {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;
            const email = email_addresses[0].email_address;
            const name = `${first_name || ''} ${last_name || ''}`.trim();

            try {
                await ctx.runMutation(api.users.createUser, {
                    email,
                    fullName: name,
                    image: image_url,
                    clerkId: id,
                    username: email.split('@')[0]
                })
            } catch (error) {
                console.log('Error create user');
                return new Response('Error create user', { status: 500 });
            }
        }

        return new Response('Webhook processed successfully', { status: 200 });
    })
})

export default http;