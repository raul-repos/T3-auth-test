
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { UserModel } from "~/utils/z.types";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(UserModel)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: { ...input, id: input.username }
      })
      return user
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  secret: protectedProcedure.query(() => {
    return "Secret Message because you are logged in!"
  })

});
