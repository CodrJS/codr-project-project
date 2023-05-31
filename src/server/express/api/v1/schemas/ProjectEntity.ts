import { MongooseUtil, Types } from "@codrjs/models";
import type { OpenAPIV3_1 } from "openapi-types";

const ProjectEntitySchema: OpenAPIV3_1.SchemaObject = {
  title: "Project Entity Schema",
  allOf: [{ $ref: "#/components/schemas/BaseEntitySchema" }],
  properties: {
    name: { type: "string" },
    bgColorClass: { type: "string" },
    config: {
      type: "object",
      properties: {
        $oid: { type: "string" },
      },
    },
    type: {
      type: "string",
      examples: Object.keys(Types.AnnotationTask),
      default: Types.AnnotationTask.Tagging,
    },
    flags: {
      type: "object",
      properties: {
        isPrivate: {
          type: "boolean",
          default: false,
        },
        isDeleted: {
          type: "boolean",
          default: false,
        },
        isAnonymized: {
          type: "boolean",
          default: false,
        },
      },
      default: {
        ...MongooseUtil.Flags.default,
        isAnonymized: false,
      },
    },
    slug: { type: "string" },
  },
};

export default ProjectEntitySchema;
