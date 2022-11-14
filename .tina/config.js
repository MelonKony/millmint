
  import { defineConfig } from "tinacms";
  
  // Your hosting provider likely exposes this as an environment variable
  const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";
  
  export default defineConfig({
    branch,
    clientId: "56cc7c0c-778d-4932-a6fc-5b4fbc7ff3fe",   // Get this from tina.io
    token: "37668647680919413e6c0f674e54000db17422e4",      // Get this from tina.io
    build: {
      outputFolder: "admin",
      publicFolder: "static",
    },
    media: {
      tina: {
        mediaRoot: "uploads",
        publicFolder: "static",
      },
    },
    schema: {
      collections: [
        {
          name: "post",
          label: "Posts",
          path: "content/posts",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
              isTitle: true,
              required: true,
            },
            {
              type: "rich-text",
              name: "body",
              label: "Body",
              isBody: true,
            },
          ],
        },
      ],
    },
  });
  