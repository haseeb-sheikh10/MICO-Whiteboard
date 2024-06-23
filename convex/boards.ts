import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const IMAGES = [
  "/illustrations/1.png",
  "/illustrations/2.png",
  "/illustrations/3.png",
  "/illustrations/4.png",
  "/illustrations/5.png",
  "/illustrations/6.png",
  "/illustrations/7.png",
  "/illustrations/8.png",
  "/illustrations/9.png",
];

export const create = mutation({
  args: {
    title: v.string(),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];

    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: user.subject,
      authorName: user.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    if (args.favorites) {
      const favBoards = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", user.subject).eq("orgId", args.orgId),
        )
        .order("desc")
        .collect();

      let boards = [];
      for (const fav of favBoards) {
        const board = await ctx.db.get(fav.boardId);
        if (board) {
          boards.push({
            ...board,
            isFavorite: true,
          });
        }
      }
      return boards;
    }

    const title = args.search as string;
    const fav = args.favorites as string;

    let boards = [];

    if (title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId),
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const boardsWithFav = boards.map((board) => {
      return ctx.db
        .query("userFavorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", user.subject).eq("boardId", board._id),
        )
        .unique()
        .then((fav) => {
          return {
            ...board,
            isFavorite: !!fav,
          };
        });
    });

    return Promise.all(boardsWithFav);
  },
});

export const remove = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const existingFav = await ctx.db
      .query("userFavorites")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();

    if (existingFav) {
      for (const fav of existingFav) {
        await ctx.db.delete(fav._id);
      }
    }
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();
    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 50) {
      throw new Error("Title can not be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, { title: args.title });

    return board;
  },
});

export const favourite = mutation({
  args: {
    boardId: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.boardId);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = user.subject;

    const existingFav = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board_org", (q) =>
        q.eq("userId", userId).eq("boardId", board._id).eq("orgId", args.orgId),
      )
      .unique();

    if (existingFav) {
      await ctx.db.delete(existingFav._id);
      return "removed";
    } else {
      await ctx.db.insert("userFavorites", {
        userId,
        boardId: board._id,
        orgId: args.orgId,
      });
      return "added";
    }
  },
});
