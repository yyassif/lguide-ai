import { db } from "~/server/db";
import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

interface ServerResponseProps {
  name: string,
  address: string,
  phone: string,
  rating: number,
  website: string,
  image_url: string,
  latitude: number,
  longitude: number,
  overview: string
}

type AIResponseProps = {
  overview : string,
  details: string,
  name: string,
  phone: string,
  website: string,
  rating: number|string,
  image: string,
  address: string,
  isLoaded: boolean
}

export const conversationRouter = {
  getConversations: protectedProcedure
    .query(({ctx}) => {
      return ctx.db.conversation.findMany(
        {
          where: {
            createdById: ctx.session.user.id
          }
        }
      )
    }),

  getConversation: protectedProcedure
    .input(z.object({
      conversationId: z.number()
    }))
    .query(({ctx, input}) => {
      return ctx.db.message.findMany({
        where: {
          conversationId: input.conversationId
        },
        include: {
          place: true
        }
      })
    }),

  addConversation: protectedProcedure
    .mutation(({ctx}) => {
      return ctx.db.conversation.create({
        data: {
          name: 'New Conversation',
          createdById: ctx.session.user.id
        }
      })
    }),

    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        prompt: z.string(),
        transportationMean: z.string(),
        serviceType: z.string(),
        location: z.object({
          lat: z.number(),
          lng: z.number()
        })
      })).mutation(async ({ctx, input}) => {
        // TODO: preprocess data

        const radiuses = {
          'Car': 100000,
          'Walking': 10000
        }

        const query = {
          query: input.prompt,
          service_type: input.serviceType,
          radius: radiuses[input.transportationMean] ?? 10000,
          location: `${input.location.lat},${input.location.lng}`
        }

        await db.conversation.update({
          where: {
            id: input.conversationId
          },
          data: {
            name: input.prompt
          }
        })

        const message = await ctx.db.message.create({
          data: {
            conversationId: input.conversationId,
            query: input.prompt,
            status: 'pending'
          }
        })

        // TODO: feed it to server
        const queryResponse = await fetch('https://guide.yyassif.dev/guideai', {
          method: 'POST',
          body: JSON.stringify(query),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log(queryResponse)

        if(!queryResponse.ok) return null;

        const dataQ = await queryResponse.json();
        console.log(dataQ)
        // TODO: return response
        for (const data of dataQ.places) {
          await ctx.db.place.create({
            data: {
              name: data.name,
              address: data.address,
              phone: data.phone,
              rating: data.rating.toString(),
              website: data.website,
              image_url: data.image_url,
              latitude: data.latitude,
              longitude: data.longitude,
              overview: data.overview,
              message: {
                connect: {
                  id: message.id
                }
              }
            }, 
          })
        }
        await ctx.db.message.update({
          where: {
            id: message.id
          },
          data: {
            overview: dataQ.overview,
            status: 'success',
          }
        })

        const messageWithPlaces = await ctx.db.message.findUnique({
          where: {
            id: message.id
          },
          include: {
            place: true
          }
        })

        return messageWithPlaces
      }),

      
};

