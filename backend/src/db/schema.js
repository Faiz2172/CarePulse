import { pgTable, serial, text, varchar, timestamp, pgEnum ,time ,date} from 'drizzle-orm/pg-core';

// 1. Define the ENUM for blog categories
export const categoryEnum = pgEnum('category_enum', [
  'Technology',
  'Food',
  'Travel',
  'Lifestyle',
  'Education',
  'Other',
]);

// 2. Define the blog_posts table
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: categoryEnum('category').notNull(),
  content: text('content').notNull(),
  image: text('image'), // Optional: URL or path to the image
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

//appointments schema
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  doctor: varchar("doctor", { length: 100 }).notNull(),
  specialty: varchar("specialty", { length: 100 }),
  date: date("date").notNull(),
  time: time("time").notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 20 }).default("pending"),
  type: varchar("type", { length: 20 }).default("regular"),
  location: varchar("location", { length: 200 }),
  comments: text("comments"),
  created_at: date("created_at").defaultNow(),
});