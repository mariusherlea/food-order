import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { S3 } from "@aws-sdk/client-s3";

import { promises as fsPromises } from "node:fs";

const s3 = new S3({
  region: "eu-north-1",
});

const db = sql("meals.db");

export async function getMeals() {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  // throw new Error("Loading meals fails");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug=?").get(slug);
}

export async function saveMeal(meal) {
  try {
    console.log("Received meal object:", meal);

    // Check if image is defined
    if (!meal.image) {
      throw new Error("Image is not defined");
    }

    console.log("Generating slug...");
    meal.slug = slugify(meal.title, { lower: true });

    console.log("Sanitizing instructions...");
    meal.instructions = xss(meal.instructions);

    console.log("Processing image...");
    const extension = meal.image.name.split(".").pop();
    const fileName = `${meal.slug}.${extension}`;
    const imagePath = `public/images/${fileName}`;

    const bufferedImage = await meal.image.arrayBuffer();
    console.log("Writing image to disk...");
    s3.putObject({
      Bucket: "mariusherlea-recipe-share",
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    });
    meal.image = fileName;

    console.log("Inserting meal into database...");
    db.prepare(
      `INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug) VALUES (
        @title,
        @summary,
        @instructions,    
        @creator,
        @creator_email,
        @image,
        @slug)`
    ).run(meal);

    console.log("Meal saved successfully!");
  } catch (error) {
    console.error("Error saving meal:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error("Error saving meal");
  }
}
