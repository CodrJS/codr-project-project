import { IProject, Types, MongooseUtil } from "@codrjs/models";
import { model, Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type ProjectDocument = IProject & AccessibleFieldsModel<IProject>;
const ProjectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true },
    bgColorClass: { type: String, required: true },
    config: {
      type: SchemaTypes.ObjectId,
      ref: "Config",
    },
    type: {
      type: String,
      enum: Object.keys(Types.AnnotationTask),
      required: true,
      default: Types.AnnotationTask.Tagging,
    },
    flags: {
      type: {
        ...MongooseUtil.Flags.type,
        isAnonymized: Boolean,
      },
      required: true,
      default: {
        ...MongooseUtil.Flags.default,
        isAnonymized: false,
      },
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  {
    timestamps: true,
  }
);

// exports Project model.
ProjectSchema.plugin(accessibleFieldsPlugin);
ProjectSchema.plugin(accessibleRecordsPlugin);
const Project = model<IProject, AccessibleModel<ProjectDocument>>(
  "Project",
  ProjectSchema
);
export default Project;
